import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
        <p className="mb-3">
          This Privacy Policy explains how EduGather ("we", "us", or "our") collects, uses, and shares your information when you use our platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
        <p className="mb-3">We collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-3">
          <li>Account information (name, email, profile picture)</li>
          <li>Usage data (how you interact with our platform)</li>
          <li>Content you create or share (messages, files, recordings)</li>
          <li>Device information (IP address, browser type)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
        <p className="mb-3">We use your information to:</p>
        <ul className="list-disc pl-6 mb-3">
          <li>Provide and improve our services</li>
          <li>Personalize your experience</li>
          <li>Communicate with you about our services</li>
          <li>Ensure security and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Information Sharing</h2>
        <p className="mb-3">
          We don't sell your personal information. We may share information with:
        </p>
        <ul className="list-disc pl-6 mb-3">
          <li>Service providers who help us operate our platform</li>
          <li>Other users (based on your privacy settings)</li>
          <li>Legal authorities when required by law</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
        <p className="mb-3">
          Depending on your location, you may have rights to access, correct, or delete your personal information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
        <p className="mb-3">
          We implement appropriate security measures to protect your personal information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Updates to This Policy</h2>
        <p className="mb-3">
          We may update this policy from time to time. We will notify you of any significant changes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <p className="mb-3">
          If you have questions about this Privacy Policy, please contact us at mdsrmfkhan@gmail.com.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-primary-500 hover:underline">
            &larr; Back to Home
          </Link>
          <Link to="/terms-and-conditions" className="text-primary-500 hover:underline">
            Terms & Conditions &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 