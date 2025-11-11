import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface FooterProps {
  contactEmail: string;
  phoneNumber: string;
}

const Footer: React.FC<FooterProps> = ({ contactEmail, phoneNumber }) => {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post('/api/newsletter/subscribe', { email: newsletterEmail });
      setSuccess('Successfully subscribed to the newsletter!');
      setNewsletterEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold">Contact Us</h2>
            <p>Email: <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a></p>
            <p>Phone: <a href={`tel:${phoneNumber}`} className="underline">{phoneNumber}</a></p>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold">Quick Links</h2>
            <ul className="list-none">
              <li><Link to="/" className="underline">Home</Link></li>
              <li><Link to="/about" className="underline">About Us</Link></li>
              <li><Link to="/contact" className="underline">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Newsletter</h2>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col md:flex-row items-center">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="p-2 rounded-md text-black"
                placeholder="Your email"
                aria-label="Email for newsletter subscription"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ml-0 md:ml-2 mt-2 md:mt-0"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {success && <p className="text-green-500 mt-2">{success}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;