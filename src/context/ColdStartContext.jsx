import { createContext, useContext, useState, useCallback } from 'react';

const ColdStartContext = createContext();

export const ColdStartProvider = ({ children }) => {
  const [isColdStarting, setIsColdStarting] = useState(false);

  const showColdStartOverlay = useCallback(() => setIsColdStarting(true), []);
  const hideColdStartOverlay = useCallback(() => setIsColdStarting(false), []);

  return (
    <ColdStartContext.Provider value={{ isColdStarting, showColdStartOverlay, hideColdStartOverlay }}>
      {children}
    </ColdStartContext.Provider>
  );
};

export const useColdStart = () => useContext(ColdStartContext);
