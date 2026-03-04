import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { FalconApiProvider, useFalconApiContext } from '../falcon-api-context.tsx';

// Mock the FalconApi
vi.mock('@crowdstrike/foundry-js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      connect: vi.fn().mockResolvedValue(undefined),
      disconnect: vi.fn(),
      isConnected: true,
      events: {
        on: vi.fn(),
        off: vi.fn(),
      },
      navigation: {
        navigateTo: vi.fn(),
      },
    })),
  };
});

describe('FalconApiContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFalconApiContext', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useFalconApiContext());
      }).toThrow('useFalconApiContext must be used within a FalconApiProvider');

      consoleError.mockRestore();
    });

    it('should provide falcon api context', () => {
      const { result } = renderHook(() => useFalconApiContext(), {
        wrapper: FalconApiProvider,
      });

      expect(result.current).toHaveProperty('falcon');
      expect(result.current).toHaveProperty('navigation');
      expect(result.current).toHaveProperty('isInitialized');
    });

    it('should initialize as not initialized', () => {
      const { result } = renderHook(() => useFalconApiContext(), {
        wrapper: FalconApiProvider,
      });

      expect(result.current.isInitialized).toBe(false);
    });

    it('should set initialized to true after connection', async () => {
      const { result } = renderHook(() => useFalconApiContext(), {
        wrapper: FalconApiProvider,
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });
    });

    it('should create falcon instance', () => {
      const { result } = renderHook(() => useFalconApiContext(), {
        wrapper: FalconApiProvider,
      });

      expect(result.current.falcon).toBeDefined();
      expect(typeof result.current.falcon.connect).toBe('function');
    });

    it('should provide navigation when connected', async () => {
      const { result } = renderHook(() => useFalconApiContext(), {
        wrapper: FalconApiProvider,
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      // Navigation should be available when falcon is connected
      expect(result.current.navigation).toBeDefined();
    });
  });

  describe('FalconApiProvider', () => {
    it('should render children', () => {
      const TestComponent = () => {
        const { falcon } = useFalconApiContext();
        return <div>Falcon: {falcon ? 'present' : 'absent'}</div>;
      };

      const { result } = renderHook(() => useFalconApiContext(), {
        wrapper: ({ children }) => (
          <FalconApiProvider>
            <TestComponent />
            {children}
          </FalconApiProvider>
        ),
      });

      expect(result.current.falcon).toBeDefined();
    });

    it('should handle connection errors gracefully', async () => {
      // Mock connect to reject
      const FalconApiMock = await import('@crowdstrike/foundry-js');
      const mockConnect = vi.fn().mockRejectedValue(new Error('Connection failed'));

      (FalconApiMock.default as any).mockImplementation(() => ({
        connect: mockConnect,
        isConnected: false,
        events: { on: vi.fn(), off: vi.fn() },
      }));

      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      const { result } = renderHook(() => useFalconApiContext(), {
        wrapper: FalconApiProvider,
      });

      // Should still initialize even on connection error
      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      consoleError.mockRestore();
    });
  });
});
