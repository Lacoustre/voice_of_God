import React from 'react';
import { AuthProvider } from './AuthContext';
import { AppProvider } from './AppContext';
import { UtilsProvider } from './UtilsContext';

export const ContextProvider = ({ children }) => {
  return (
    <AuthProvider>
      <AppProvider>
        <UtilsProvider>
          {children}
        </UtilsProvider>
      </AppProvider>
    </AuthProvider>
  );
};

export { useAuth } from './AuthContext';
export { useApp } from './AppContext';
export { useUtils } from './UtilsContext';