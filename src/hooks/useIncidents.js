import { useUserCollection } from './useUserCollection'

export function useIncidents() {
  const { items, loading, error, addItem, updateItem, deleteItem } =
    useUserCollection('incidents')

  return {
    incidents: items,
    loading,
    error,
    addIncident: (data) => addItem({ ...data, status: 'open' }),
    updateIncident: updateItem,
    deleteIncident: deleteItem,
  }
}