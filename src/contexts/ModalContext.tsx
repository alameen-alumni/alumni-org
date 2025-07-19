import { createContext, useContext, useState } from 'react';

interface ModalContextType {
  shown: boolean;
  setShown: (value: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [shown, setShown] = useState(false);
  return (
    <ModalContext.Provider value={{ shown, setShown }}>
      {children}
    </ModalContext.Provider>
  );
} 