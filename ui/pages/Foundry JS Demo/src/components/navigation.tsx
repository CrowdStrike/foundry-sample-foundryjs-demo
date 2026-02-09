import { useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEventsContext } from "../contexts/events-context.tsx";
import { useFalconApiContext } from "../contexts/falcon-api-context.tsx";
import { NavigationUI } from "./navigation-presentational.tsx";

interface NavigationLink {
  path: string;
  label: string;
  category: string;
  description: string;
}

interface TabNavigationProps {
  children: ReactNode;
}

// Navigation configuration for Foundry JS SDK Demo
const navigationLinks: NavigationLink[] = [
  {
    path: "/events",
    label: "Events",
    category: "Core",
    description: "Event handling and context data",
  },
  {
    path: "/navigation",
    label: "Navigation",
    category: "Core",
    description: "Navigation utilities and hash handling",
  },
  {
    path: "/modals",
    label: "Modals",
    category: "Core",
    description: "Modal management within Falcon Console",
  },
  {
    path: "/collections",
    label: "Collections",
    category: "Data",
    description: "CRUD operations on Collections",
  },
  {
    path: "/api-integrations",
    label: "API Integrations",
    category: "Data",
    description: "External API integration calls",
  },
  {
    path: "/logscale",
    label: "LogScale",
    category: "Data",
    description: "LogScale integration and queries",
  },
  {
    path: "/cloud-functions",
    label: "Cloud Functions",
    category: "Logic",
    description: "Cloud Functions with HTTP methods",
  },
  {
    path: "/workflows",
    label: "Workflows",
    category: "Logic",
    description: "Workflow execution and management",
  },
];

/**
 * Navigation wrapper component for Foundry apps using React Router
 *
 * This component handles two key requirements:
 * 1. Deep linking - Navigate to the correct page when the app loads from a shared URL
 * 2. URL sync - Keep Falcon Console's parent URL in sync with internal navigation
 */
function TabNavigation({ children }: TabNavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventCount = 0 } = useEventsContext() || {};
  const { falcon } = useFalconApiContext();

  // Step 1: Deep linking - Navigate to initial path from URL on mount (RUNS ONCE)
  useEffect(() => {
    // Capture initial path from hash when app loads
    const initialPath = document.location.hash.replace(/^#./, "");

    if (initialPath && initialPath !== "/") {
      navigate(initialPath, { replace: true });
    }
  }, [navigate]);

  // Step 2: Handle user navigation
  const handleNavigate = (path: string): void => {
    if (!path) return;

    // Navigate with React Router
    navigate(path);

    // Sync parent URL (don't include #)
    if (falcon?.isConnected && falcon?.navigation?.navigateTo) {
      falcon.navigation.navigateTo({
        path: path,
        type: "internal",
        target: "_self",
      });
    }
  };

  return (
    <NavigationUI
      navigationLinks={navigationLinks}
      currentPath={location.pathname}
      eventCount={eventCount}
      onNavigate={handleNavigate}
    >
      {children}
    </NavigationUI>
  );
}


export { TabNavigation };
