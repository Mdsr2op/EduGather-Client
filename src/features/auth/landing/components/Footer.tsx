import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-dark-1 text-light-1 py-12 border-t border-light-3 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Us */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About EduGather</h3>
            <p className="text-light-3 text-sm">
              EduGather is committed to facilitating seamless collaboration and communication among students and educators. Our platform offers tools for effective study group management, ensuring equal participation and balanced speaking time.
            </p>
          </div>
          
          {/* Quick Links */}
          <nav aria-label="Quick Links">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-light-3 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-light-3 hover:text-primary-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-light-3 hover:text-primary-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-light-3 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-light-3 hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-light-3 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-light-3 hover:text-primary-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Contact Information */}
          <address className="not-italic">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-light-3 text-sm">
              Email: <a href="mailto:mdsrmfkhan@gmail.com" className="text-primary-500 hover:underline">mdsrmfkhan@gmail.com</a><br />
              Phone: <a href="tel:+966539465643" className="text-primary-500 hover:underline">+96653946564</a>
            </p>
          </address>
          
          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com/mdsr2op" aria-label="Instagram" className="text-light-3 hover:text-primary-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/muddassir-m-fahad-18a2a1229/" aria-label="LinkedIn" className="text-light-3 hover:text-primary-500 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://twitter.com/edugather" aria-label="Twitter" className="text-light-3 hover:text-primary-500 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Optional: Newsletter Subscription */}
        <div className="mt-12 border-t border-dark-3 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-light-3 text-sm mb-4 md:mb-0">
              <p className="mb-2">© {new Date().getFullYear()} EduGather. All rights reserved.</p>
              <div className="flex space-x-4">
                <Link to="/privacy-policy" className="text-light-3 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/terms-and-conditions" className="text-light-3 hover:text-primary-500 transition-colors">
                  Terms & Conditions
                </Link>
              </div>
            </div>
            <form className="flex space-x-2" aria-label="Subscribe to our newsletter">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-md bg-dark-3 text-light-1 placeholder-light-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-light-1 font-medium px-4 py-2 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
