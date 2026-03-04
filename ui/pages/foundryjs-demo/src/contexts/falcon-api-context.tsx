import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import FalconApi from '@crowdstrike/foundry-js';

interface FalconApiContextType {
  falcon: FalconApi;
  navigation: any; // TODO: type this when @crowdstrike/foundry-js has proper types
  isInitialized: boolean;
}

interface FalconApiProviderProps {
  children: ReactNode;
}

const FalconApiContext = createContext<FalconApiContextType | null>(null);

function FalconApiProvider({ children }: FalconApiProviderProps) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const falcon = useMemo(() => new FalconApi(), []);
  const navigation = useMemo(() => {
    return falcon.isConnected ? falcon.navigation : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [falcon.isConnected]);

  useEffect(() => {
    (async () => {
      try {
        await falcon.connect();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to connect to Falcon API:', error);
        // Still set as initialized to allow the app to render
        setIsInitialized(true);
      }
    })();
  }, [falcon]);

  const value: FalconApiContextType = { falcon, navigation, isInitialized };

  return (
    <FalconApiContext.Provider value={value}>
      {children}
    </FalconApiContext.Provider>
  );
}

function useFalconApiContext(): FalconApiContextType {
  const context = useContext(FalconApiContext);
  if (!context) {
    throw new Error('useFalconApiContext must be used within a FalconApiProvider');
  }
  return context;
}


export { useFalconApiContext, FalconApiContext, FalconApiProvider };