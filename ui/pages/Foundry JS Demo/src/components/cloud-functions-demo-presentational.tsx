interface CloudFunctionResult {
  message?: string;
  method?: string;
  path?: string;
  data?: unknown;
  statusCode?: number;
  executionTime?: string;
}

interface CloudFunctionsDemoUIProps {
  functionName?: string;
  functionVersion?: string;
  httpMethod?: string;
  functionPath?: string;
  requestData?: string;
  queryParams?: string;
  loading?: boolean;
  results?: CloudFunctionResult | null;
  error?: string | null;
  isConnected?: boolean;
  onFunctionNameChange?: (value: string) => void;
  onFunctionVersionChange?: (value: string) => void;
  onHttpMethodChange?: (value: string) => void;
  onFunctionPathChange?: (value: string) => void;
  onRequestDataChange?: (value: string) => void;
  onQueryParamsChange?: (value: string) => void;
  onExecuteFunction?: () => void;
  onClearResults?: () => void;
}

/**
 * Presentational Cloud Functions Demo Component
 * Pure component that only accepts props - no context dependencies
 */
export function CloudFunctionsDemoUI({
  // Function configuration
  functionName = 'greeting_function',
  functionVersion = '1',
  httpMethod = 'POST',
  functionPath = '/greet',
  requestData = `{
  "name": "Demo User"
}`,
  queryParams = '',

  // State
  loading = false,
  results = null,
  error = null,
  isConnected = false,

  // Handlers
  onFunctionNameChange = () => {},
  onFunctionVersionChange = () => {},
  onHttpMethodChange = () => {},
  onFunctionPathChange = () => {},
  onRequestDataChange = () => {},
  onQueryParamsChange = () => {},
  onExecuteFunction = () => {},
  onClearResults = () => {}
}: CloudFunctionsDemoUIProps) {
  return (
    <div className="space-y-6">
      {/* Combined Configuration Section */}
      <div className="space-y-4">
        {/* Function Configuration */}
        <div>
          <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">Function Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Function Name *
              </label>
              <input
                type="text"
                value={functionName}
                onChange={(e) => onFunctionNameChange(e.target.value)}
                placeholder="greeting_function"
                className="w-full px-3 py-2 bg-surface-base border border-border-reg rounded-lg text-titles-and-attributes focus:ring-2 focus:ring-primary-idle focus:border-primary-idle transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Version
              </label>
              <input
                type="number"
                value={functionVersion}
                onChange={(e) => onFunctionVersionChange(e.target.value)}
                placeholder="1"
                min="1"
                className="w-full px-3 py-2 bg-surface-base border border-border-reg rounded-lg text-titles-and-attributes focus:ring-2 focus:ring-primary-idle focus:border-primary-idle transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Request Configuration */}
        <div>
          <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">Request Configuration</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Function Path
                </label>
                <input
                  type="text"
                  value={functionPath}
                  onChange={(e) => onFunctionPathChange(e.target.value)}
                  placeholder="/greet"
                  className="w-full px-3 py-2 bg-surface-base border border-border-reg rounded-lg text-titles-and-attributes font-mono focus:ring-2 focus:ring-primary-idle focus:border-primary-idle transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  HTTP Method
                </label>
                <select
                  value={httpMethod}
                  onChange={(e) => onHttpMethodChange(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-base border border-border-reg rounded-lg text-titles-and-attributes focus:ring-2 focus:ring-primary-idle focus:border-primary-idle transition-colors"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Query Parameters (URL format)
              </label>
              <input
                type="text"
                value={queryParams}
                onChange={(e) => onQueryParamsChange(e.target.value)}
                placeholder="limit=10&sort=name"
                className="w-full px-3 py-2 bg-surface-base border border-border-reg rounded-lg text-titles-and-attributes font-mono focus:ring-2 focus:ring-primary-idle focus:border-primary-idle transition-colors"
              />
            </div>

            {['POST', 'PUT', 'PATCH'].includes(httpMethod) && (
              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Request Body (JSON) - for {httpMethod} requests
                </label>
                <textarea
                  value={requestData}
                  onChange={(e) => onRequestDataChange(e.target.value)}
                  placeholder='{"key": "value", "data": []}'
                  rows={8}
                  className="w-full px-3 py-2 bg-surface-base border border-border-reg rounded-lg text-titles-and-attributes font-mono text-sm focus:ring-2 focus:ring-primary-idle focus:border-primary-idle transition-colors"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={onExecuteFunction}
                disabled={loading || !isConnected}
                className="px-4 py-2 bg-primary-idle text-surface-base rounded-lg hover:bg-primary-active disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm font-medium"
              >
                {loading ? 'Executing...' : `Execute ${httpMethod} Request`}
              </button>
              <button
                onClick={onClearResults}
                className="px-4 py-2 bg-normal-idle text-titles-and-attributes rounded-lg hover:bg-normal-active transition-colors shadow-sm font-medium"
              >
                Clear Results
              </button>
            </div>

            {loading && (
              <div className="flex items-center text-primary-idle">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-idle mr-2"></div>
                Calling cloud function...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-critical-light border border-critical rounded-xl p-4 shadow-sm">
          <h4 className="font-semibold text-critical">Error</h4>
          <p className="text-critical mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div>
          <h4 className="font-semibold text-titles-and-attributes mb-2">
            Function Response: {results.message}
          </h4>
          <div className="text-sm text-body-and-labels mb-2">
            <strong>Method:</strong> {results.method} | <strong>Path:</strong> {results.path}
          </div>
          <pre className="text-sm text-body-and-labels bg-surface-base p-3 rounded-lg border border-border-reg overflow-auto max-h-64 font-mono">
            {JSON.stringify(results.data, null, 2)}
          </pre>
        </div>
      )}

      {/* API Reference */}
      <div className="bg-surface-base border border-border-reg rounded p-4">
        <h4 className="font-semibold text-titles-and-attributes mb-2">API Reference:</h4>
        <ul className="text-sm text-body-and-labels space-y-1">
          <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">const func = falcon.cloudFunction({'{name: "FunctionName", version: 1}'})</code></li>
          <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">await func.path("/path").get()</code> - GET request</li>
          <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">await func.path("/path").post(data)</code> - POST with body</li>
          <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">await func.path("/path?param=value").put(data)</code> - PUT with query params</li>
          <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">await func.path("/path").patch(data)</code> - PATCH request</li>
          <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">await func.path("/path").delete()</code> - DELETE request</li>
        </ul>
      </div>
    </div>
  );
}

