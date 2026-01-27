import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventsDemoUI } from '../events-demo-presentational.tsx';

describe('EventsDemoUI', () => {
  const mockConnectionStatus = {
    status: 'Connected & Listening',
    color: 'green',
    icon: '🟢',
  };

  const mockEvents = [
    {
      id: 1,
      type: 'test-event',
      timestamp: '2024-01-01T12:00:00Z',
      data: '{"message": "test"}',
    },
    {
      id: 2,
      type: 'data',
      timestamp: '2024-01-01T12:01:00Z',
      data: '{"value": 123}',
    },
  ];

  it('should render component title', () => {
    render(<EventsDemoUI connectionStatus={mockConnectionStatus} />);

    expect(screen.getByText('Events Handling Demo')).toBeInTheDocument();
  });

  it('should display connection status', () => {
    render(<EventsDemoUI connectionStatus={mockConnectionStatus} />);

    expect(screen.getByText(/Connected & Listening/i)).toBeInTheDocument();
    expect(screen.getByText(/🟢/)).toBeInTheDocument();
  });

  it('should display event count', () => {
    render(
      <EventsDemoUI
        eventCount={10}
        recentEventsCount={5}
        testEventsCount={3}
        connectionStatus={mockConnectionStatus}
      />
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should render trigger test event button', () => {
    render(<EventsDemoUI connectionStatus={mockConnectionStatus} />);

    expect(screen.getByText('Trigger Test Event')).toBeInTheDocument();
  });

  it('should call onTriggerTestEvent when button is clicked', async () => {
    const user = userEvent.setup();
    const mockTrigger = vi.fn();

    render(
      <EventsDemoUI
        connectionStatus={mockConnectionStatus}
        onTriggerTestEvent={mockTrigger}
      />
    );

    const button = screen.getByText('Trigger Test Event');
    await user.click(button);

    expect(mockTrigger).toHaveBeenCalledOnce();
  });

  it('should call onClearEvents when clear button is clicked', async () => {
    const user = userEvent.setup();
    const mockClear = vi.fn();

    render(
      <EventsDemoUI
        connectionStatus={mockConnectionStatus}
        onClearEvents={mockClear}
      />
    );

    const button = screen.getByText('Clear Events');
    await user.click(button);

    expect(mockClear).toHaveBeenCalledOnce();
  });

  it('should display events list', () => {
    render(
      <EventsDemoUI
        events={mockEvents}
        eventCount={2}
        connectionStatus={mockConnectionStatus}
      />
    );

    expect(screen.getByText('test-event')).toBeInTheDocument();
    expect(screen.getByText('data')).toBeInTheDocument();
  });

  it('should show empty state when no events', () => {
    render(
      <EventsDemoUI
        events={[]}
        eventCount={0}
        connectionStatus={mockConnectionStatus}
      />
    );

    expect(
      screen.getByText(/No events captured yet/i)
    ).toBeInTheDocument();
  });

  it('should display event timestamps', () => {
    render(
      <EventsDemoUI
        events={mockEvents}
        eventCount={2}
        connectionStatus={mockConnectionStatus}
      />
    );

    // Should contain formatted time
    const times = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
    expect(times.length).toBeGreaterThan(0);
  });

  it('should color code event types', () => {
    render(
      <EventsDemoUI
        events={mockEvents}
        eventCount={2}
        connectionStatus={mockConnectionStatus}
      />
    );

    const testEventBadge = screen.getByText('test-event');
    expect(testEventBadge).toHaveClass('bg-purple');

    const dataBadge = screen.getByText('data');
    expect(dataBadge).toHaveClass('bg-primary-idle');
  });

  it('should show event log count', () => {
    render(
      <EventsDemoUI
        events={mockEvents}
        eventCount={2}
        connectionStatus={mockConnectionStatus}
      />
    );

    expect(screen.getByText('Event Log (2/50)')).toBeInTheDocument();
  });

  it('should render How it works section', () => {
    render(<EventsDemoUI connectionStatus={mockConnectionStatus} />);

    expect(screen.getByText('How it works:')).toBeInTheDocument();
    expect(
      screen.getByText(/falcon.events.on\('data', handler\)/)
    ).toBeInTheDocument();
  });

  it('should handle disconnected status color', () => {
    const disconnectedStatus = {
      status: 'Not Listening',
      color: 'gray',
      icon: '⚫',
    };

    render(<EventsDemoUI connectionStatus={disconnectedStatus} />);

    // Check for the status badge with the disconnected text
    const statusBadge = screen.getByText((_content, element) => {
      return element?.textContent === '⚫ Not Listening';
    });
    expect(statusBadge).toBeInTheDocument();
  });

  it('should render with default props', () => {
    render(<EventsDemoUI />);

    // Should render without crashing
    expect(screen.getByText('Events Handling Demo')).toBeInTheDocument();
  });
});
