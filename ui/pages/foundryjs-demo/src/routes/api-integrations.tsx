import { useState } from 'react';
import { useFalconApiContext } from '../contexts/falcon-api-context.tsx';
import { ApiIntegrationsDemoUI } from '../components/api-integrations-demo-presentational.tsx';

interface ApiResult {
  success?: boolean;
  statusCode?: number;
  data?: unknown;
  message?: string;
}

export function ApiIntegrations() {
  const { falcon } = useFalconApiContext();
  const [definitionId, setDefinitionId] = useState('JSONPlaceholder Demo API');
  const [operationId, setOperationId] = useState('getPosts');
  const [pathParams, setPathParams] = useState('{}');
  const [queryParams, setQueryParams] = useState('{}');
  const [requestBody, setRequestBody] = useState('{}');
  const [headers, setHeaders] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeIntegration = async () => {
    if (!definitionId.trim() || !operationId.trim()) {
      setError('Both Definition ID and Operation ID are required');
      return;
    }

    if (!falcon?.apiIntegration) {
      setError('API Integration not available');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Create API integration instance
      const apiIntegration = falcon.apiIntegration({
        definitionId: definitionId.trim(),
        operationId: operationId.trim()
      });

      // Parse parameters
      let pathParameters = {};
      let queryParameters = {};
      let body = {};
      let requestHeaders = {};

      try {
        if (pathParams.trim()) {
          pathParameters = JSON.parse(pathParams);
        }
        if (queryParams.trim()) {
          queryParameters = JSON.parse(queryParams);
        }
        if (requestBody.trim() && requestBody.trim() !== '{}') {
          body = JSON.parse(requestBody);
        }
        if (headers.trim() && headers.trim() !== '{}') {
          requestHeaders = JSON.parse(headers);
        }
      } catch (parseError) {
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
        throw new Error(`JSON parsing error: ${errorMessage}`);
      }

      // Build request object
      const request: Record<string, unknown> = {
        params: {
          ...(Object.keys(pathParameters).length > 0 && { path: pathParameters }),
          ...(Object.keys(queryParameters).length > 0 && { query: queryParameters })
        },
        ...(Object.keys(body).length > 0 && { json: body }),
        ...(Object.keys(requestHeaders).length > 0 && { headers: requestHeaders })
      };

      console.log('Executing API integration with request:', request);

      // Execute the integration
      const response = await apiIntegration.execute({
        request
      });

      // Check for errors first
      if (response.errors && response.errors.length > 0) {
        const error = response.errors[0];
        throw new Error(error?.message || 'Request failed');
      }

      const resource = response.resources?.[0] as any;
      const responseBody = resource?.response_body;
      const statusCode = resource?.status_code;

      if (statusCode && statusCode >= 400) {
        throw new Error(`API returned ${statusCode}. Response: ${JSON.stringify(responseBody, null, 2)}`);
      }

      setResults({
        success: true,
        statusCode: statusCode,
        data: responseBody,
        message: `API call executed successfully. Status: ${statusCode}`
      });
    } catch (err) {
      console.error('API Integration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute API integration';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  // Helper function to load a preset configuration
  const loadPreset = (
    operationId: string,
    pathParams = '{}',
    queryParams = '{}',
    requestBody = '{}',
    headers = '{}'
  ) => {
    setDefinitionId('JSONPlaceholder Demo API');
    setOperationId(operationId);
    setPathParams(pathParams);
    setQueryParams(queryParams);
    setRequestBody(requestBody);
    setHeaders(headers);
    clearResults();
  };

  const loadGetPosts = () => loadPreset('getPosts');
  const loadGetPostById = () => loadPreset('getPostById', `{
  "id": 1
}`);
  const loadGetComments = () => loadPreset('getComments', '{}', `{
  "postId": 1
}`);
  const loadCreatePost = () => loadPreset('createPost', '{}', '{}', `{
  "title": "My New Post",
  "body": "This is the content of my post",
  "userId": 1
}`, `{
  "X-Custom-Header": "demo-value"
}`);

  return (
    <ApiIntegrationsDemoUI
      definitionId={definitionId}
      operationId={operationId}
      pathParams={pathParams}
      queryParams={queryParams}
      requestBody={requestBody}
      headers={headers}
      loading={loading}
      results={results}
      error={error}
      isConnected={falcon?.isConnected}
      onDefinitionIdChange={setDefinitionId}
      onOperationIdChange={setOperationId}
      onPathParamsChange={setPathParams}
      onQueryParamsChange={setQueryParams}
      onRequestBodyChange={setRequestBody}
      onHeadersChange={setHeaders}
      onExecuteIntegration={executeIntegration}
      onClearResults={clearResults}
      onLoadGetPosts={loadGetPosts}
      onLoadGetPostById={loadGetPostById}
      onLoadGetComments={loadGetComments}
      onLoadCreatePost={loadCreatePost}
    />
  );
}