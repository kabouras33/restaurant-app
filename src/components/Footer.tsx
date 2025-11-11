import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [contactInfo, setContactInfo] = React.useState<{ email: string; phone: string } | null>(null);

  React.useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/contact-info');
        setContactInfo(response.data);
      } catch (err) {
        setError('Failed to load contact information.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold hover:text-gray-400">
              RestaurantApp
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/about" className="hover:text-gray-400">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-gray-400">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-gray-400">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center">
          {loading ? (
            <p className="text-gray-400">Loading contact info...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : contactInfo ? (
            <div>
              <p>Email: <a href={`mailto:${contactInfo.email}`} className="hover:text-gray-400">{contactInfo.email}</a></p>
              <p>Phone: <a href={`tel:${contactInfo.phone}`} className="hover:text-gray-400">{contactInfo.phone}</a></p>
            </div>
          ) : null}
        </div>
        <div className="mt-4 text-center text-gray-400">
          &copy; {new Date().getFullYear()} RestaurantApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;