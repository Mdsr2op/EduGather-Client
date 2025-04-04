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
            border: 'none',
            outline: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#877EFF',
              color: '#fff',
              border: 'none',
              outline: 'none',
            },
            iconTheme: {
              primary: '#5D5FEF',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              outline: 'none',
            },
          },
          loading: {
            style: {
              background: '#6366F1',
              color: '#fff',
              border: 'none',
              outline: 'none',
            },
          },
        }}
      />
    </>
  );
};

export default ToastProvider; 