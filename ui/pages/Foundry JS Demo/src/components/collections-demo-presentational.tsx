interface Item {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
}

interface FormData {
  name?: string;
  category?: string;
  description?: string;
  status?: string;
}

interface CollectionsDemoUIProps {
  items?: Item[];
  selectedItem?: Item | null;
  formData?: FormData;
  loading?: boolean;
  error?: string | null;
  successMessage?: string | null;
  isConnected?: boolean;
  onInputChange?: (field: string, value: string) => void;
  onCreateItem?: () => void;
  onUpdateItem?: () => void;
  onDeleteItem?: (id: string) => void;
  onLoadItems?: () => void;
  onSelectItem?: (item: Item | null) => void;
}

/**
 * Presentational Collections Demo Component
 * Pure component demonstrating CRUD operations with code examples
 */
export function CollectionsDemoUI({
  // State
  items = [],
  selectedItem = null,
  formData = {},
  loading = false,
  error = null,
  successMessage = null,
  isConnected = false,

  // Handlers
  onInputChange = () => {},
  onCreateItem = () => {},
  onUpdateItem = () => {},
  onDeleteItem = () => {},
  onLoadItems = () => {},
  onSelectItem = () => {},
}: CollectionsDemoUIProps) {
  const isEditing = selectedItem !== null;
  const displayedItems = items.slice(0, 10); // Show only latest 10

  return (
    <div>
      <h2 className="text-2xl font-bold text-titles-and-attributes mb-2">
        Collections CRUD Demo
      </h2>
      <p className="text-body-and-labels mb-6">
        Foundry Collections provide a flexible document database. Create, read,
        update, and delete items using the form.
      </p>

      {/* Messages */}
      {error && (
        <div className="bg-critical-light border border-critical rounded-lg p-3  mb-4">
          <p className="text-critical text-sm">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-positive-light border border-positive rounded-lg p-3 mb-4">
          <p className="text-positive text-sm">{successMessage}</p>
        </div>
      )}

      {/* Main Layout: Sidebar + Form */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* Left Sidebar */}
        <div className="col-span-3 space-y-4">
          <button
            onClick={() => onSelectItem(null)}
            className="w-full px-4 py-2 bg-positive text-surface-base rounded hover:bg-positive-hover transition-colors shadow-sm font-medium"
          >
            + Create New
          </button>

          <div className="border border-border-reg rounded-lg p-4 bg-surface-base">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-titles-and-attributes">
                Items ({items.length})
              </h3>
              <button
                onClick={onLoadItems}
                disabled={loading}
                className="text-xs text-primary-idle hover:text-primary-active disabled:text-body-and-labels"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-idle"></div>
              </div>
            )}

            {!loading && displayedItems.length === 0 && (
              <p className="text-xs text-body-and-labels text-center py-4">
                No items yet. Create one to get started!
              </p>
            )}

            {!loading && displayedItems.length > 0 && (
              <div className="space-y-1">
                {displayedItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-colors ${
                      selectedItem?.id === item.id
                        ? "bg-primary-bg text-primary-idle border border-primary-idle"
                        : "bg-surface-md text-body-and-labels hover:bg-surface-lg border border-transparent"
                    }`}
                  >
                    {item.id}
                  </button>
                ))}
              </div>
            )}

            {items.length > 10 && (
              <p className="text-xs text-body-and-labels text-center mt-2">
                Showing 10 of {items.length} items
              </p>
            )}
          </div>
        </div>

        {/* Right Form Area */}
        <div className="col-span-9">
          <div className="border border-border-reg rounded-lg p-6 bg-surface-base">
            <h3 className="text-lg font-semibold text-titles-and-attributes mb-4">
              {isEditing ? `Edit Item: ${selectedItem.id}` : "Create New Item"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-body-and-labels mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => onInputChange("name", e.target.value)}
                    placeholder="Enter item name"
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-body-and-labels mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category || ""}
                    onChange={(e) => onInputChange("category", e.target.value)}
                    placeholder="Enter category"
                    className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => onInputChange("description", e.target.value)}
                  rows={3}
                  placeholder="Enter description"
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-and-labels mb-1">
                  Status
                </label>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => onInputChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-border-reg rounded-md focus:ring-primary-idle focus:border-primary-idle bg-surface-base text-titles-and-attributes"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={
                    isEditing
                      ? onUpdateItem
                      : onCreateItem
                  }
                  disabled={loading || !isConnected || !formData.name}
                  className="flex-1 px-4 py-2 bg-positive text-surface-base rounded hover:bg-positive-hover disabled:bg-surface-md disabled:text-body-and-labels transition-colors shadow-sm font-medium"
                >
                  {loading
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                    ? "Save Changes"
                    : "Create Item"}
                </button>

                {isEditing && (
                  <button
                    onClick={() => onDeleteItem(selectedItem.id)}
                    disabled={loading}
                    className="px-4 py-2 bg-critical text-surface-base rounded hover:bg-critical-hover disabled:bg-surface-md transition-colors shadow-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-titles-and-attributes">
          Implementation Code
        </h3>

        <div className="bg-surface-base border border-border-reg rounded-lg p-4">
          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Setup
          </p>
          <pre className="text-xs text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
            {`const collection = falcon.collection({ collection: 'demo_items' });`}
          </pre>
        </div>

        <div className="bg-surface-base border border-border-reg rounded-lg p-4">
          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Create / Update
          </p>
          <pre className="text-xs text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
            {`const item = {
  id: 'item_' + Date.now(),
  name: 'Sample Item',
  description: 'Item description',
  status: 'active',
  category: 'demo',
  created_at: new Date().toISOString()
};

await collection.write(item.id, item);`}
          </pre>
        </div>

        <div className="bg-surface-base border border-border-reg rounded-lg p-4">
          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Read
          </p>
          <pre className="text-xs text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
            {`// List all items
const result = await collection.list({ start: 0, limit: 100 });
const itemIds = result.resources || [];

// Read single item
const item = await collection.read(itemId);`}
          </pre>
        </div>

        <div className="bg-surface-base border border-border-reg rounded-lg p-4">
          <p className="text-sm font-semibold text-titles-and-attributes mb-3">
            Delete
          </p>
          <pre className="text-xs text-body-and-labels font-mono overflow-x-auto bg-surface-md p-3 rounded">
            {`await collection.delete(itemId);`}
          </pre>
        </div>
      </div>
    </div>
  );
}

