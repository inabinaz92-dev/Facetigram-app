
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  users: User[];
  onSwitchUser: (userId: number) => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, users, onSwitchUser, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center md:hidden">
        <button onClick={onLogoClick} className="text-xl font-bold tracking-tighter italic font-serif">
          Facetigram
        </button>
      </div>

      <div className="hidden md:block flex-1 max-w-xs ml-4">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari..."
            className="block w-full pl-10 pr-3 py-1.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 sm:text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <div className="relative group">
          <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
              <img src={currentUser.profile_pic} className="w-full h-full object-cover" alt={currentUser.username} />
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{currentUser.username}</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-2 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Ganti Akun</p>
            </div>
            {users.map(user => (
              <button
                key={user.user_id}
                onClick={() => onSwitchUser(user.user_id)}
                className={`flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-md transition-colors ${user.user_id === currentUser.user_id ? 'bg-blue-50' : ''}`}
              >
                <img src={user.profile_pic} className="w-6 h-6 rounded-full object-cover" alt="" />
                <span className="text-sm text-gray-700">{user.username}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
