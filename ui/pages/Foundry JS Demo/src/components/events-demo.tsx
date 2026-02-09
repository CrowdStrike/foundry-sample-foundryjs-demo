import { useEventsContext } from "../contexts/events-context.tsx";
import { useFalconApiContext } from "../contexts/falcon-api-context.tsx";
import { EventsDemoUI } from "./events-demo-presentational.tsx";

export function EventsDemo() {
  const {
    events,
    isListening,
    clearEvents,
    triggerTestEvent,
    eventCount,
    getEventsByType,
    getRecentEvents,
  } = useEventsContext();

  const { falcon } = useFalconApiContext();

  const getConnectionStatus = () => {
    if (!falcon) {
      return { status: "No Connection", color: "red", icon: "🔴" };
    }
    if (falcon.isConnected && isListening) {
      return { status: "Connected & Listening", color: "green", icon: "🟢" };
    }
    if (isListening) {
      return { status: "Ready to Listen", color: "blue", icon: "🔵" };
    }
    return { status: "Not Listening", color: "gray", icon: "⚫" };
  };

  const connectionStatus = getConnectionStatus();
  const recentEventsCount = getRecentEvents(60).length;
  const testEventsCount = getEventsByType("test-event").length;

  return (
    <EventsDemoUI
      events={events}
      eventCount={eventCount}
      recentEventsCount={recentEventsCount}
      testEventsCount={testEventsCount}
      connectionStatus={connectionStatus}
      onTriggerTestEvent={triggerTestEvent}
      onClearEvents={clearEvents}
    />
  );
}
