
import React, { useState } from 'react';
import { FacetigramData, User, Post } from '../types';
import PostCard from './PostCard';
import { geminiService } from '../geminiService';

interface FeedProps {
  data: FacetigramData;
  currentUser: User;
  onLike: (id: number) => void;
  onComment: (id: number, content: string) => void;
  onUserClick: (id: number) => void;
  onCreatePost: (content: string, url: string | null) => void;
}

const Feed: React.FC<FeedProps> = ({ data, currentUser, onLike, onComment, onUserClick, onCreatePost }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCaption = async () => {
    if (!newPostContent) return;
    setIsGenerating(true);
    const caption = await geminiService.generateCaption(newPostContent);
    setNewPostContent(caption);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onCreatePost(newPostContent, `https://picsum.photos/seed/${Math.random()}/800/600`);
    setNewPostContent('');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Stories */}
      <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
        {data.users.map(user => (
          <button 
            key={user.user_id} 
            onClick={() => onUserClick(user.user_id)}
            className="flex flex-col items-center flex-shrink-0 space-y-1"
          >
            <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                <img src={user.profile_pic} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="text-xs text-gray-500 max-w-[70px] truncate">{user.username}</span>
          </button>
        ))}
      </div>

      {/* Create Post */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-3">
            <img src={currentUser.profile_pic} className="w-10 h-10 rounded-full object-cover" />
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Apa yang Anda pikirkan?"
              className="flex-1 resize-none bg-gray-50 border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-gray-300 outline-none h-24"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                type="button" 
                onClick={handleGenerateCaption}
                disabled={isGenerating}
                className="text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors flex items-center"
              >
                {isGenerating ? 'Menghasilkan...' : 'AI Caption ✨'}
              </button>
              <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
            <button 
              type="submit"
              disabled={!newPostContent.trim()}
              className="bg-black text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              Bagikan
            </button>
          </div>
        </form>
      </div>

      {/* Posts */}
      <div className="space-y-8">
        {data.posts.map(post => (
          <PostCard 
            key={post.post_id} 
            post={post} 
            users={data.users}
            comments={data.comments}
            currentUser={currentUser}
            onLike={() => onLike(post.post_id)}
            onComment={(c) => onComment(post.post_id, c)}
            onUserClick={onUserClick}
          />
        ))}
      </div>
    </div>
  );
};

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default Feed;
