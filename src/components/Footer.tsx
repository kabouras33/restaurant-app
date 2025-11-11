import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface FooterProps {
  contactEmail: string;
  phoneNumber: string;
}

const Footer: React.FC<FooterProps> = ({ contactEmail, phoneNumber }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubscribe = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/subscribe', { email });
      alert('Subscribed successfully!');
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
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p>Email: <a href={`mailto:${contactEmail}`} className="underline">{contactEmail}</a></p>
            <p>Phone: <a href={`tel:${phoneNumber}`} className="underline">{phoneNumber}</a></p>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Quick Links</h2>
            <ul className="list-none">
              <li><Link to="/" className="underline">Home</Link></li>
              <li><Link to="/menu" className="underline">Menu</Link></li>
              <li><Link to="/reservations" className="underline">Reservations</Link></li>
              <li><Link to="/contact" className="underline">Contact</Link></li>
            </ul>
          </div>
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Subscribe to our newsletter</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                if (emailInput.checkValidity()) {
                  handleSubscribe(emailInput.value);
                }
              }}
              className="flex flex-col md:flex-row items-center"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="p-2 rounded-md text-black mb-2 md:mb-0 md:mr-2"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
        <div className="text-center mt-8">
          <p>&copy; {new Date().getFullYear()} Restaurant App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;