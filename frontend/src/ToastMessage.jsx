// components/ToastMessage.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// You can customize these colors/icons
const toastStyles = {
  success: {
    bg: 'bg-green-600',
    icon: '✅',
  },
  error: {
    bg: 'bg-red-600',
    icon: '❌',
  },
  warning: {
    bg: 'bg-yellow-500',
    icon: '⚠️',
  },
  info: {
    bg: 'bg-blue-600',
    icon: 'ℹ️',
  },
};

const ToastMessage = ({ show, message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  const { bg, icon } = toastStyles[type] || toastStyles.info;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`fixed bottom-6 right-6 text-white px-5 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 ${bg}`}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-xl">{icon}</span>
          <span>{message}</span>
          <button onClick={onClose} className="ml-auto text-white text-lg">✖</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastMessage;
