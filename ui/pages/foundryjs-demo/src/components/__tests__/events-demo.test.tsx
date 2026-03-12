import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventsDemo } from '../events-demo.tsx';
import { renderWithProviders } from '../../test-utils.tsx';

// Mock the FalconApi
vi.mock('@crowdstrike/foundry-js', () => {
  return {
    default: class FalconApi {
      connect = vi.fn().mockResolvedValue(undefined);
      isConnected = true;
      events = {
        on: vi.fn(),
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

  it('should trigger test event when button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText('Trigger Test Event')).toBeInTheDocument();
    });

    const button = screen.getByText('Trigger Test Event');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('test-event')).toBeInTheDocument();
    });
  });

  it('should clear events when clear button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText('Trigger Test Event')).toBeInTheDocument();
    });

    // Add an event
    const triggerButton = screen.getByText('Trigger Test Event');
    await user.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByText('test-event')).toBeInTheDocument();
    });

    // Clear events
    const clearButton = screen.getByText('Clear Events');
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByText('test-event')).not.toBeInTheDocument();
      expect(screen.getByText(/No events captured yet/i)).toBeInTheDocument();
    });
  });

  it('should display event counts', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText('Total Events')).toBeInTheDocument();
    });

    // Initial counts should be 0
    const initialCounts = screen.getAllByText('0');
    expect(initialCounts.length).toBeGreaterThan(0);

    // Add an event
    const triggerButton = screen.getByText('Trigger Test Event');
    await user.click(triggerButton);

    // Count should increase - look for the first "1" that appears
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
    const user = userEvent.setup();
    renderWithProviders(<EventsDemo />);

    await waitFor(() => {
      expect(screen.getByText('Trigger Test Event')).toBeInTheDocument();
    });

    const button = screen.getByText('Trigger Test Event');
    await user.click(button);

    await waitFor(() => {
      // Event data should be displayed
      expect(screen.getByText(/message/i)).toBeInTheDocument();
    });
  });
});
