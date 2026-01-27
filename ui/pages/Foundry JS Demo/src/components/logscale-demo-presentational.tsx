interface LogScaleResult {
  operation?: string;
  message?: string;
  data?: unknown;
  navigation?: unknown;
}

interface LogScaleDemoUIProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  eventData?: string;
  searchQuery?: string;
  timeStart?: string;
  timeEnd?: string;
  savedQueryId?: string;
  queryParameters?: string;
  loading?: boolean;
  results?: LogScaleResult | null;
  error?: string | null;
  isConnected?: boolean;
  onEventDataChange?: (value: string) => void;
  onSearchQueryChange?: (value: string) => void;
  onTimeStartChange?: (value: string) => void;
  onTimeEndChange?: (value: string) => void;
  onSavedQueryIdChange?: (value: string) => void;
  onQueryParametersChange?: (value: string) => void;
  onExecuteOperation?: (operation: string) => void;
  onClearResults?: () => void;
  onUpdateEventTimestamp?: () => void;
  falcon?: any;
}

/**
 * Presentational LogScale Demo Component
 * Pure component that only accepts props - no context dependencies
 */
export function LogScaleDemoUI({
  // Tab state
  activeTab = 'write',
  onTabChange = () => {},

  // Form data
  eventData = '',
  searchQuery = '',
  timeStart = '',
  timeEnd = '',
  savedQueryId = '',
  queryParameters = '',

  // Status
  loading = false,
  results = null,
  error = null,
  isConnected = false,

  // Handlers
  onEventDataChange = () => {},
  onSearchQueryChange = () => {},
  onTimeStartChange = () => {},
  onTimeEndChange = () => {},
  onSavedQueryIdChange = () => {},
  onQueryParametersChange = () => {},
  onExecuteOperation = () => {},
  onClearResults = () => {},
  onUpdateEventTimestamp = () => {},

  // Falcon instance for navigation
  falcon = null
}: LogScaleDemoUIProps) {
  const tabs = [
    { id: 'write', label: 'Write Events' },
    { id: 'query', label: 'Dynamic Query' },
    { id: 'savedQuery', label: 'Saved Query' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-titles-and-attributes mb-2">LogScale Integration Demo</h2>
        <p className="text-body-and-labels">
          Demonstrate LogScale operations: writing events, executing dynamic queries, and running saved queries.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-reg">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-idle text-primary-idle'
                  : 'border-transparent text-body-and-labels hover:text-titles-and-attributes hover:border-border-reg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Write Events Tab */}
        {activeTab === 'write' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-body-and-labels">
                  Event Data (JSON)
                </label>
                <button
                  onClick={onUpdateEventTimestamp}
                  className="text-sm text-primary-idle hover:text-primary-hover transition-colors"
                >
                  Update Timestamp
                </button>
              </div>
              <textarea
                value={eventData}
                onChange={(e) => onEventDataChange(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle font-mono text-sm bg-surface-base text-titles-and-attributes"
              />
            </div>

            <button
              onClick={() => onExecuteOperation('write')}
              disabled={loading || !isConnected}
              className="px-4 py-2 bg-primary-idle text-surface-base rounded hover:bg-primary-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm"
            >
              {loading ? 'Writing...' : 'Write Event'}
            </button>
          </div>
        )}

        {/* Dynamic Query Tab */}
        {activeTab === 'query' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Search Query (CQL - CrowdStrike Query Language)
              </label>
              <textarea
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="event_type=user_login | stats count() by username"
                rows={4}
                className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle font-mono text-sm bg-surface-base text-titles-and-attributes"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Start Time
                </label>
                <input
                  type="text"
                  value={timeStart}
                  onChange={(e) => onTimeStartChange(e.target.value)}
                  placeholder="24h, 7d, 1h, etc."
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  End Time
                </label>
                <input
                  type="text"
                  value={timeEnd}
                  onChange={(e) => onTimeEndChange(e.target.value)}
                  placeholder="now, 1h, etc."
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
                />
              </div>
            </div>

            <button
              onClick={() => onExecuteOperation('query')}
              disabled={loading || !isConnected}
              className="px-4 py-2 bg-positive text-surface-base rounded hover:bg-positive-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm"
            >
              {loading ? 'Executing...' : 'Execute Query'}
            </button>
          </div>
        )}

        {/* Saved Query Tab */}
        {activeTab === 'savedQuery' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Saved Query ID
              </label>
              <input
                type="text"
                value={savedQueryId}
                onChange={(e) => onSavedQueryIdChange(e.target.value)}
                placeholder="Enter your saved query ID"
                className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
              />
              <div className="mt-2">
                <p className="text-sm text-body-and-labels mb-1 font-semibold">How to find your saved search ID:</p>
                <ol className="text-xs text-body-and-labels space-y-1 ml-4">
                  <li>
                    1. Navigate to{' '}
                    <a
                      href="https://falcon.dodo.crowdstrike.black/foundry/app-builder/ba511b20f29e426588b406dbaa16fc9b/draft/data"
                      onClick={(e) => {
                        e.preventDefault();
                        if (falcon?.navigation?.onClick) {
                          falcon.navigation.onClick(e.nativeEvent);
                        } else {
                          window.open(e.currentTarget.href, '_blank');
                        }
                      }}
                      className="text-primary-idle hover:text-primary-hover underline cursor-pointer"
                    >
                      App Builder → Data
                    </a>
                  </li>
                  <li>2. Click on your saved search in the list</li>
                  <li>3. Copy the last segment from the URL (the ID after the final <code className="bg-surface-md px-1 rounded">/</code>)</li>
                </ol>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Query Parameters (JSON)
              </label>
              <textarea
                value={queryParameters}
                onChange={(e) => onQueryParametersChange(e.target.value)}
                placeholder={`{\n  "min_severity": "high",\n  "time_range": "24h"\n}`}
                rows={4}
                className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle font-mono text-sm bg-surface-base text-titles-and-attributes"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onExecuteOperation('savedQuery')}
                disabled={loading || !isConnected}
                className="px-4 py-2 bg-purple text-surface-base rounded hover:bg-purple-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm"
              >
                {loading ? 'Executing...' : 'Execute Saved Query'}
              </button>
              <button
                onClick={onClearResults}
                className="px-4 py-2 bg-normal-idle text-titles-and-attributes rounded hover:bg-normal-hover transition-colors shadow-sm"
              >
                Clear Results
              </button>
            </div>

            {loading && (
              <div className="flex items-center text-purple">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple mr-2"></div>
                Processing...
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-critical-light border border-critical rounded-lg p-4">
            <h4 className="font-semibold text-critical-dark">Error</h4>
            <p className="text-critical-dark mt-1">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div>
            <h4 className="font-semibold text-titles-and-attributes mb-2">
              {results.operation?.toUpperCase()} Result: {results.message}
            </h4>
            <pre className="text-sm text-body-and-labels bg-surface-base p-3 rounded border border-border-reg overflow-auto max-h-64">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        )}

        {/* API Reference */}
        <div className="bg-surface-base border border-border-reg rounded p-4">
          <h4 className="font-semibold text-titles-and-attributes mb-2">API Reference:</h4>
          <ul className="text-sm text-body-and-labels space-y-1">
            <li>• <code className="bg-surface-md px-1 rounded text-titles-and-attributes">await falcon.logscale.write(eventData)</code> - Write events to LogScale</li>
            <li>• <code className="bg-surface-md px-1 rounded text-titles-and-attributes">await falcon.logscale.query({'{'}"search_query": query, "start": start, "end": end{'}'})</code> - Execute dynamic query</li>
            <li>• <code className="bg-surface-md px-1 rounded text-titles-and-attributes">await falcon.logscale.savedQuery({'{'}"id": queryId, "start": start, "mode": "sync", "parameters": params{'}'})</code> - Execute saved query</li>
            <li>• Time formats: "24h", "7d", "1h", "now", ISO timestamps</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

