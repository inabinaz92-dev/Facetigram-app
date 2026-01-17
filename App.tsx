
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_DATA } from './data';
import { FacetigramData, User, Post, View, DirectMessage } from './types';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Messages from './components/Messages';
import Profile from './components/Profile';
import Explore from './components/Explore';
import Header from './components/Header';
import { geminiService } from './geminiService';

const App: React.FC = () => {
  const [data, setData] = useState<FacetigramData>(INITIAL_DATA);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_DATA.users[0]);
  const [currentView, setCurrentView] = useState<View>('feed');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Persistence (Mock)
  useEffect(() => {
    const saved = localStorage.getItem('facetigram_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
        // Find the user again to ensure references are fresh
        const freshUser = parsed.users.find((u: User) => u.user_id === currentUser.user_id);
        if (freshUser) setCurrentUser(freshUser);
      } catch (e) {
        console.error("Failed to load local storage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('facetigram_db', JSON.stringify(data));
  }, [data]);

  // Actions
  const toggleFollow = useCallback((targetUserId: number) => {
    setData(prev => {
      const newUsers = prev.users.map(u => {
        if (u.user_id === currentUser.user_id) {
          const isFollowing = u.following.includes(targetUserId);
          return {
            ...u,
            following: isFollowing 
              ? u.following.filter(id => id !== targetUserId)
              : [...u.following, targetUserId]
          };
        }
        if (u.user_id === targetUserId) {
          const isFollower = u.followers.includes(currentUser.user_id);
          return {
            ...u,
            followers: isFollower
              ? u.followers.filter(id => id !== currentUser.user_id)
              : [...u.followers, currentUser.user_id]
          };
        }
        return u;
      });
      return { ...prev, users: newUsers };
    });
  }, [currentUser]);

  const toggleLike = useCallback((postId: number) => {
    setData(prev => ({
      ...prev,
      posts: prev.posts.map(p => {
        if (p.post_id === postId) {
          const liked = p.likes.includes(currentUser.user_id);
          return {
            ...p,
            likes: liked 
              ? p.likes.filter(id => id !== currentUser.user_id)
              : [...p.likes, currentUser.user_id]
          };
        }
        return p;
      })
    }));
  }, [currentUser]);

  const addComment = useCallback((postId: number, content: string) => {
    setData(prev => {
      const newCommentId = Math.max(...prev.comments.map(c => c.comment_id), 1000) + 1;
      const newComment = {
        comment_id: newCommentId,
        post_id: postId,
        user_id: currentUser.user_id,
        content,
        timestamp: new Date().toISOString()
      };
      return {
        ...prev,
        comments: [...prev.comments, newComment],
        posts: prev.posts.map(p => p.post_id === postId ? { ...p, comments: [...p.comments, newCommentId] } : p)
      };
    });
  }, [currentUser]);

  const sendDM = useCallback((receiverId: number, content: string) => {
    setData(prev => {
      const newDmId = Math.max(...prev.direct_messages.map(dm => dm.dm_id), 300) + 1;
      const newDm: DirectMessage = {
        dm_id: newDmId,
        sender_id: currentUser.user_id,
        receiver_id: receiverId,
        content,
        timestamp: new Date().toISOString()
      };
      return {
        ...prev,
        direct_messages: [...prev.direct_messages, newDm]
      };
    });
  }, [currentUser]);

  const createPost = useCallback(async (content: string, imageUrl: string | null) => {
    setData(prev => {
      const newPostId = Math.max(...prev.posts.map(p => p.post_id), 100) + 1;
      const tags = content.match(/#\w+/g) || [];
      const newPost: Post = {
        post_id: newPostId,
        user_id: currentUser.user_id,
        content,
        media_url: imageUrl,
        likes: [],
        comments: [],
        hashtags: tags,
        timestamp: new Date().toISOString()
      };
      return {
        ...prev,
        posts: [newPost, ...prev.posts]
      };
    });
  }, [currentUser]);

  const switchUser = (userId: number) => {
    const user = data.users.find(u => u.user_id === userId);
    if (user) setCurrentUser(user);
  };

  const navigateToProfile = (userId: number) => {
    setSelectedUserId(userId);
    setCurrentView('profile');
  };

  const trendingHashtags = useMemo(() => {
    const counts: Record<string, number> = {};
    data.posts.forEach(p => p.hashtags.forEach(tag => counts[tag] = (counts[tag] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [data.posts]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        currentUser={currentUser}
        onProfileClick={() => navigateToProfile(currentUser.user_id)}
      />
      
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Header 
          currentUser={currentUser} 
          users={data.users} 
          onSwitchUser={switchUser}
          onLogoClick={() => setCurrentView('feed')}
        />

        <div className="max-w-4xl mx-auto px-4 py-6">
          {currentView === 'feed' && (
            <Feed 
              data={data} 
              currentUser={currentUser} 
              onLike={toggleLike}
              onComment={addComment}
              onUserClick={navigateToProfile}
              onCreatePost={createPost}
            />
          )}

          {currentView === 'messages' && (
            <Messages 
              data={data} 
              currentUser={currentUser} 
              onSendMessage={sendDM}
              onUserClick={navigateToProfile}
            />
          )}

          {currentView === 'profile' && selectedUserId && (
            <Profile 
              userId={selectedUserId}
              data={data}
              currentUser={currentUser}
              onToggleFollow={toggleFollow}
              onPostClick={(id) => console.log('post clicked', id)}
            />
          )}

          {currentView === 'explore' && (
            <Explore 
              data={data} 
              currentUser={currentUser}
              onPostClick={(id) => {
                // In a real app we'd open a modal
                console.log('Post clicked', id);
              }}
              trending={trendingHashtags}
            />
          )}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 md:hidden z-50">
        <button onClick={() => setCurrentView('feed')} className={`${currentView === 'feed' ? 'text-black' : 'text-gray-400'}`}>
          <HomeIcon className="w-6 h-6" />
        </button>
        <button onClick={() => setCurrentView('explore')} className={`${currentView === 'explore' ? 'text-black' : 'text-gray-400'}`}>
          <SearchIcon className="w-6 h-6" />
        </button>
        <button onClick={() => setCurrentView('messages')} className={`${currentView === 'messages' ? 'text-black' : 'text-gray-400'}`}>
          <SendIcon className="w-6 h-6" />
        </button>
        <button onClick={() => navigateToProfile(currentUser.user_id)} className={`${currentView === 'profile' ? 'text-black ring-1 ring-black ring-offset-2' : 'text-gray-400'} rounded-full overflow-hidden w-6 h-6`}>
           <img src={currentUser.profile_pic} className="w-full h-full object-cover" />
        </button>
      </div>
    </div>
  );
};

// Simple Icons
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

export default App;
