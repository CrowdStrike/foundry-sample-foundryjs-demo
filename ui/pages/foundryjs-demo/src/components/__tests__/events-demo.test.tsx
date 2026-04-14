import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventsDemo } from '../events-demo.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

// Store registered event handlers so tests can simulate incoming events
const eventHandlers = new Map<string, (data: any) => void>();
const mockSendBroadcast = vi.fn();

vi.mock('@crowdstrike/foundry-js', () => {
  return {
    default: class FalconApi {
      connect = vi.fn().mockResolvedValue(undefined);
      isConnected = true;
      sendBroadcast = mockSendBroadcast;
      events = {
        on: vi.fn((eventType: string, handler: (data: any) => void) => {
          eventHandlers.set(eventType, handler);
        }),
        off: vi.fn(),
      };
      data = {
        user: {
          username: 'test-user',
        },
      };
    },
  };
});

describe('EventsDemo Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    eventHandlers.clear();
  });

  it('should render the component', async () => {
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText('Events Handling Demo')).toBeInTheDocument();
    });
  });

  it('should display connection status', async () => {
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText(/Connected & Listening|Ready to Listen/i)).toBeInTheDocument();
    });
  });

  it('should call falcon.sendBroadcast when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText('Send Broadcast')).toBeInTheDocument();
    });

    const button = screen.getByText('Send Broadcast');
    await user.click(button);

    expect(mockSendBroadcast).toHaveBeenCalledOnce();
  });

  it('should display events received via data listener', async () => {
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(eventHandlers.has('data')).toBe(true);
    });

    // Simulate an incoming data event from Falcon Console
    const dataHandler = eventHandlers.get('data')!;
    dataHandler({ user: 'test-user', theme: 'theme-dark' });

    await waitFor(() => {
      const eventItems = document.querySelectorAll('.event-item');
      expect(eventItems.length).toBe(1);
    });
  });

  it('should clear events when clear button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(eventHandlers.has('data')).toBe(true);
    });

    // Simulate an incoming event
    const dataHandler = eventHandlers.get('data')!;
    dataHandler({ user: 'test-user' });

    await waitFor(() => {
      const eventItems = document.querySelectorAll('.event-item');
      expect(eventItems.length).toBe(1);
    });

    // Clear events
    const clearButton = screen.getByText('Clear Events');
    await user.click(clearButton);

    await waitFor(() => {
      const eventItems = document.querySelectorAll('.event-item');
      expect(eventItems).toHaveLength(0);
      expect(screen.getByText(/No events captured yet/i)).toBeInTheDocument();
    });
  });

  it('should display event counts', async () => {
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
    });

    // Initial counts should be 0
    const initialCounts = screen.getAllByText('0');
    expect(initialCounts.length).toBeGreaterThan(0);

    // Simulate an incoming event
    await waitFor(() => {
      expect(eventHandlers.has('data')).toBe(true);
    });

    const dataHandler = eventHandlers.get('data')!;
    dataHandler({ user: 'test-user' });

    // Count should increase
    await waitFor(() => {
      const ones = screen.getAllByText('1');
      expect(ones.length).toBeGreaterThan(0);
    });
  });

  it('should show connection indicator color', async () => {
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      const statusElements = screen.getAllByText(/🟢|🔵|🔴|⚫/);
      expect(statusElements.length).toBeGreaterThan(0);
    });
  });

  it('should display event data in JSON format', async () => {
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(eventHandlers.has('data')).toBe(true);
    });

    // Simulate an incoming event with JSON data
    const dataHandler = eventHandlers.get('data')!;
    dataHandler({ user: 'test-user', theme: 'theme-dark' });

    await waitFor(() => {
      const preElements = document.querySelectorAll('.event-item pre');
      expect(preElements.length).toBeGreaterThan(0);
      expect(preElements[0].textContent).toContain('test-user');
    });
  });
});
