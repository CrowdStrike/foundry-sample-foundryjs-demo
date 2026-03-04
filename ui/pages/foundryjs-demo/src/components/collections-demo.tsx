import { useState, useEffect } from 'react';
import { useFalconApiContext } from '../contexts/falcon-api-context.tsx';
import { CollectionsDemoUI } from './collections-demo-presentational.tsx';

interface Item {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export function CollectionsDemo() {
  const { falcon } = useFalconApiContext();

  // Collection state
  const [collectionName] = useState('demo_items');
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    status: 'active',
    category: ''
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const collection = falcon?.collection ? falcon.collection({ collection: collectionName }) : null;

  // Load items on mount (only once)
  useEffect(() => {
    if (collection && !hasLoaded) {
      loadItems();
      setHasLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [falcon?.isConnected]); // Only trigger when connection changes

  // Clear messages after delay
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [successMessage, error]);

  // Update form when item is selected or cleared
  useEffect(() => {
    if (selectedItem) {
      // Populate form with selected item data
      setFormData({
        id: selectedItem.id,
        name: selectedItem.name || '',
        description: selectedItem.description || '',
        status: selectedItem.status || 'active',
        category: selectedItem.category || ''
      });
    } else {
      // Clear form for new item
      setFormData({
        id: '',
        name: '',
        description: '',
        status: 'active',
        category: ''
      });
    }
  }, [selectedItem]);

  // Generate unique ID
  const generateId = () => {
    return 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  };

  // CREATE - Write new item to collection
  const createItem = async () => {
    if (!collection || !formData.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newItem = {
        id: generateId(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        category: formData.category.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await collection.write(newItem.id, newItem);

      setSuccessMessage(`Item "${newItem.name}" created successfully`);
      setSelectedItem(null); // Clear selection to show empty form
      await loadItems();

    } catch (err) {
      console.error('Create error:', err);
      setError('Failed to create item: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // READ - Load all items from collection
  const loadItems = async () => {
    if (!collection) return;

    setLoading(true);
    setError(null);

    try {
      const result: any = await collection.list({ start: 0, limit: 100, end: undefined } as any);
      const itemIds = (result.resources || []) as string[];

      // Read items sequentially with a small delay to avoid rate limiting
      const fullItems: Item[] = [];
      for (const itemId of itemIds) {
        try {
          const itemData: any = await collection.read(itemId);
          fullItems.push({ ...(itemData as Omit<Item, 'id'>), id: itemId });

          // Small delay to avoid rate limiting (50ms between requests)
          if (itemIds.indexOf(itemId) < itemIds.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } catch (err) {
          console.warn(`Failed to load item ${itemId}:`, err);
        }
      }

      setItems(fullItems);
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load items: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // UPDATE - Update existing item
  const updateItem = async () => {
    if (!collection || !selectedItem) return;

    setLoading(true);
    setError(null);

    try {
      const item = items.find(i => i.id === selectedItem.id);
      if (!item) throw new Error('Item not found');

      const updatedItem: Item = {
        ...item,
        ...formData,
        updated_at: new Date().toISOString()
      };

      await collection.write(selectedItem.id, updatedItem as any);

      setSuccessMessage(`Item "${updatedItem.name}" updated successfully`);
      await loadItems();

    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update item: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE - Remove item from collection
  const deleteItem = async (itemId: string) => {
    if (!collection) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await collection.delete(itemId);

      setSuccessMessage('Item deleted successfully');
      setItems(prev => prev.filter(item => item.id !== itemId));

      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem(null);
      }

    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete item: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <CollectionsDemoUI
      // State
      items={items}
      selectedItem={selectedItem}
      formData={formData}
      loading={loading}
      error={error}
      successMessage={successMessage}
      isConnected={falcon?.isConnected || false}

      // Handlers
      onInputChange={handleInputChange}
      onCreateItem={createItem}
      onUpdateItem={updateItem}
      onDeleteItem={deleteItem}
      onLoadItems={loadItems}
      onSelectItem={setSelectedItem}
    />
  );
}
