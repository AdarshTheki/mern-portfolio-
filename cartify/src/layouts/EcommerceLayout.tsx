import React from 'react';
import { Link } from 'react-router-dom';

const EcommerceLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className='ecommerce-layout'>
      <header className='header p-4 bg-blue-600 text-white'>
        <h1 className='text-xl font-bold'>My E-Commerce Store</h1>
        <nav className='mt-2'>
          <Link to='/' className='mr-4 hover:underline'>
            Home
          </Link>
          <Link to='/cart' className='mr-4 hover:underline'>
            Cart
          </Link>
          <Link to='/checkout' className='hover:underline'>
            Checkout
          </Link>
        </nav>
      </header>

      <main className='p-6'>{children}</main>

      <footer className='footer p-4 bg-gray-100 text-center'>
        &copy; 2025 My E-Commerce Store. All rights reserved.
      </footer>
    </div>
  );
};

export default EcommerceLayout;
