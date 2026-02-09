import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FalconApiProvider } from './contexts/falcon-api-context.tsx';
import { EventsProvider } from './contexts/events-context.tsx';
import { vi } from 'vitest';

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  withRouter?: boolean;
  withFalconApi?: boolean;
  withEvents?: boolean;
}

/**
 * Custom render function that wraps components with common providers
 * Usage: renderWithProviders(<MyComponent />)
 */
export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const {
    initialEntries = ['/'],
    withRouter = true,
    withFalconApi = true,
    withEvents = true,
    ...renderOptions
  } = options;

  let Wrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  if (withFalconApi) {
    const PreviousWrapper = Wrapper;
    Wrapper = ({ children }: { children: React.ReactNode }) => (
      <PreviousWrapper>
        <FalconApiProvider>{children}</FalconApiProvider>
      </PreviousWrapper>
    );
  }

  if (withEvents && withFalconApi) {
    const PreviousWrapper = Wrapper;
    Wrapper = ({ children }: { children: React.ReactNode }) => (
      <PreviousWrapper>
        <EventsProvider>{children}</EventsProvider>
      </PreviousWrapper>
    );
  }

  if (withRouter) {
    const PreviousWrapper = Wrapper;
    Wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={initialEntries}>
        <PreviousWrapper>{children}</PreviousWrapper>
      </MemoryRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Create a mock Falcon API instance for testing
 */
export function createMockFalcon(overrides: Record<string, unknown> = {}) {
  return {
    isConnected: true,
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    data: {
      user: {
        username: 'test-user',
        email: 'test@example.com',
      },
    },
    navigation: {
      navigateTo: vi.fn(),
    },
    api: {
      workflows: {
        postEntitiesExecuteV1: vi.fn(),
        getEntitiesExecutionResultsV1: vi.fn(),
      },
    },
    collection: vi.fn(() => ({
      list: vi.fn(),
      read: vi.fn(),
      write: vi.fn(),
      delete: vi.fn(),
    })),
    ui: {
      openModal: vi.fn(),
      closeModal: vi.fn(),
    },
    ...overrides,
  };
}

// Re-export testing library utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
