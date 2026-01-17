
import React from 'react';
import { FacetigramData, User } from '../types';

interface ExploreProps {
  data: FacetigramData;
  currentUser: User;
  onPostClick: (id: number) => void;
  trending: [string, number][];
}

const Explore: React.FC<ExploreProps> = ({ data, onPostClick, trending }) => {
  return (
    <div className="space-y-8">
      {/* Trending Section */}
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.876 7.998 7.998 0 00-4.391 7.703c.034.198.034.399.034.599a8 8 0 1016 0V11a.999.999 0 00-.01-.1c-.137-1.722-.651-3.76-1.514-5.54-.86-1.78-2.011-3.43-3.04-4.807zM10 15a2 2 0 110-4 2 2 0 010 4z" clipRule="evenodd" />
          </svg>
          <span>Sedang Tren</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {trending.map(([tag, count]) => (
            <div 
              key={tag} 
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50 cursor-pointer shadow-sm transition-all"
            >
              <span className="text-blue-500 mr-1">#</span>
              {tag.replace('#', '')}
              <span className="ml-2 text-xs text-gray-400 font-normal">{count} post</span>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Grid */}
      <section>
        <h3 className="text-lg font-bold mb-4">Jelajahi Konten</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
          {data.posts.map((post, idx) => (
            <button
              key={post.post_id}
              onClick={() => onPostClick(post.post_id)}
              className={`relative aspect-square group overflow-hidden bg-gray-100 rounded-lg shadow-sm ${idx % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
            >
              {post.media_url ? (
                <img src={post.media_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6 text-sm text-gray-400 italic">
                  {post.content}
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                <div className="flex space-x-4 mb-2">
                  <span className="flex items-center space-x-1 font-bold">
                    <HeartIcon className="w-5 h-5" />
                    <span>{post.likes.length}</span>
                  </span>
                  <span className="flex items-center space-x-1 font-bold">
                    <ChatIcon className="w-5 h-5" />
                    <span>{post.comments.length}</span>
                  </span>
                </div>
                <p className="text-xs text-center line-clamp-2 opacity-80">{post.content}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
);
const ChatIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-4 0H9v2h2V9z" clipRule="evenodd" /></svg>
);

export default Explore;
