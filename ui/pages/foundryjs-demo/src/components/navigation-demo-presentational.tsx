/**
 * Presentational Navigation Demo Component
 * Pure component that only accepts props - no context dependencies
 */
export function NavigationDemoUI({
  // Handlers
  onExternalNavigation = (_event?: any) => {},
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-titles-and-attributes mb-4">
        Navigation & Routing
      </h2>

      <p className="text-body-and-labels mb-6">
        This demo shows how to implement navigation in Foundry pages using React
        Router and the Foundry-JS SDK for seamless integration with Falcon
        Console.
      </p>

      <div className="space-y-8">
        {/* Section 1: Sync navigation with falcon */}
        <div>
          <h3 className="text-xl font-bold text-titles-and-attributes mb-3">
            Sync navigation with Falcon
          </h3>

          <p className="text-sm text-body-and-labels mb-4">
            Foundry apps run in iframes inside Falcon Console. This creates two
            key requirements:
          </p>

          <ul className="text-sm text-body-and-labels space-y-2 ml-4 mb-4">
            <li>
              <strong>1. Deep Linking</strong> - When a user opens a shared URL,
              navigate to the correct page
              <br />
              <code className="bg-surface-md px-1 rounded text-xs">
                Solution: Read window.location.hash on mount
              </code>
            </li>
            <li>
              <strong>2. URL Synchronization</strong> - When navigating
              internally, update the parent URL so it can be shared
              <br />
              <code className="bg-surface-md px-1 rounded text-xs">
                Solution: Call falcon.navigation.navigateTo(path)
              </code>
            </li>
          </ul>

          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Try it out:
          </p>
          <p className="text-sm text-body-and-labels mb-4">
            Use the sidebar menu on the left to navigate between different demo
            sections. Watch the URL in your browser update as you navigate. Copy
            the URL and open it in a new tab - you'll land on the same page!
          </p>

          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Implementation:
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-titles-and-attributes mb-1">
                Step 1: Navigate to initial path on mount
              </p>
              <code className="block bg-surface-base px-3 py-2 rounded border border-border-reg text-titles-and-attributes font-mono text-xs overflow-x-auto whitespace-pre">
                {`// In your navigation component
const navigate = useNavigate();

useEffect(() => {
  const initialPath = document.location.hash.replace(/^#./, "");

  if (initialPath && initialPath !== "/") {
    navigate(initialPath, { replace: true });
  }
}, [navigate]);`}
              </code>
            </div>

            <div>
              <p className="text-xs font-semibold text-titles-and-attributes mb-1">
                Step 2: Sync on navigation
              </p>
              <code className="block bg-surface-base px-3 py-2 rounded border border-border-reg text-titles-and-attributes font-mono text-xs overflow-x-auto whitespace-pre">
                {`const handleNavigate = (path) => {
  // Navigate internally with React Router
  navigate(path);

  // Sync parent URL (don't include #)
  if (falcon?.navigation?.navigateTo) {
    falcon.navigation.navigateTo({
      path: path,
      type: "internal",
      target: "_self"
    });
  }
};`}
              </code>
            </div>
          </div>
        </div>

        {/* Section 2: Opening External Links */}
        <div>
          <h3 className="text-xl font-bold text-titles-and-attributes mb-3">
            Opening External Links
          </h3>

          <p className="text-sm text-body-and-labels mb-4">
            Browsers block external navigation from iframes due to security
            policies. The Foundry SDK provides{" "}
            <code className="bg-surface-base px-1 rounded">
              falcon.navigation.navigateTo()
            </code>{" "}
            to communicate with the parent Falcon Console, which can open
            external links on your behalf.
          </p>

          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Try these links:
          </p>
          <div className="space-y-2 mb-4">
            <div>
              <a
                href="https://falcon.crowdstrike.com"
                onClick={onExternalNavigation}
                className="text-positive hover:underline text-sm cursor-pointer"
              >
                https://falcon.crowdstrike.com
              </a>
            </div>
            <div>
              <a
                href="https://www.google.com"
                onClick={onExternalNavigation}
                className="text-positive hover:underline text-sm cursor-pointer"
              >
                https://www.google.com
              </a>
            </div>
            <div>
              <a
                href="https://github.com/CrowdStrike/foundry-js"
                onClick={onExternalNavigation}
                className="text-positive hover:underline text-sm cursor-pointer"
              >
                https://github.com/CrowdStrike/foundry-js
              </a>
            </div>
          </div>

          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Implementation:
          </p>
          <code className="block bg-surface-base px-3 py-2 rounded border border-border-reg text-titles-and-attributes font-mono text-xs overflow-x-auto whitespace-pre">
            {`// Open external links via Falcon navigation
const handleExternalClick = (event) => {
  event.preventDefault();

  const url = event.currentTarget.href;

  if (falcon?.navigation?.navigateTo) {
    falcon.navigation.navigateTo({ path: url });
  } else {
    // Fallback for local development
    window.open(url, '_blank');
  }
};

// Use it on your links
<a href="https://example.com" onClick={handleExternalClick}>
  External Link
</a>`}
          </code>
        </div>
      </div>
    </div>
  );
}

