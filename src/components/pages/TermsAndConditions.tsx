import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
        <p className="mb-3">
          These Terms and Conditions govern your use of the EduGather platform. By using our platform, you agree to these terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Acceptance of Terms</h2>
        <p className="mb-3">
          By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not use our services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">User Accounts</h2>
        <p className="mb-3">
          When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Acceptable Use</h2>
        <p className="mb-3">You agree not to use the platform to:</p>
        <ul className="list-disc pl-6 mb-3">
          <li>Violate any laws or regulations</li>
          <li>Post unauthorized commercial communications</li>
          <li>Engage in unlawful activities</li>
          <li>Post content that is hateful, threatening, or pornographic</li>
          <li>Harass, bully, or intimidate other users</li>
          <li>Collect users' information without their consent</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Intellectual Property</h2>
        <p className="mb-3">
          The platform and its original content, features, and functionality are owned by EduGather and are protected by international copyright, trademark, and other intellectual property laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">User-Generated Content</h2>
        <p className="mb-3">
          You retain ownership of your content, but grant us a license to use, modify, perform, and display it in connection with our service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Termination</h2>
        <p className="mb-3">
          We may terminate or suspend your account and bar access to the service immediately, without prior notice, for conduct that we determine violates these Terms or is harmful to other users.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
        <p className="mb-3">
          We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
        <p className="mb-3">
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Governing Law</h2>
        <p className="mb-3">
          These Terms shall be governed by the laws of Pakistan, without regard to its conflict of law provisions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <p className="mb-3">
          If you have any questions about these Terms, please contact us at mdsrmfkhan@gmail.com.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <Link to="/privacy-policy" className="text-primary-500 hover:underline">
            &larr; Privacy Policy
          </Link>
          <Link to="/" className="text-primary-500 hover:underline">
            Back to Home &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 