import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useFalconApiContext } from './falcon-api-context.tsx';

interface Event {
  id: number;
  type: string;
  timestamp: string;
  data: string;
}

interface EventsContextType {
  events: Event[];
  isListening: boolean;
  addEvent: (eventType: string, data: any) => Event;
  updateEvent: (eventId: number, updates: Partial<Event>) => void;
  deleteEvent: (eventId: number) => void;
  clearEvents: () => void;
  getEventsByType: (eventType: string) => Event[];
  getRecentEvents: (minutesAgo?: number) => Event[];
  sendBroadcast: () => void;
  eventCount: number;
  latestEvent: Event | null;
}

interface EventsProviderProps {
  children: ReactNode;
}

const EventsContext = createContext<EventsContextType | null>(null);


function EventsProvider({ children }: EventsProviderProps) {
  const { falcon } = useFalconApiContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [isListening, setIsListening] = useState<boolean>(false);

  // Add a new event to the list
  const addEvent = (eventType: string, data: any): Event => {
    const event = {
      id: Date.now() + Math.random(),
      type: eventType,
      timestamp: new Date().toISOString(),
      data: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    };
    setEvents(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 events
    return event;
  };

  // Update an existing event
  const updateEvent = (eventId: number, updates: Partial<Event>): void => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, ...updates, timestamp: new Date().toISOString() }
        : event
    ));
  };

  // Delete an event
  const deleteEvent = (eventId: number): void => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Clear all events
  const clearEvents = (): void => {
    setEvents([]);
  };

  // Get events by type
  const getEventsByType = (eventType: string): Event[] => {
    return events.filter(event => event.type === eventType);
  };

  // Get recent events (within last N minutes)
  const getRecentEvents = (minutesAgo: number = 60): Event[] => {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);
    return events.filter(event => new Date(event.timestamp) > cutoffTime);
  };

  // Send a broadcast message to other extensions of the same app
  const sendBroadcast = (): void => {
    if (!falcon) return;

    const payload = {
      message: 'This is a test broadcast event',
      timestamp: new Date().toISOString(),
      userId: falcon.data?.user?.username || 'demo-user',
      source: 'manual_trigger'
    };

    falcon.sendBroadcast(payload);
  };

  // Set up Falcon event listeners
  useEffect(() => {
    if (!falcon) {
      setIsListening(false);
      return;
    }

    // If falcon exists but not connected, try to listen anyway for demo purposes
    const eventHandlers = new Map();

    // Listen to the two real falcon events: 'data' and 'broadcast'
    const eventTypes = ['data', 'broadcast'];
    
    try {
      eventTypes.forEach(eventType => {
        const handler = (data: any) => {
          addEvent(eventType, data);
        };
        eventHandlers.set(eventType, handler);
        falcon.events.on(eventType as any, handler);
      });

      // Set listening to true if we have falcon instance, regardless of connection status
      setIsListening(true);
    } catch (error) {
      console.warn('Failed to set up event listeners:', error);
      setIsListening(false);
    }

    return () => {
      eventTypes.forEach(eventType => {
        const handler = eventHandlers.get(eventType);
        if (handler) {
          try {
            falcon.events.off(eventType as any, handler);
          } catch (error) {
            console.warn('Failed to remove event listener:', error);
          }
        }
      });
      setIsListening(false);
    };
  }, [falcon]);

  const value: EventsContextType = {
    events,
    isListening,
    addEvent,
    updateEvent,
    deleteEvent,
    clearEvents,
    getEventsByType,
    getRecentEvents,
    sendBroadcast,
    // Utility functions
    eventCount: events.length,
    latestEvent: events.length > 0 ? events[0] : null
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

function useEventsContext(): EventsContextType {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEventsContext must be used within an EventsProvider');
  }
  return context;
}


export { useEventsContext, EventsContext, EventsProvider };