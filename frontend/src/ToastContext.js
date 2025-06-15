import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastMessage from './ToastMessage';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ show: true, message, type, duration });
  }, []);

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastMessage
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
        duration={toast.duration}
      />
    </ToastContext.Provider>
  );
};
