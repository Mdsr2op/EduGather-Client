import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
          loading: {
            style: {
              background: '#6366F1',
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider; 