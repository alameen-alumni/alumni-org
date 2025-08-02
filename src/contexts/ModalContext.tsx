import { createContext, useContext, useState } from 'react';
import { type ModalProviderProps, type ModalContextType } from '../types';

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};

export function ModalProvider({ children }: ModalProviderProps) {
  const [shown, setShown] = useState(false);
  return (
    <ModalContext.Provider value={{ shown, setShown }}>
      {children}
    </ModalContext.Provider>
  );
} 