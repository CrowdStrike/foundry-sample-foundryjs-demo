import { useState } from 'react';
import { useFalconApiContext } from '../contexts/falcon-api-context.tsx';
import { CloudFunctionsDemoUI } from './cloud-functions-demo-presentational.tsx';

interface CloudFunctionResult {
  success: boolean;
  method: string;
  path: string;
  data: unknown;
  message: string;
}

export function CloudFunctionDemo() {
  const { falcon } = useFalconApiContext();
  const [functionName, setFunctionName] = useState('greeting_function');
  const [functionVersion, setFunctionVersion] = useState('1');
  const [httpMethod, setHttpMethod] = useState('POST');
  const [functionPath, setFunctionPath] = useState('/greet');
  const [requestData, setRequestData] = useState(`{
  "name": "Demo User"
}`);
  const [queryParams, setQueryParams] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CloudFunctionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeFunction = async () => {
    if (!functionName.trim()) {
      setError('Function name is required');
      return;
    }

    if (!falcon?.cloudFunction) {
      setError('Cloud Function not available');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Create cloud function instance
      const cloudFunction = falcon.cloudFunction({
        name: functionName.trim(),
        version: parseInt(functionVersion) || 1
      });

      // Build path with query parameters
      let fullPath = functionPath.trim() || '/';
      if (queryParams.trim()) {
        const separator = fullPath.includes('?') ? '&' : '?';
        fullPath += separator + queryParams.trim();
      }

      console.log(`Executing ${httpMethod} ${fullPath} on function ${functionName}`);

      let result;
      let requestBody: Record<string, unknown> | undefined = undefined;

      // Parse request data for methods that support body
      if (['POST', 'PUT', 'PATCH'].includes(httpMethod) && requestData.trim()) {
        try {
          requestBody = JSON.parse(requestData);
        } catch (parseError) {
          throw new Error(`Invalid JSON in request data: ${(parseError as Error).message}`);
        }
      }

      // Execute based on HTTP method
      switch (httpMethod) {
        case 'GET':
          result = await cloudFunction.path(fullPath).get();
          break;
        case 'POST':
          result = await cloudFunction.path(fullPath).post(requestBody);
          break;
        case 'PUT':
          result = await cloudFunction.path(fullPath).put(requestBody);
          break;
        case 'PATCH':
          result = await cloudFunction.path(fullPath).patch(requestBody);
          break;
        case 'DELETE':
          result = await cloudFunction.path(fullPath).delete(requestBody);
          break;
        default:
          throw new Error(`Unsupported HTTP method: ${httpMethod}`);
      }

      setResults({
        success: true,
        method: httpMethod,
        path: fullPath,
        data: result,
        message: `${httpMethod} request to ${fullPath} completed successfully`
      });
    } catch (err) {
      console.error('Cloud Function error:', err);
      setError((err as Error).message || 'Failed to execute cloud function');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  return (
    <CloudFunctionsDemoUI
      // Function configuration
      functionName={functionName}
      functionVersion={functionVersion}
      httpMethod={httpMethod}
      functionPath={functionPath}
      requestData={requestData}
      queryParams={queryParams}

      // State
      loading={loading}
      results={results}
      error={error}
      isConnected={falcon?.isConnected}

      // Handlers
      onFunctionNameChange={setFunctionName}
      onFunctionVersionChange={setFunctionVersion}
      onHttpMethodChange={setHttpMethod}
      onFunctionPathChange={setFunctionPath}
      onRequestDataChange={setRequestData}
      onQueryParamsChange={setQueryParams}
      onExecuteFunction={executeFunction}
      onClearResults={clearResults}
    />
  );
}