import { useEffect } from 'react';
import { collectionsAPI, snippetsAPI } from '../services/api';
import useAppStore from '../store/useAppStore';

const Layout = ({ children }) => {
  const { 
    setCollections, 
    setSnippets, 
    setLoading, 
    setError,
    loading 
  } = useAppStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load collections and snippets in parallel
        const [collectionsResponse, snippetsResponse] = await Promise.all([
          collectionsAPI.getAll(),
          snippetsAPI.getAll()
        ]);

        setCollections(collectionsResponse.data.data);
        setSnippets(snippetsResponse.data.data);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setCollections, setSnippets, setLoading, setError]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
};

export default Layout;
