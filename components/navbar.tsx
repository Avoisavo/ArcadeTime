import React from 'react';
import Link from 'next/link';

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
    <div className="bg-black text-white h-screen w-64 fixed left-0 flex flex-col border-r border-purple-700/30 arcade-sidebar">
      <div className="p-4">
        <nav className="mt-4">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name} 
                className={`flex justify-between items-center p-2 rounded transition-all duration-200 ${
                  activePage === item.name.toLowerCase() 
                    ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 shadow-[0_0_8px_rgba(138,43,226,0.3)]' 
                    : 'hover:bg-purple-900/20'
                }`}
              >
                <Link href={item.path} className="w-full">
                  <span className={`text-sm ${
                    activePage === item.name.toLowerCase() 
                      ? 'text-white font-bold arcade-text-glow' 
                      : 'text-gray-400'
                  }`}>
                    {item.name}
                  </span>
                </Link>
                <span className={`text-xs px-2 py-1 rounded-md ${
                  activePage === item.name.toLowerCase()
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-300'
                }`}>
                  {item.count}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <style jsx global>{`
        .arcade-sidebar {
          background-image: 
            linear-gradient(to bottom, rgba(25,25,25,1) 0%, rgba(10,10,10,1) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-blend-mode: multiply;
        }
        
        .arcade-text-glow {
          text-shadow: 0 0 2px #fff, 0 0 5px rgba(138,43,226,0.8);
        }
        
        .arcade-pixel-border {
          box-shadow: 
            0 0 0 2px #8a2be2,
            0 0 0 4px #000,
            0 0 5px 4px rgba(138,43,226,0.3);
        }
      `}</style>
    </div>
  );
};

export default Navbar;
