import React, { createContext, useContext, useEffect, useState } from 'react';
import './LoaderContext.css';
const LoaderContext = createContext();
export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      setPendingRequests(prev => {
        const next = prev + 1;
        if (next === 1) setLoading(true);
        return next;
      });

      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        throw error;
      } finally {
        setPendingRequests(prev => {
          const next = prev - 1;
          
            if (next === 0)setTimeout(() => setLoading(false), 400);
            return next;
        });
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <LoaderContext.Provider value={{ loading }}>
      {children}
      {loading && (
<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur z-50 flex items-center justify-center">
  <div className="relative w-24 h-24 rounded-full overflow-hidden p-0 bg-white">
    <img
      src="/images/lioncircuits_logo.jpg"
      alt="Loading"
      className="w-full h-full object-contain rounded-full loader-img"
    />
    <div className="glossy-line absolute inset-0" />
  </div>
</div>

      )}
    </LoaderContext.Provider>
  );
};
