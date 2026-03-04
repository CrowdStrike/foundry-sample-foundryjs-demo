interface WorkflowResult {
  type?: string;
  data?: unknown;
  executionId?: string;
  status?: string;
}

interface WorkflowsDemoUIProps {
  workflowName?: string;
  parameters?: string;
  executionId?: string;
  loading?: boolean;
  error?: string | null;
  results?: WorkflowResult | null;
  isConnected?: boolean;
  onWorkflowNameChange?: (value: string) => void;
  onParametersChange?: (value: string) => void;
  onExecutionIdChange?: (value: string) => void;
  onExecuteWorkflow?: () => void;
  onGetExecutionResults?: () => void;
  onClearResults?: () => void;
}

/**
 * Presentational Workflows Demo Component
 * Pure component that only accepts props - no context dependencies
 */
export function WorkflowsDemoUI({
  // Form state
  workflowName = "",
  parameters = "{}",
  executionId = "",

  // Status
  loading = false,
  error = null,
  results = null,
  isConnected = false,

  // Handlers
  onWorkflowNameChange = () => {},
  onParametersChange = () => {},
  onExecutionIdChange = () => {},
  onExecuteWorkflow = () => {},
  onGetExecutionResults = () => {},
  onClearResults = () => {}
}: WorkflowsDemoUIProps) {
  return (
    <div className="bg-surface-base border border-border-reg rounded-lg p-6 shadow-base">
      <h2 className="text-2xl font-bold text-titles-and-attributes mb-4">Workflows Demo</h2>

      <div className="space-y-6">
        <p className="text-body-and-labels">
          Demonstrate executing workflows and retrieving results using the Foundry API.
        </p>

        {/* Execute Workflow Section */}
        <div className="border border-border-reg rounded-lg p-4 bg-surface-base">
          <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">Execute Workflow</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Workflow Name *
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => onWorkflowNameChange(e.target.value)}
                placeholder="e.g., MyWorkflowTemplate"
                className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Parameters (JSON)
              </label>
              <textarea
                value={parameters}
                onChange={(e) => onParametersChange(e.target.value)}
                placeholder={`{\n  "targetHost": "server-01",\n  "action": "investigate"\n}`}
                rows={4}
                className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle font-mono text-sm bg-surface-base text-titles-and-attributes"
              />
            </div>

            <button
              onClick={onExecuteWorkflow}
              disabled={loading || !isConnected}
              className="px-4 py-2 bg-primary-idle text-surface-base rounded hover:bg-primary-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm font-medium"
            >
              {loading ? 'Executing...' : 'Execute Workflow'}
            </button>
          </div>
        </div>

        {/* Get Results Section */}
        <div className="border border-border-reg rounded-lg p-4 bg-surface-base">
          <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">Get Execution Results</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-body-and-labels mb-1">
                Execution ID
              </label>
              <input
                type="text"
                value={executionId}
                onChange={(e) => onExecutionIdChange(e.target.value)}
                placeholder="Enter execution ID from workflow trigger"
                className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle font-mono text-sm bg-surface-base text-titles-and-attributes"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onGetExecutionResults}
                disabled={loading || !isConnected}
                className="px-4 py-2 bg-positive text-surface-base rounded hover:bg-positive-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm font-medium"
              >
                {loading ? 'Getting Results...' : 'Get Results'}
              </button>
              <button
                onClick={onClearResults}
                className="px-4 py-2 bg-normal-idle text-titles-and-attributes rounded hover:bg-normal-hover transition-colors shadow-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-critical-bg border border-critical rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-critical">Error</h4>
            <p className="text-critical mt-1">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="bg-positive-bg border border-positive rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-positive mb-2">
              {results.type === 'trigger' ? 'Workflow Triggered' : 'Execution Results'}
            </h4>
            <pre className="text-sm text-titles-and-attributes bg-surface-base p-3 rounded border border-border-reg overflow-auto max-h-64">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        )}

        {/* API Reference */}
        <div className="bg-primary-bg border border-primary-idle rounded-lg p-4 shadow-sm">
          <h4 className="font-semibold text-primary-idle mb-2">API Reference:</h4>
          <ul className="text-sm text-body-and-labels space-y-1">
            <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">falcon.api.workflows.postEntitiesExecuteV1(parameters, config)</code> - Execute workflow</li>
            <li>• <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">falcon.api.workflows.getEntitiesExecutionResultsV1({'{'}"ids": ["execution-id"]{'}'}</code> - Get results</li>
            <li>• Config: <code className="bg-surface-md px-2 py-0.5 rounded text-titles-and-attributes">{'{'}"name": "workflow-name", "depth": 0{'}'}</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

