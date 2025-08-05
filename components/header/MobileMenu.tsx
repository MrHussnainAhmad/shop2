"use client";
import { AlignLeft, X, Home, ShoppingBag, User, Phone, ShoppingCart, Tag } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Deals', href: '/deals', icon: Tag },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Account', href: '/account/account', icon: User },
    { name: 'Contact', href: '/contactus', icon: Phone },
  ];

  return (
    <>
      <button 
        onClick={toggleMenu}
        className='hover:text-orange-500 hoverEffect md:hidden'
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <X /> : <AlignLeft />}
      </button>
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-custom-navBar bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 left-0 h-screen w-80 bg-custom-navBar shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 pb-[1.6rem] border-b border-custom-sec3">
              <h2 className="text-lg font-semibold text-custom-text">Menu</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-custom-sec1 hover:bg-opacity-20 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-custom-text" />
              </button>
            </div>
            
            {/* Menu Items - Scrollable */}
            <nav className="p-4 pb-20 overflow-y-auto" style={{height: 'calc(100vh - 80px - 72px)'}}>
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link 
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-custom-sec1 hover:bg-opacity-20 transition-colors duration-200"
                      >
                        <Icon className="w-5 h-5 text-custom-sec3" />
                        <span className="font-medium text-custom-text">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Menu Footer - Fixed at bottom of screen */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-custom-sec3 bg-custom-sec1 bg-opacity-20">
              <p className="text-sm text-custom-text text-center">
                Need help? <Link href="/contactus" className="text-custom-sec3 hover:text-custom-sec4 transition-colors">Contact us</Link>
              </p>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MobileMenu
