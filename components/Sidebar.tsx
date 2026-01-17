
import React from 'react';
import { User, View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  currentUser: User;
  onProfileClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, currentUser, onProfileClick }) => {
  const menuItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'feed', label: 'Beranda', icon: <HomeIcon /> },
    { id: 'explore', label: 'Jelajahi', icon: <SearchIcon /> },
    { id: 'messages', label: 'Pesan', icon: <MessageIcon /> },
    { id: 'notifications', label: 'Notifikasi', icon: <HeartIcon /> },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-screen border-r border-gray-200 bg-white p-6 sticky top-0">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tighter italic font-serif">Facetigram</h1>
      </div>
      
      <nav className="flex-1 space-y-4">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex items-center space-x-4 w-full p-3 rounded-lg transition-all ${
              currentView === item.id ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'
            }`}
          >
            <span className="w-6 h-6">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        <button
          onClick={onProfileClick}
          className={`flex items-center space-x-4 w-full p-3 rounded-lg transition-all ${
            currentView === 'profile' ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200">
            <img src={currentUser.profile_pic} className="w-full h-full object-cover" />
          </div>
          <span>Profil</span>
        </button>
      </nav>

      <div className="mt-auto">
        <button className="flex items-center space-x-4 w-full p-3 rounded-lg hover:bg-gray-50 transition-all text-gray-500">
          <MenuIcon />
          <span>Lainnya</span>
        </button>
      </div>
    </div>
  );
};

const HomeIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const SearchIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
);
const MessageIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
);
const HeartIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const MenuIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);

export default Sidebar;
