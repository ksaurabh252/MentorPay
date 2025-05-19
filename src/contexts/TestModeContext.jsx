import { createContext, useContext, useState } from 'react';

export const TestModeContext = createContext();

export const TestModeProvider = ({ children }) => {
  const [testMode, setTestMode] = useState(false);

  return (
    <TestModeContext.Provider value={{ testMode, setTestMode }}>
      {children}
    </TestModeContext.Provider>
  );
};

export const useTestMode = () => useContext(TestModeContext);