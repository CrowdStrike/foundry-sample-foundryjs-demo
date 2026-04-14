interface Event {
  id: number;
  type: string;
  timestamp: string;
  data: string;
}

interface ConnectionStatus {
  status: string;
  color: string;
  icon: string;
}

interface EventsDemoUIProps {
  events?: Event[];
  eventCount?: number;
  recentEventsCount?: number;
  broadcastEventsCount?: number;
  connectionStatus?: ConnectionStatus;
  onSendBroadcast?: () => void;
  onClearEvents?: () => void;
}

/**
 * Presentational Events Demo Component
 * Pure component that only accepts props - no context dependencies
 */
export function EventsDemoUI({
  // Event data
  events = [],
  eventCount = 0,
  recentEventsCount = 0,
  broadcastEventsCount = 0,

  // Status
  connectionStatus = {
    status: "Connected & Listening",
    color: "green",
    icon: "🟢",
  },

  // Handlers
  onSendBroadcast = () => {},
  onClearEvents = () => {},
}: EventsDemoUIProps) {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-titles-and-attributes">
          Events Handling Demo
        </h2>
        <div
          className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
            connectionStatus.color === "green"
              ? "bg-positive text-surface-base"
              : connectionStatus.color === "blue"
              ? "bg-primary-idle text-surface-base"
              : connectionStatus.color === "red"
              ? "bg-critical text-surface-base"
              : "bg-surface-md text-body-and-labels"
          }`}
        >
          {connectionStatus.icon} {connectionStatus.status}
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-body-and-labels leading-relaxed">
          This demo shows how to listen for events from the Falcon Console.
          The <code className="bg-surface-md px-1 py-0.5 rounded">data</code> event fires when context changes (like
          navigating to different detections, incidents, etc.). The{" "}
          <code className="bg-surface-md px-1 py-0.5 rounded">broadcast</code> event allows communication between
          different extensions of the same app. Events are managed at the
          application level and shared across all components.
        </p>

        {/* Event Statistics */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-surface-base border border-border-reg rounded-xl p-5 shadow-base transition-shadow card-hover">
            <h4 className="font-semibold text-body-and-labels">Total Events</h4>
            <p className="text-3xl font-bold text-titles-and-attributes mt-2">
              {eventCount}
            </p>
          </div>
          <div className="bg-surface-base border border-border-reg rounded-xl p-5 shadow-base transition-shadow card-hover">
            <h4 className="font-semibold text-body-and-labels">
              Recent Events (1hr)
            </h4>
            <p className="text-3xl font-bold text-titles-and-attributes mt-2">
              {recentEventsCount}
            </p>
          </div>
          <div className="bg-surface-base border border-border-reg rounded-xl p-5 shadow-base transition-shadow card-hover">
            <h4 className="font-semibold text-body-and-labels">Broadcast Events</h4>
            <p className="text-3xl font-bold text-titles-and-attributes mt-2">
              {broadcastEventsCount}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onSendBroadcast}
            className="px-5 py-2 bg-primary-idle text-surface-base rounded-lg transition-colors shadow-sm font-medium button-primary"
          >
            Send Broadcast
          </button>
          <button
            onClick={onClearEvents}
            className="px-5 py-2 bg-normal-idle text-titles-and-attributes rounded-lg transition-colors shadow-sm font-medium button-normal"
          >
            Clear Events
          </button>
        </div>

        <div className="border border-border-reg rounded-xl shadow-sm overflow-hidden">
          <div className="bg-surface-md px-5 py-3 border-b border-border-reg">
            <h3 className="font-semibold text-titles-and-attributes">
              Event Log ({eventCount}/50)
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto bg-surface-base">
            {events.length === 0 ? (
              <div className="p-4 text-body-and-labels text-center">
                No events captured yet. Events will appear here when received
                from Falcon Console or from other extensions via broadcast.
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border-b last:border-b-0 event-item"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-semibold text-sm px-2 py-1 rounded ${
                        event.type === "broadcast"
                          ? "bg-purple text-surface-base"
                          : event.type === "data"
                          ? "bg-primary-idle text-surface-base"
                          : "bg-surface-md text-body-and-labels"
                      }`}
                    >
                      {event.type}
                    </span>
                    <span className="text-xs text-body-and-labels">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs text-titles-and-attributes bg-surface-md p-2 rounded break-words whitespace-pre-wrap">
                    {event.data}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-surface-base border border-border-reg rounded-xl p-5 shadow-sm">
          <h4 className="font-semibold text-titles-and-attributes mb-3">
            How it works:
          </h4>
          <ul className="text-sm text-body-and-labels space-y-2">
            <li>
              •{" "}
              <code className="bg-surface-md px-2 py-0.5 rounded">
                import Falcon from '@crowdstrike/foundry-js'
              </code>{" "}
              - Import the library
            </li>
            <li>
              •{" "}
              <code className="bg-surface-md px-2 py-0.5 rounded">
                const falcon = new Falcon(); await falcon.connect()
              </code>{" "}
              - Initialize and connect
            </li>
            <li>
              •{" "}
              <code className="bg-surface-md px-2 py-0.5 rounded">
                falcon.events.on('data', handler)
              </code>{" "}
              - Listen for context data changes
            </li>
            <li>
              •{" "}
              <code className="bg-surface-md px-2 py-0.5 rounded">
                falcon.events.on('broadcast', handler)
              </code>{" "}
              - Listen for messages from other extensions
            </li>
            <li>
              •{" "}
              <code className="bg-surface-md px-2 py-0.5 rounded">
                falcon.sendBroadcast(payload)
              </code>{" "}
              - Send messages to other extensions of the same app
            </li>
            <li>
              •{" "}
              <code className="bg-surface-md px-2 py-0.5 rounded">
                falcon.events.off(eventType, handler)
              </code>{" "}
              - Remove event listeners
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

