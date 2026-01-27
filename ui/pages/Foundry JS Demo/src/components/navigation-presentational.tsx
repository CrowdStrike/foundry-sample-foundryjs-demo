import { ReactNode } from 'react';

interface NavigationLink {
  path: string;
  label: string;
  category: string;
  description: string;
}

interface NavigationUIProps {
  navigationLinks?: NavigationLink[];
  currentPath?: string;
  eventCount?: number;
  onNavigate?: (path: string) => void;
  children?: ReactNode;
}

/**
 * Presentational Navigation Component
 * Pure component that only accepts props - no context dependencies
 */
export function NavigationUI({
  // Navigation data
  navigationLinks = [],
  currentPath = "/events",
  eventCount = 0,

  // Handlers
  onNavigate = () => {},

  // Children content
  children
}: NavigationUIProps) {
  const groupedLinks = navigationLinks.reduce<Record<string, NavigationLink[]>>((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link);
    return acc;
  }, {});

  const renderNavLink = (link: NavigationLink) => {
    const isActive = currentPath === link.path;
    const showBadge = link.path === "/events" && eventCount > 0;

    return (
      <button
        key={link.path}
        onClick={() => onNavigate(link.path)}
        className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-200 relative ${
          isActive
            ? "bg-primary-idle text-surface-base font-semibold"
            : "text-body-and-labels hover:text-titles-and-attributes hover:bg-surface-md"
        }`}
        title={link.description}
      >
        <div className="flex-1 min-w-0">
          <div className="font-medium flex items-center">
            {link.label}
            {showBadge && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-titles-and-attributes bg-normal-idle rounded-full">
                {eventCount}
              </span>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-basement flex">
      {/* Desktop Sidebar */}
      <div className="flex flex-shrink-0 w-64">
        <div className="flex flex-col w-full">
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-4 bg-surface-base border-b border-border-reg shadow-sm">
            <h1 className="text-lg font-bold text-titles-and-attributes">
              Foundry-JS SDK
            </h1>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 bg-surface-base border-r border-border-reg shadow-sm overflow-y-auto">
            <div className="px-3 py-4 space-y-6">
              {Object.entries(groupedLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="px-3 py-2 text-xs font-bold text-nav-text-secondary uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {links.map((link) => renderNavLink(link))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 bg-basement p-8">{children}</main>
      </div>
    </div>
  );
}

