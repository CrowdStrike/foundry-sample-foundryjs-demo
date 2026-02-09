import { useState } from 'react';
import { LogScaleDemoUI } from './logscale-demo-presentational.tsx';
import { useFalconApiContext } from '../contexts/falcon-api-context.tsx';

interface LogScaleResult {
  operation: string;
  success: boolean;
  data: any;
  message: string;
}

export function LogScaleDemo() {
  const { falcon } = useFalconApiContext();
  const [activeTab, setActiveTab] = useState('write');
  const [eventData, setEventData] = useState(`{
  "event_type": "user_login",
  "username": "jdoe",
  "timestamp": "${new Date().toISOString()}",
  "source_ip": "192.168.1.100",
  "success": true,
  "user_agent": "Mozilla/5.0 Chrome/120.0.0.0"
}`);
  const [searchQuery, setSearchQuery] = useState('event_type=user_login');
  const [timeStart, setTimeStart] = useState('24h');
  const [timeEnd, setTimeEnd] = useState('now');
  const [savedQueryId, setSavedQueryId] = useState('');
  const [queryParameters, setQueryParameters] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LogScaleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeOperation = async (operation: string) => {
    if (!falcon?.logscale) {
      setError('LogScale not available');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let result: any;

      switch (operation) {
        case 'write': {
          const data = JSON.parse(eventData);
          result = await (falcon.logscale.write as any)(data);
          setResults({
            operation: 'write',
            success: true,
            data: result,
            message: `Event written. Rows written: ${result.resources?.[0]?.rows_written || 'unknown'}`
          });
          break;
        }

        case 'query':
          if (!searchQuery.trim()) {
            throw new Error('Search query is required');
          }
          result = await falcon.logscale.query({
            name: 'LogScaleRepo',
            search_query: searchQuery.trim(),
            start: timeStart.trim() || '24h',
            end: timeEnd.trim() || 'now'
          });
          setResults({
            operation: 'query',
            success: true,
            data: result,
            message: `Dynamic query executed. Found ${result.resources?.length || 0} results`
          });
          break;

        case 'savedQuery': {
          if (!savedQueryId.trim()) {
            throw new Error('Saved query ID is required');
          }
          let params = {};
          if (queryParameters.trim()) {
            params = JSON.parse(queryParameters);
          }

          result = await falcon.logscale.savedQuery({
            id: savedQueryId.trim(),
            start: timeStart.trim() || '7d',
            mode: 'sync',
            parameters: params
          });
          setResults({
            operation: 'savedQuery',
            success: true,
            data: result,
            message: `Saved query executed. Status: ${result.status || 'completed'}`
          });
          break;
        }

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (err) {
      console.error(`LogScale ${operation} error:`, err);
      setError((err as Error).message || `Failed to execute ${operation}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setError(null);
  };

  const updateEventTimestamp = () => {
    try {
      const data = JSON.parse(eventData);
      data.timestamp = new Date().toISOString();
      setEventData(JSON.stringify(data, null, 2));
    } catch {
      // Ignore JSON parse errors, user might be editing
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    clearResults();
  };

  return (
    <LogScaleDemoUI
      appId={falcon.appId ?? ""}
      
      // Tab state
      activeTab={activeTab}
      onTabChange={handleTabChange}

      // Form data
      eventData={eventData}
      searchQuery={searchQuery}
      timeStart={timeStart}
      timeEnd={timeEnd}
      savedQueryId={savedQueryId}
      queryParameters={queryParameters}

      // Status
      loading={loading}
      results={results}
      error={error}
      isConnected={falcon?.isConnected}

      // Handlers
      onEventDataChange={setEventData}
      onSearchQueryChange={setSearchQuery}
      onTimeStartChange={setTimeStart}
      onTimeEndChange={setTimeEnd}
      onSavedQueryIdChange={setSavedQueryId}
      onQueryParametersChange={setQueryParameters}
      onExecuteOperation={executeOperation}
      onClearResults={clearResults}
      onUpdateEventTimestamp={updateEventTimestamp}
      falcon={falcon}
    />
  );
}