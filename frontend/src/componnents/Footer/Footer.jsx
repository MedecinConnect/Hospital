import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold">Our Medical Center</h2>
            <p className="text-gray-400 mt-2">Providing the best medical services since 1990.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
            <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
            <Link to="/services" className="text-gray-400 hover:text-white">Services</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-700 pt-6 text-center">
          <p className="text-gray-500">&copy; 2024 Our Medical Center. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
