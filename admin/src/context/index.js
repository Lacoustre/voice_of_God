import React from 'react';
import { AuthProvider } from './AuthContext';
import { AppProvider } from './AppContext';

export const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
};

export { useAuth } from './AuthContext';
export { useApp } from './AppContext';