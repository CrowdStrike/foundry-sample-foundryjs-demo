interface ModalConfig {
  id: string;
  type: string;
  title: string;
  path: string;
  data: string;
  size: string;
  align: string;
}

interface ModalResult {
  success?: boolean;
  data?: unknown;
  message?: string;
  returnData?: unknown;
}

interface ConnectionStatus {
  connected?: boolean;
}

interface ModalsDemoUIProps {
  modalConfig?: ModalConfig;
  loading?: boolean;
  results?: ModalResult | null;
  error?: string | null;
  connectionStatus?: ConnectionStatus;
  onConfigChange?: (config: ModalConfig) => void;
  onOpenModal?: () => void;
  onCloseModal?: (data?: unknown) => void;
  onLoadUserModal?: () => void;
  onLoadReportModal?: () => void;
  onLoadSettingsModal?: () => void;
}

/**
 * Presentational Modals Demo Component
 * Pure component that only accepts props - no context dependencies
 */
export function ModalsDemoUI({
  // Modal configuration
  modalConfig = {
    id: "",
    type: "page",
    title: "Demo Modal Content",
    path: "/modal-demo",
    data: JSON.stringify(
      {
        userId: "demo-user-123",
        mode: "interactive",
        theme: "gradient",
        features: ["data-display", "close-actions", "parent-communication"],
      },
      null,
      2
    ),
    size: "lg",
    align: "top",
  },

  // State
  loading = false,
  results = null,
  error = null,
  connectionStatus = { connected: true },

  // Handlers
  onConfigChange = () => {},
  onOpenModal = () => {},
  onLoadUserModal = () => {},
  onLoadReportModal = () => {},
  onLoadSettingsModal = () => {},
}: ModalsDemoUIProps) {
  return (
    <div>
      <div className="space-y-6">
        {/* Modal Configuration Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-titles-and-attributes">
            Modal Configuration
          </h3>

          <div className="border border-border-reg rounded-lg p-4 bg-surface-base">
            <div className="space-y-4">
              {/* Presets Section */}
              <div>
                <label className="block text-sm font-medium text-titles-and-attributes mb-2">
                  Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={onLoadUserModal}
                    className="px-3 py-1 text-sm bg-primary-idle text-surface-base rounded transition-colors shadow-sm font-medium button-primary"
                  >
                    User Profile Modal
                  </button>
                  <button
                    onClick={onLoadReportModal}
                    className="px-3 py-1 text-sm bg-positive text-surface-base rounded transition-colors shadow-sm font-medium"
                  >
                    Report Viewer Modal
                  </button>
                  <button
                    onClick={onLoadSettingsModal}
                    className="px-3 py-1 text-sm bg-purple text-surface-base rounded transition-colors shadow-sm font-medium"
                  >
                    Settings Modal
                  </button>
                </div>
              </div>

              {/* Configuration Form - 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-titles-and-attributes mb-1">
                    Page ID *
                  </label>
                  <input
                    type="text"
                    value={modalConfig.id}
                    onChange={(e) =>
                      onConfigChange({ ...modalConfig, id: e.target.value })
                    }
                    placeholder=""
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-body-and-labels font-mono text-xs"
                  />
                  <p className="text-xs text-body-and-labels mt-1">
                    Find the page ID in your{" "}
                    <code className="bg-surface-md px-1 rounded">
                      manifest.yml
                    </code>{" "}
                    under{" "}
                    <code className="bg-surface-md px-1 rounded">
                      ui.pages.your_page_name.id
                    </code>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-titles-and-attributes mb-1">
                    Modal Type
                  </label>
                  <select
                    value={modalConfig.type}
                    onChange={(e) =>
                      onConfigChange({ ...modalConfig, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-body-and-labels"
                  >
                    <option value="extension">Extension</option>
                    <option value="page">Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-titles-and-attributes mb-1">
                    Modal Title
                  </label>
                  <input
                    type="text"
                    value={modalConfig.title}
                    onChange={(e) =>
                      onConfigChange({ ...modalConfig, title: e.target.value })
                    }
                    placeholder="Modal Title"
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-body-and-labels"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-titles-and-attributes mb-1">
                    Initial Path
                  </label>
                  <input
                    type="text"
                    value={modalConfig.path}
                    onChange={(e) =>
                      onConfigChange({ ...modalConfig, path: e.target.value })
                    }
                    placeholder="/profile"
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-body-and-labels"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-titles-and-attributes mb-1">
                    Size
                  </label>
                  <select
                    value={modalConfig.size}
                    onChange={(e) =>
                      onConfigChange({ ...modalConfig, size: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-body-and-labels"
                  >
                    <option value="sm">Small (sm)</option>
                    <option value="md">Medium (md)</option>
                    <option value="lg">Large (lg)</option>
                    <option value="xl">Extra Large (xl)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-titles-and-attributes mb-1">
                    Alignment
                  </label>
                  <select
                    value={modalConfig.align}
                    onChange={(e) =>
                      onConfigChange({ ...modalConfig, align: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-body-and-labels"
                  >
                    <option value="">Default (center)</option>
                    <option value="top">Top</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-titles-and-attributes mb-1">
                  Modal Data (JSON) - passed to modal content
                </label>
                <textarea
                  value={modalConfig.data}
                  onChange={(e) =>
                    onConfigChange({ ...modalConfig, data: e.target.value })
                  }
                  placeholder='{"userId": "123", "mode": "edit"}'
                  rows={6}
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-body-and-labels font-mono text-sm"
                />
              </div>

              {/* Open Modal Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenModal}
                  disabled={loading || !connectionStatus.connected}
                  className="w-full px-4 py-2 bg-primary-idle text-surface-base rounded transition-colors disabled:bg-surface-md disabled:text-body-and-labels shadow-sm font-medium button-primary"
                >
                  {loading ? "Opening..." : "Open Modal"}
                </button>

                {loading && (
                  <div className="flex items-center justify-center text-primary-idle mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-idle mr-2"></div>
                    Processing modal operation...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-critical-light border border-critical rounded-lg p-4">
            <h4 className="font-semibold text-critical">Error</h4>
            <p className="text-critical mt-1">{error}</p>
          </div>
        )}

        {/* Results Display - Always Visible */}
        <div>
          <h4 className="font-semibold text-positive mb-2">
            Modal Result:{" "}
            {results?.message || "No modal operation performed yet"}
          </h4>
          {results?.returnData !== undefined && results?.returnData !== null && (
            <div>
              <p className="text-sm text-positive font-medium mb-1">
                Return Data:
              </p>
              <pre className="text-sm text-positive bg-surface-base p-2 rounded border border-border-reg overflow-auto max-h-32">
                {String(JSON.stringify(results.returnData, null, 2))}
              </pre>
            </div>
          )}
        </div>

        {/* API Reference */}
        <div className="bg-surface-md border border-border-reg rounded-lg p-4">
          <h4 className="font-semibold text-titles-and-attributes mb-2">
            Modal API Reference & Implementation Guide:
          </h4>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-titles-and-attributes mb-1">
                Opening Modals:
              </p>
              <code className="text-xs text-body-and-labels bg-surface-base p-1 rounded border border-border-reg">
                const result = await falcon.ui.openModal(config, title, options)
              </code>
            </div>

            <div>
              <p className="text-sm font-medium text-titles-and-attributes mb-1">
                Modal Configuration:
              </p>
              <code className="text-xs text-body-and-labels bg-surface-base p-1 rounded border border-border-reg block">
                {
                  '{id: "your-page-id", type: "page"} // Use page ID from manifest.yml'
                }
              </code>
            </div>

            <div>
              <p className="text-sm font-medium text-titles-and-attributes mb-1">
                Modal Options:
              </p>
              <code className="text-xs text-body-and-labels bg-surface-base p-1 rounded border border-border-reg block">
                {
                  '{path: "/route", data: {}, size: "sm|md|lg|xl", align: "top"}'
                }
              </code>
            </div>

            <div>
              <p className="text-sm font-medium text-titles-and-attributes mb-1">
                Creating Modal Pages (No Bundler Required):
              </p>
              <div className="bg-surface-base border border-border-reg p-2 rounded text-xs">
                <div className="text-titles-and-attributes mb-2">
                  1. Add importmap to your HTML:
                </div>
                <code className="block text-body-and-labels mb-2">
                  {'<script type="importmap">'}
                  <br />
                  {
                    '  {"imports": {"@crowdstrike/foundry-js": "https://assets.foundry.crowdstrike.com/foundry-js@0.18.0/index.js"}}'
                  }
                  <br />
                  {"</script>"}
                </code>

                <div className="text-titles-and-attributes mb-2">
                  2. Import and use foundry-js:
                </div>
                <code className="block text-body-and-labels mb-2">
                  {'<script type="module">'}
                  <br />
                  {'  import FalconApi from "@crowdstrike/foundry-js";'}
                  <br />
                  {"  const falcon = new FalconApi(); await falcon.connect();"}
                  <br />
                  {"  // Access passed data: falcon.data"}
                  <br />
                  {"  // Close modal: await falcon.ui.closeModal(returnData);"}
                  <br />
                  {"</script>"}
                </code>

                <div className="text-titles-and-attributes mb-1">
                  3. Register page in manifest.yml under ui.pages
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-titles-and-attributes mb-1">
                Closing from Modal Content:
              </p>
              <code className="text-xs text-body-and-labels bg-surface-base p-1 rounded border border-border-reg">
                await falcon.ui.closeModal(returnData)
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

