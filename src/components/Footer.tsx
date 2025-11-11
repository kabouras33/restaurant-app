import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FooterProps {
  companyName: string;
  year: number;
}

const Footer: React.FC<FooterProps> = ({ companyName, year }) => {
  const { user } = useAuth();

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <Link to="/" className="text-lg font-semibold hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-lg font-semibold hover:text-blue-400 transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-lg font-semibold hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </div>
        <div className="mt-4 md:mt-0 text-center md:text-right">
          <p className="text-sm">
            &copy; {year} {companyName}. All rights reserved.
          </p>
          {user && (
            <p className="text-sm mt-2">
              Logged in as <span className="font-bold">{user.name}</span>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;