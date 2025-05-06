import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  activeTab?: string;
}

const Header: React.FC<HeaderProps> = ({ activeTab = 'Games' }) => {
  const tabs = [
    { name: 'Games', path: '/games' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Transactions', path: '/transactions' },
    { name: 'Shop', path: '/shop' }
  ];

  return (
    <header className="bg-black text-white p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex space-x-12 mx-auto">
        {tabs.map((tab) => (
          <Link 
            key={tab.name} 
            href={tab.path}
            className={`text-sm font-medium py-2 px-4 ${activeTab === tab.name ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-200'}`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm absolute right-8">
        Login with Flow Wallet
      </button>
    </header>
  );
};

export default Header;
