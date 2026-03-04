interface ApiResult {
  statusCode?: number;
  message?: string;
  data?: unknown;
}

interface ApiIntegrationsDemoUIProps {
  definitionId?: string;
  operationId?: string;
  pathParams?: string;
  queryParams?: string;
  requestBody?: string;
  headers?: string;
  loading?: boolean;
  results?: ApiResult | null;
  error?: string | null;
  isConnected?: boolean;
  onDefinitionIdChange?: (value: string) => void;
  onOperationIdChange?: (value: string) => void;
  onPathParamsChange?: (value: string) => void;
  onQueryParamsChange?: (value: string) => void;
  onRequestBodyChange?: (value: string) => void;
  onHeadersChange?: (value: string) => void;
  onExecuteIntegration?: () => void;
  onClearResults?: () => void;
  onLoadGetPosts?: () => void;
  onLoadGetPostById?: () => void;
  onLoadGetComments?: () => void;
  onLoadCreatePost?: () => void;
}

/**
 * Presentational API Integrations Demo Component
 * Pure component that only accepts props - no context dependencies
 */
export function ApiIntegrationsDemoUI({
  // Form states
  pathParams = '{}',
  queryParams = '{}',
  requestBody = '{}',
  headers = '{}',

  // Status
  loading = false,
  results = null,
  error = null,
  isConnected = false,

  // Handlers
  onPathParamsChange = () => {},
  onQueryParamsChange = () => {},
  onRequestBodyChange = () => {},
  onHeadersChange = () => {},
  onExecuteIntegration = () => {},
  onClearResults = () => {},
  onLoadGetPosts = () => {},
  onLoadGetPostById = () => {},
  onLoadGetComments = () => {},
  onLoadCreatePost = () => {}
}: ApiIntegrationsDemoUIProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-basement min-h-screen">
      <h2 className="text-2xl font-bold text-titles-and-attributes mb-2">API Integration Demo</h2>
      <p className="text-body-and-labels mb-6">
        Call external REST APIs through Foundry API integrations. This demo uses JSONPlaceholder, a free fake REST API for testing with posts, users, and comments.
      </p>

      <div className="space-y-6">
        {/* Preset Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onLoadGetPosts}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Get Posts
          </button>
          <button
            onClick={onLoadGetPostById}
            className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
          >
            Get Post by ID
          </button>
          <button
            onClick={onLoadGetComments}
            className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
          >
            Get Comments (filtered)
          </button>
          <button
            onClick={onLoadCreatePost}
            className="px-3 py-1 text-sm bg-pink-100 text-pink-700 rounded hover:bg-pink-200"
          >
            Create Post (POST)
          </button>
        </div>

        {/* Request Parameters Section */}
        <div className="border border-border-reg rounded-lg p-4 bg-surface-base">
          <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">Request Parameters</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Path Parameters (JSON)
                </label>
                <textarea
                  value={pathParams}
                  onChange={(e) => onPathParamsChange(e.target.value)}
                  placeholder='{"id": "123", "type": "user"}'
                  rows={4}
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Query Parameters (JSON)
                </label>
                <textarea
                  value={queryParams}
                  onChange={(e) => onQueryParamsChange(e.target.value)}
                  placeholder='{"limit": 10, "sort": "name"}'
                  rows={4}
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Request Body (JSON)
                </label>
                <textarea
                  value={requestBody}
                  onChange={(e) => onRequestBodyChange(e.target.value)}
                  placeholder='{"name": "value", "data": {}}'
                  rows={5}
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Request Headers (JSON)
                </label>
                <textarea
                  value={headers}
                  onChange={(e) => onHeadersChange(e.target.value)}
                  placeholder='{"X-Custom-Header": "value", "X-Request-Id": "123"}'
                  rows={5}
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onExecuteIntegration}
                disabled={loading || !isConnected}
                className="flex-1 px-4 py-2 bg-positive text-surface-base rounded hover:bg-positive-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm font-medium"
              >
                {loading ? 'Executing...' : 'Execute API Call'}
              </button>
              <button
                onClick={onClearResults}
                className="px-4 py-2 bg-surface-lg text-titles-and-attributes rounded hover:bg-surface-md transition-colors shadow-sm font-medium"
              >
                Clear Results
              </button>
            </div>

            {loading && (
              <div className="flex items-center text-primary-idle">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-idle mr-2"></div>
                Calling external API...
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-critical-light border border-critical rounded-lg p-4">
            <h4 className="font-semibold text-critical">Error</h4>
            <p className="text-critical mt-1">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className={`border rounded-lg p-4 ${
            (results.statusCode ?? 0) >= 200 && (results.statusCode ?? 0) < 300
              ? 'bg-positive-light border-positive'
              : 'bg-warning-light border-warning'
          }`}>
            <h4 className={`font-semibold mb-2 ${
              (results.statusCode ?? 0) >= 200 && (results.statusCode ?? 0) < 300
                ? 'text-positive'
                : 'text-warning'
            }`}>
              API Response: {results.message}
            </h4>
            <pre className={`text-sm p-3 bg-surface-base rounded border overflow-auto max-h-64 ${
              (results.statusCode ?? 0) >= 200 && (results.statusCode ?? 0) < 300
                ? 'text-positive border-positive'
                : 'text-warning border-warning'
            }`}>
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Code Examples */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-titles-and-attributes">Implementation Code</h3>

          <div className="bg-surface-base border border-border-reg rounded-lg p-4">
            <h4 className="font-semibold text-titles-and-attributes mb-3">Setup API Integration</h4>
            <pre className="text-sm text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
{`// Create API integration instance
const apiIntegration = falcon.apiIntegration({
  definitionId: 'JSONPlaceholder Demo API',
  operationId: 'getPosts'  // or 'getUsers', 'getPostById', etc.
});`}
            </pre>
          </div>

          <div className="bg-surface-base border border-border-reg rounded-lg p-4">
            <h4 className="font-semibold text-titles-and-attributes mb-3">Execute API Call (No Parameters)</h4>
            <pre className="text-sm text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
{`// Simple GET request with no parameters
const response = await apiIntegration.execute({
  request: {
    params: {}
  }
});

const data = response.resources?.[0]?.response_body;
console.log(data);`}
            </pre>
          </div>

          <div className="bg-surface-base border border-border-reg rounded-lg p-4">
            <h4 className="font-semibold text-titles-and-attributes mb-3">Execute with Path Parameters</h4>
            <pre className="text-sm text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
{`// GET request with path parameters (e.g., /posts/:id)
const response = await apiIntegration.execute({
  request: {
    params: {
      path: { id: 1 }  // Use integer, not string
    }
  }
});`}
            </pre>
          </div>

          <div className="bg-surface-base border border-border-reg rounded-lg p-4">
            <h4 className="font-semibold text-titles-and-attributes mb-3">Execute with Query Parameters</h4>
            <pre className="text-sm text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
{`// GET request with query parameters (e.g., /comments?postId=1)
const response = await apiIntegration.execute({
  request: {
    params: {
      query: { postId: 1 }  // Use integer, not string
    }
  }
});`}
            </pre>
          </div>

          <div className="bg-surface-base border border-border-reg rounded-lg p-4">
            <h4 className="font-semibold text-titles-and-attributes mb-3">Execute with Request Body (POST)</h4>
            <pre className="text-sm text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
{`// POST request with request body
const response = await apiIntegration.execute({
  request: {
    json: {  // Use 'json' not 'body'
      title: "My New Post",
      body: "This is the content",
      userId: 1
    }
  }
});`}
            </pre>
          </div>

          <div className="bg-surface-base border border-border-reg rounded-lg p-4">
            <h4 className="font-semibold text-titles-and-attributes mb-3">Execute with Custom Headers</h4>
            <pre className="text-sm text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
{`// Request with custom headers
const response = await apiIntegration.execute({
  request: {
    headers: {
      "X-Custom-Header": "custom-value",
      "X-Request-Id": "abc-123"
    }
  }
});`}
            </pre>
          </div>

          <div className="bg-surface-base border border-border-reg rounded-lg p-4">
            <h4 className="font-semibold text-titles-and-attributes mb-3">Error Handling</h4>
            <pre className="text-sm text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
{`// Wrap in try-catch to handle errors
try {
  const response = await apiIntegration.execute({ request });

  // Check for errors first
  if (response.errors && response.errors.length > 0) {
    const error = response.errors[0];
    console.error('Request failed:', error.message);
    // Example: "request failed schema validation:
    //           /json/userId is invalid, got string, want integer"
    return;
  }

  const statusCode = response.resources?.[0]?.status_code;
  const responseBody = response.resources?.[0]?.response_body;

  if (statusCode >= 400) {
    console.error(\`API error \${statusCode}\`, responseBody);
  }
} catch (err) {
  console.error('Execution failed:', err.message);
}`}
            </pre>
          </div>

          <div className="bg-primary-bg border border-primary-idle rounded p-4">
            <h4 className="font-semibold text-primary-idle mb-2">Configuration Notes:</h4>
            <ul className="text-sm text-body-and-labels space-y-1">
              <li>• Definition ID can be either the <code>id</code> or <code>name</code> from your <code>manifest.yml</code> api_integrations section</li>
              <li>• Operation ID is defined in your OpenAPI specification file</li>
              <li>• JSONPlaceholder API provides: posts, users, comments, albums, photos, todos</li>
              <li>• All responses include status_code and response_body</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

