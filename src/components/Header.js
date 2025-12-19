'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { navigationData } from '@/constants/navigation';

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center hover:opacity-80 transition">
            <Image
              src="/tri-county-symbol.png"
              alt="Tri-County Gun Club"
              width={135}
              height={119}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationData.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => item.submenu && handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 rounded hover:bg-gray-800 transition flex items-center"
                >
                  {item.title}
                  {item.submenu && (
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {item.submenu && openDropdown === index && (
                  <div className="absolute left-0 top-full mt-1 bg-white text-gray-900 rounded-lg shadow-lg py-2 min-w-[300px] z-50">
                    {item.submenu.map((subItem, subIndex) => (
                      <div key={subIndex}>
                        {subItem.submenu ? (
                          <div className="relative group">
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                              {subItem.title}
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                            <div className="hidden group-hover:block absolute left-full top-0 bg-white rounded-lg shadow-lg py-2 min-w-[280px] ml-1">
                              {subItem.submenu.map((nestedItem, nestedIndex) => (
                                <Link
                                  key={nestedIndex}
                                  href={nestedItem.href}
                                  className="block px-4 py-2 hover:bg-gray-100 transition"
                                >
                                  {nestedItem.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={subItem.href}
                            className="block px-4 py-2 hover:bg-gray-100 transition"
                          >
                            {subItem.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/members/portal"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition"
            >
              Member Portal Login
            </Link>
            <button
              className="p-2 hover:bg-gray-800 rounded transition"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <button
            className="lg:hidden p-2 hover:bg-gray-800 rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4">
            {navigationData.map((item, index) => (
              <div key={index} className="border-t border-gray-700 pt-2">
                <Link
                  href={item.href}
                  className="block px-4 py-2 hover:bg-gray-800 rounded transition"
                >
                  {item.title}
                </Link>
                {item.submenu && (
                  <div className="pl-4">
                    {item.submenu.map((subItem, subIndex) => (
                      <div key={subIndex}>
                        {subItem.submenu ? (
                          <div>
                            <div className="px-4 py-2 text-sm text-gray-400">
                              {subItem.title}
                            </div>
                            <div className="pl-4">
                              {subItem.submenu.map((nestedItem, nestedIndex) => (
                                <Link
                                  key={nestedIndex}
                                  href={nestedItem.href}
                                  className="block px-4 py-1 text-sm hover:bg-gray-800 rounded transition"
                                >
                                  {nestedItem.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link
                            href={subItem.href}
                            className="block px-4 py-1 text-sm hover:bg-gray-800 rounded transition"
                          >
                            {subItem.title}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-gray-700 pt-2 mt-2">
              <Link
                href="/members/portal"
                className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-center"
              >
                Member Portal Login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
