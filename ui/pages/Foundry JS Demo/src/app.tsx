import React from "react";
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import {
  useFalconApiContext,
  FalconApiProvider,
} from "./contexts/falcon-api-context.tsx";
import { EventsProvider } from "./contexts/events-context.tsx";
import { Events } from "./routes/events.tsx";
import { Workflows } from "./routes/workflows.tsx";
import { Collections } from "./routes/collections.tsx";
import { LogScale } from "./routes/logscale.tsx";
import { ApiIntegrations } from "./routes/api-integrations.tsx";
import { CloudFunctions } from "./routes/cloud-functions.tsx";
import { Navigation } from "./routes/navigation.tsx";
import { Modals } from "./routes/modals.tsx";
import ReactDOM from "react-dom/client";
import { TabNavigation } from "./components/navigation.tsx";

function Root() {
  return (
    <Routes>
      <Route
        element={
          <TabNavigation>
            <Outlet />
          </TabNavigation>
        }
      >
        <Route index path="/" element={<Events />} />
        <Route path="/events" element={<Events />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/logscale" element={<LogScale />} />
        <Route path="/api-integrations" element={<ApiIntegrations />} />
        <Route path="/cloud-functions" element={<CloudFunctions />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/modals" element={<Modals />} />
      </Route>
    </Routes>
  );
}

function AppContent() {
  const { isInitialized } = useFalconApiContext();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Initializing Falcon API...</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Root />
    </HashRouter>
  );
}

function App() {
  return (
    <React.StrictMode>
      <FalconApiProvider>
        <EventsProvider>
          <AppContent />
        </EventsProvider>
      </FalconApiProvider>
    </React.StrictMode>
  );
}

const domContainer = document.querySelector("#app");
if (!domContainer) {
  throw new Error('Failed to find the app container element');
}
const root = ReactDOM.createRoot(domContainer);

root.render(<App />);
