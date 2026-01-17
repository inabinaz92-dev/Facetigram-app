
import React from 'react';
import { FacetigramData, User } from '../types';

interface ProfileProps {
  userId: number;
  data: FacetigramData;
  currentUser: User;
  onToggleFollow: (id: number) => void;
  onPostClick: (id: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ userId, data, currentUser, onToggleFollow, onPostClick }) => {
  const user = data.users.find(u => u.user_id === userId);
  const userPosts = data.posts.filter(p => p.user_id === userId);
  const isMe = currentUser.user_id === userId;
  const isFollowing = currentUser.following.includes(userId);

  if (!user) return <div className="p-8 text-center text-gray-500">User tidak ditemukan.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12 px-4 mb-12">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <img src={user.profile_pic} className="w-full h-full object-cover" alt={user.username} />
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <h2 className="text-xl md:text-2xl font-light text-gray-800">{user.username}</h2>
            <div className="flex space-x-2">
              {isMe ? (
                <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                  Edit Profil
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => onToggleFollow(user.user_id)}
                    className={`px-6 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      isFollowing ? 'border border-gray-300 hover:bg-gray-50' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? 'Berhenti Mengikuti' : 'Ikuti'}
                  </button>
                  <button className="px-4 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                    Kirim Pesan
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-start space-x-8 mb-6">
            <div className="text-sm"><span className="font-semibold">{userPosts.length}</span> postingan</div>
            <div className="text-sm"><span className="font-semibold">{user.followers.length}</span> pengikut</div>
            <div className="text-sm"><span className="font-semibold">{user.following.length}</span> diikuti</div>
          </div>

          <div>
            <p className="font-semibold text-sm mb-1">{user.username}</p>
            <p className="text-sm whitespace-pre-wrap">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* Grid Filter */}
      <div className="border-t border-gray-200 flex justify-center space-x-12">
        <button className="py-4 border-t border-black -mt-px flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest">
          <GridIcon className="w-3 h-3" />
          <span>Postingan</span>
        </button>
        <button className="py-4 text-gray-400 flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest">
          <BookmarkIcon className="w-3 h-3" />
          <span>Tersimpan</span>
        </button>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-6">
        {userPosts.length > 0 ? (
          userPosts.map(post => (
            <button 
              key={post.post_id} 
              onClick={() => onPostClick(post.post_id)}
              className="relative aspect-square group overflow-hidden bg-gray-100"
            >
              {post.media_url ? (
                <img src={post.media_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs text-gray-400 italic">
                  {post.content.substring(0, 40)}...
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white font-semibold">
                <div className="flex items-center space-x-1">
                  <HeartFilledIcon className="w-5 h-5" />
                  <span>{post.likes.length}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CommentFilledIcon className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-3 py-20 text-center">
             <div className="w-16 h-16 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <CameraIcon className="w-8 h-8 text-gray-300" />
             </div>
             <h3 className="text-2xl font-light text-gray-400">Belum ada postingan</h3>
          </div>
        )}
      </div>
    </div>
  );
};

const GridIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
);
const HeartFilledIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
);
const CommentFilledIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" /></svg>
);
const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

export default Profile;
