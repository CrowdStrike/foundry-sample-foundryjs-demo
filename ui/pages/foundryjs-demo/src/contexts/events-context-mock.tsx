import { createContext, useContext, useState, ReactNode } from 'react';

interface Event {
  id: number;
  type: string;
  timestamp: string;
  data: string;
}

interface EventsContextValue {
  events: Event[];
  isListening: boolean;
  addEvent: (eventType: string, data: any) => Event;
  updateEvent: (eventId: number, updates: Partial<Event>) => void;
  deleteEvent: (eventId: number) => void;
  clearEvents: () => void;
  getEventsByType: (eventType: string) => Event[];
  getRecentEvents: (minutesAgo?: number) => Event[];
  triggerTestEvent: () => Event;
  eventCount: number;
  latestEvent: Event | null;
}

const EventsContext = createContext<EventsContextValue | null>(null);

function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (eventType: string, data: any): Event => {
    const event: Event = {
      id: Date.now() + Math.random(),
      type: eventType,
      timestamp: new Date().toISOString(),
      data: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    };
    setEvents(prev => [event, ...prev.slice(0, 49)]);
    return event;
  };

  const updateEvent = (eventId: number, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, ...updates, timestamp: new Date().toISOString() }
        : event
    ));
  };

  const deleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const getEventsByType = (eventType: string): Event[] => {
    return events.filter(event => event.type === eventType);
  };

  const getRecentEvents = (minutesAgo = 60): Event[] => {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);
    return events.filter(event => new Date(event.timestamp) > cutoffTime);
  };

  const triggerTestEvent = (): Event => {
    const testData = {
      message: 'This is a test event',
      timestamp: new Date().toISOString(),
      userId: 'mock-user',
      source: 'manual_trigger'
    };

    return addEvent('test-event', testData);
  };

  const value: EventsContextValue = {
    events,
    isListening: true,
    addEvent,
    updateEvent,
    deleteEvent,
    clearEvents,
    getEventsByType,
    getRecentEvents,
    triggerTestEvent,
    eventCount: events.length,
    latestEvent: events.length > 0 ? events[0] : null
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

function useEventsContext() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEventsContext must be used within an EventsProvider');
  }
  return context;
}

export { useEventsContext, EventsContext, EventsProvider };
