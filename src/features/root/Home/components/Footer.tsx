

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-dark-3 text-light-1 py-10"
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-8 lg:space-y-0">
          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row sm:space-x-8 space-y-4 sm:space-y-0 text-sm font-medium">
            <Link to="/about" className="text-light-1 hover:text-primary-500 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-light-1 hover:text-primary-500 transition-colors">
              Contact
            </Link>
            <Link to="/terms-of-service" className="text-light-1 hover:text-primary-500 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy-policy" className="text-light-1 hover:text-primary-500 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/help-center" className="text-light-1 hover:text-primary-500 transition-colors">
              Help Center
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-light-1 hover:text-primary-500 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-light-1 hover:text-primary-500 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-light-1 hover:text-primary-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-dark-5 pt-4 text-sm text-light-3">
          © {currentYear} EduGather. All rights reserved.
        </div>
      </div>
    </footer>
  );
}