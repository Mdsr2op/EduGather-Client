import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';

export const ProfileSetupSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 3 seconds to home instead of discover-groups
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark-1 flex flex-col justify-center items-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-dark-3 rounded-2xl shadow-lg p-8 text-center"
      >
        <div className="mx-auto w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mb-6">
          <FiCheck className="text-primary-500 text-4xl" />
        </div>
        
        <h2 className="text-2xl font-bold text-light-1 mb-3">Profile Setup Complete!</h2>
        <p className="text-light-3 mb-6">
          Your profile has been successfully set up. You'll be redirected to your home page in a moment.
        </p>
        
        <div className="w-full bg-dark-4 h-2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
          />
        </div>
      </motion.div>
    </div>
  );
}; 