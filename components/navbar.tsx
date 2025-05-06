import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NavbarProps {
  activePage?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activePage }) => {
  const navItems = [
    { name: 'My games', count: 12, path: '/library' },
    { name: 'Installed games', count: 5, path: '/installed' },
    { name: 'All games', count: 37, path: '/games' },
    { name: 'Favorites', count: 8, path: '/favorites' },
  ];

  return (
    <div className="bg-black text-white h-screen w-64 fixed left-0 flex flex-col">
      <div className="p-4">
        <Link href="/">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-6">
            <Image 
              src="/arcade/profileavatar.png" 
              width={30} 
              height={30} 
              alt="Profile"
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </Link>

        <nav className="mt-8">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name} className="flex justify-between items-center">
                <Link href={item.path}>
                  <span className={`text-sm ${activePage === item.name.toLowerCase() ? 'text-white' : 'text-gray-400'}`}>
                    {item.name}
                  </span>
                </Link>
                <span className="bg-gray-800 text-xs rounded px-2 py-1">{item.count}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="flex items-center border border-purple-700 rounded-md p-2 bg-gray-900">
          <div className="w-12 h-12 relative mr-2">
            <Image
              src="/arcade/metaloot.png"
              alt="Meta Loot"
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23712CF9'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='8' fill='white' text-anchor='middle' dominant-baseline='middle'%3EML%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div>
            <h3 className="text-white text-xs font-bold uppercase">META LOOT</h3>
            <p className="text-gray-400 text-xs">10 rewards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
