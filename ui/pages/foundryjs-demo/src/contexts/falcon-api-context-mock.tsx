import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface NavigateOptions {
  path?: string;
  [key: string]: any;
}

interface Navigation {
  navigateTo: (options: NavigateOptions) => void;
}

interface Events {
  on: (event: string, handler?: any) => void;
  off: (event: string, handler?: any) => void;
}

interface FalconApiContextValue {
  falcon: MockFalconApi;
  navigation: Navigation;
  isInitialized: boolean;
}

const FalconApiContext = createContext<FalconApiContextValue | null>(null);

// Mock Falcon API for local development
class MockFalconApi {
  isConnected: boolean;
  navigation: Navigation;
  events: Events;

  constructor() {
    this.isConnected = true;
    this.navigation = {
      navigateTo: (options: NavigateOptions) => {
        console.log('[Mock] Navigate to:', options);
      }
    };
    this.events = {
      on: (event: string, _handler?: any) => {
        console.log('[Mock] Register event listener:', event);
      },
      off: (event: string, _handler?: any) => {
        console.log('[Mock] Remove event listener:', event);
      }
    };
  }

  async connect() {
    console.log('[Mock] Falcon API connected');
    return Promise.resolve();
  }
}

function FalconApiProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [falcon] = useState(() => new MockFalconApi());

  useEffect(() => {
    (async () => {
      try {
        await falcon.connect();
        setIsInitialized(true);
      } catch (error) {
        console.error('[Mock] Failed to connect:', error);
        setIsInitialized(true);
      }
    })();
  }, [falcon]);

  const value: FalconApiContextValue = {
    falcon,
    navigation: falcon.navigation,
    isInitialized
  };

  return (
    <FalconApiContext.Provider value={value}>
      {children}
    </FalconApiContext.Provider>
  );
}

function useFalconApiContext() {
  const context = useContext(FalconApiContext);
  if (!context) {
    throw new Error('useFalconApiContext must be used within a FalconApiProvider');
  }
  return context;
}


export { useFalconApiContext, FalconApiContext, FalconApiProvider };
