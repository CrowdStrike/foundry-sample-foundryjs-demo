import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { EventsProvider, useEventsContext } from '../events-context.tsx';
import { FalconApiProvider } from '../falcon-api-context.tsx';

// Mock FalconApi
vi.mock('@crowdstrike/foundry-js', () => {
  const eventHandlers = new Map();
  return {
    default: class FalconApi {
      connect = vi.fn().mockResolvedValue(undefined);
      isConnected = true;
      sendBroadcast = vi.fn();
      events = {
        on: vi.fn((eventType: string, handler: Function) => {
          eventHandlers.set(eventType, handler);
        }),
        off: vi.fn((eventType: string) => {
          eventHandlers.delete(eventType);
        }),
        emit: vi.fn((eventType: string, data: any) => {
          const handler = eventHandlers.get(eventType);
          if (handler) handler(data);
        }),
      };
      data = {
        user: {
          username: 'test-user',
        },
      };
    },
  };
});

describe('EventsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <FalconApiProvider>
      <EventsProvider>{children}</EventsProvider>
    </FalconApiProvider>
  );

  describe('useEventsContext', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useEventsContext());
      }).toThrow('useEventsContext must be used within an EventsProvider');

      consoleError.mockRestore();
    });

    it('should provide events context', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current).toHaveProperty('events');
        expect(result.current).toHaveProperty('isListening');
        expect(result.current).toHaveProperty('addEvent');
        expect(result.current).toHaveProperty('clearEvents');
        expect(result.current).toHaveProperty('eventCount');
      });
    });

    it('should start with empty events', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.events).toEqual([]);
        expect(result.current.eventCount).toBe(0);
      });
    });
  });

  describe('Event Management', () => {
    it('should add an event', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.addEvent).toBeDefined();
      });

      act(() => {
        result.current.addEvent('test-event', { message: 'Hello' });
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(1);
        expect(result.current.eventCount).toBe(1);
        expect(result.current.events[0].type).toBe('test-event');
      });
    });

    it('should clear all events', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.addEvent).toBeDefined();
      });

      // Add some events
      act(() => {
        result.current.addEvent('event1', 'data1');
        result.current.addEvent('event2', 'data2');
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(2);
      });

      // Clear events
      act(() => {
        result.current.clearEvents();
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(0);
        expect(result.current.eventCount).toBe(0);
      });
    });

    it('should limit events to 50', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.addEvent).toBeDefined();
      });

      // Add 60 events
      act(() => {
        for (let i = 0; i < 60; i++) {
          result.current.addEvent(`event-${i}`, `data-${i}`);
        }
      });

      await waitFor(() => {
        // Should only keep last 50
        expect(result.current.events).toHaveLength(50);
        expect(result.current.eventCount).toBe(50);
      });
    });

    it('should get events by type', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.addEvent).toBeDefined();
      });

      act(() => {
        result.current.addEvent('type-a', 'data1');
        result.current.addEvent('type-b', 'data2');
        result.current.addEvent('type-a', 'data3');
      });

      await waitFor(() => {
        const typeAEvents = result.current.getEventsByType('type-a');
        expect(typeAEvents).toHaveLength(2);
      });
    });

    it('should call sendBroadcast and add a local broadcast event', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.sendBroadcast).toBeDefined();
      });

      act(() => {
        result.current.sendBroadcast();
      });

      await waitFor(() => {
        // sendBroadcast should add a local event so the sender sees what was sent
        expect(result.current.events).toHaveLength(1);
        expect(result.current.events[0].type).toBe('broadcast');
      });
    });

    it('should update an event', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.addEvent).toBeDefined();
      });

      let eventId;
      act(() => {
        const event = result.current.addEvent('test-event', 'original data');
        eventId = event.id;
      });

      await waitFor(() => {
        expect(result.current.events[0].data).toBe('original data');
      });

      act(() => {
        result.current.updateEvent(eventId, { data: 'updated data' });
      });

      await waitFor(() => {
        expect(result.current.events[0].data).toBe('updated data');
      });
    });

    it('should delete an event', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.addEvent).toBeDefined();
      });

      let eventId;
      act(() => {
        const event = result.current.addEvent('test-event', 'data');
        eventId = event.id;
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(1);
      });

      act(() => {
        result.current.deleteEvent(eventId);
      });

      await waitFor(() => {
        expect(result.current.events).toHaveLength(0);
      });
    });

    it('should provide latest event', async () => {
      const { result } = renderHook(() => useEventsContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.latestEvent).toBeNull();
      });

      act(() => {
        result.current.addEvent('event1', 'data1');
        result.current.addEvent('event2', 'data2');
      });

      await waitFor(() => {
        expect(result.current.latestEvent).toBeDefined();
        expect(result.current.latestEvent!.type).toBe('event2');
      });
    });
  });
});
