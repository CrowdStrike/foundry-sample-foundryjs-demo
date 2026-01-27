import { useState, useEffect, useRef } from 'react';
import { useFalconApiContext } from '../contexts/falcon-api-context.tsx';

interface PollAttempt {
  attempt: number;
  status: string;
  timestamp: string;
}

export function WorkflowDemo() {
  const { falcon } = useFalconApiContext();
  const [workflowName, setWorkflowName] = useState('simple-greeting-workflow');
  const [parameters, setParameters] = useState('{\n  "user_name": "Developer"\n}');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionId, setExecutionId] = useState('');
  const [status, setStatus] = useState(''); // 'executing', 'fetching', 'complete'
  const [pollAttempts, setPollAttempts] = useState<PollAttempt[]>([]); // Track polling attempts
  const pollIntervalRef = useRef<number | null>(null);
  const pollAttemptsCountRef = useRef<number>(0);

  // Reset to default values when component mounts
  useEffect(() => {
    setWorkflowName('simple-greeting-workflow');
    setParameters('{\n  "user_name": "Developer"\n}');
  }, []);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const executeWorkflow = async () => {
    if (!workflowName.trim()) {
      setError('Please enter a workflow name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setExecutionId('');
    setStatus('executing');
    setPollAttempts([]);

    try {
      let parsedParams = {};
      if (parameters.trim()) {
        parsedParams = JSON.parse(parameters);
      }

      console.log('Executing workflow:', workflowName.trim(), 'with parameters:', parsedParams);

      // Step 1: Execute workflow
      const triggerResult = await falcon.api.workflows.postEntitiesExecuteV1(
        parsedParams,
        { name: workflowName.trim(), depth: 0 }
      );

      if (triggerResult.resources && triggerResult.resources.length > 0) {
        const execId = triggerResult.resources[0] as string;
        setExecutionId(execId);
        setStatus('fetching');

        // Step 2: Wait a bit, then fetch results
        setTimeout(() => {
          getExecutionResultsById(execId);
        }, 2000);
      } else {
        setError('No execution ID returned from workflow trigger');
        setStatus('');
      }
    } catch (err) {
      console.error('Workflow execution error:', err);
      setError((err as Error).message || 'Failed to execute workflow');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const getExecutionResultsById = async (id: string) => {
    if (!id) return;

    setLoading(true);
    setPollAttempts([]);
    pollAttemptsCountRef.current = 0;

    // Clear any existing polling interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    const maxAttempts = 20; // Max 20 attempts (20 seconds)
    const pollInterval = 1000; // Poll every 1 second

    // Function to check workflow status
    const checkStatus = async () => {
      try {
        pollAttemptsCountRef.current += 1;
        const attempt = pollAttemptsCountRef.current;

        if (attempt > maxAttempts) {
          clearInterval(pollIntervalRef.current!);
          setError('Workflow execution timed out after 20 seconds');
          setStatus('');
          setLoading(false);
          return;
        }

        const result = await falcon.api.workflows.getEntitiesExecutionResultsV1({
          ids: [id]
        });

        const execution = result.resources?.[0] as any;
        const executionStatus = execution?.status;

        console.log(`Polling attempt ${attempt}: status = ${executionStatus}`);

        // Add to poll attempts history
        setPollAttempts(prev => [...prev, {
          attempt,
          status: executionStatus || 'unknown',
          timestamp: new Date().toLocaleTimeString()
        }]);

        // Check if workflow is complete
        if (executionStatus === 'Completed' || executionStatus === 'Failed' || executionStatus === 'Cancelled') {
          clearInterval(pollIntervalRef.current!);
          setResults(result);
          setStatus('complete');
          setLoading(false);
        }
      } catch (err) {
        console.error('Get execution results error:', err);
        clearInterval(pollIntervalRef.current!);
        setError((err as Error).message || 'Failed to get execution results');
        setStatus('');
        setLoading(false);
      }
    };

    // Start polling
    pollIntervalRef.current = setInterval(checkStatus, pollInterval) as unknown as number;
    // Check immediately
    checkStatus();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-titles-and-attributes mb-2">Workflows Demo</h2>
        <p className="text-body-and-labels">
          Execute on-demand workflows and retrieve execution results using our <strong>simple-greeting-workflow</strong> that accepts a name parameter and returns a personalized greeting.
        </p>
      </div>

      {/* Execute Workflow Section */}
      <div className="border border-border-reg rounded-lg p-4 bg-surface-base">
        <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">1. Execute Workflow</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-body-and-labels mb-1">
              Workflow Name *
            </label>
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="simple-greeting-workflow"
              className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-body-and-labels mb-1">
              Parameters (JSON)
            </label>
            <textarea
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              placeholder={`{\n  "user_name": "Developer"\n}`}
              rows={4}
              className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle font-mono text-sm bg-surface-base text-titles-and-attributes"
            />
            <p className="text-xs text-body-and-labels mt-1">
              Try changing the "user_name" value to see different greeting messages!
            </p>
          </div>

          <button
            onClick={executeWorkflow}
            disabled={loading || !falcon?.isConnected}
            className="px-6 py-2 bg-primary-idle text-surface-base rounded hover:bg-primary-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm font-medium"
          >
            {status === 'executing' ? 'Executing Workflow...' : 'Execute Greeting Workflow'}
          </button>
        </div>
      </div>

      {/* Execution Flow Status */}
      {(executionId || status) && (
        <div className="border border-border-reg rounded-lg p-4 bg-surface-base">
          <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">2. Execution Flow</h3>

          <div className="space-y-3">
            {/* Step 1: Workflow Triggered */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                status === 'executing' || status === 'fetching' || status === 'complete'
                  ? 'bg-positive text-surface-base'
                  : 'bg-surface-md text-body-and-labels'
              }`}>
                ✓
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-titles-and-attributes">Workflow Triggered</div>
                {executionId && (
                  <div className="text-xs text-body-and-labels font-mono">Execution ID: {executionId}</div>
                )}
              </div>
            </div>

            {/* Step 2: Results Polling */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                status === 'fetching'
                  ? 'bg-primary-idle text-surface-base animate-pulse'
                  : status === 'complete'
                  ? 'bg-positive text-surface-base'
                  : 'bg-surface-md text-body-and-labels'
              }`}>
                {status === 'fetching' ? '...' : status === 'complete' ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-titles-and-attributes">
                  Results Polling
                </div>
                <div className="text-xs text-body-and-labels">
                  Using getEntitiesExecutionResultsV1() - polling every second
                </div>
                {/* Poll attempts list */}
                {pollAttempts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {pollAttempts.map((attempt, idx) => (
                      <div key={idx} className="text-xs text-body-and-labels pl-3 border-l-2 border-border-reg">
                        Attempt {attempt.attempt}: {attempt.status} ({attempt.timestamp})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Complete with Results */}
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                status === 'complete'
                  ? 'bg-positive text-surface-base'
                  : 'bg-surface-md text-body-and-labels'
              }`}>
                {status === 'complete' ? '✓' : '3'}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-titles-and-attributes">
                  {status === 'complete' ? 'Workflow Complete!' : 'Workflow Complete'}
                </div>

                {/* Show greeting message if workflow is complete */}
                {results && status === 'complete' && (() => {
                  const updateActivity = results.resources?.[0]?.activities?.find(
                    activity => activity.node_id === 'UpdateVariable'
                  );
                  const greetingMessage = updateActivity?.result?.result;
                  const userName = results.resources?.[0]?.trigger?.result?.user_name;

                  if (greetingMessage) {
                    return (
                      <div className="mt-3 p-3 bg-positive-bg rounded border border-positive">
                        <div className="text-base font-medium text-titles-and-attributes">
                          🎉 {greetingMessage}
                        </div>
                        <div className="text-xs text-body-and-labels mt-1">
                          Generated for: {userName || 'Unknown'}
                        </div>
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs font-medium text-positive">
                            View Raw Response
                          </summary>
                          <pre className="text-xs text-titles-and-attributes bg-surface-base p-2 rounded border border-border-reg overflow-auto max-h-48 mt-1">
                            {JSON.stringify(results, null, 2)}
                          </pre>
                        </details>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-critical-bg border border-critical rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-critical">Error</h4>
          <p className="text-critical mt-1">{error}</p>
        </div>
      )}

      {/* API Reference */}
      <div className="bg-surface-base border border-border-reg rounded-lg p-4 shadow-sm">
        <h4 className="font-semibold text-titles-and-attributes mb-2">API Reference</h4>
        <div className="space-y-3 text-sm text-body-and-labels">
          <div>
            <div className="font-mono text-xs bg-surface-md px-2 py-1 rounded text-titles-and-attributes mb-1">
              falcon.api.workflows.postEntitiesExecuteV1(parameters, config)
            </div>
            <p className="text-xs ml-2">
              <strong>parameters</strong>: Workflow input data (e.g., <code className="bg-surface-md px-1 rounded">{'{'}"user_name": "Developer"{'}'}</code>)
              <br/>
              <strong>config</strong>: Execution config with workflow name and depth (e.g., <code className="bg-surface-md px-1 rounded">{'{'}"name": "simple-greeting-workflow", "depth": 0{'}'}</code>)
            </p>
          </div>
          <div>
            <div className="font-mono text-xs bg-surface-md px-2 py-1 rounded text-titles-and-attributes mb-1">
              falcon.api.workflows.getEntitiesExecutionResultsV1(options)
            </div>
            <p className="text-xs ml-2">
              <strong>options</strong>: Query options with execution IDs to fetch (e.g., <code className="bg-surface-md px-1 rounded">{'{'}"ids": ["execution-id"]{'}'}</code>)
              <br/>
              <span className="text-body-and-labels italic">Poll this endpoint until status is "Completed", "Failed", or "Cancelled"</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}