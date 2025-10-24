import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Menu, Plus, Search, Star, Folder, Code, Filter } from 'lucide-react';
import SnippetCard from '../components/SnippetCard';
import SnippetDisplay from '../components/SnippetDisplay';
import NewSnippetDialog from '../components/NewSnippetDialog';
import useAppStore from '../store/useAppStore';
import { collectionsAPI, snippetsAPI } from '../services/api';

const DashboardPage = () => {
  const {
    collections,
    snippets,
    selectedSnippet,
    selectedCollection,
    filteredSnippets,
    sidebarOpen,
    setSelectedSnippet,
    setSelectedCollection,
    filterSnippets,
    setSidebarOpen,
    addSnippet,
    addCollection,
    updateSnippet,
    deleteSnippet,
    getFavorites,
    getAllTags
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [isNewSnippetOpen, setIsNewSnippetOpen] = useState(false);

  // Filter snippets when dependencies change
  useEffect(() => {
    filterSnippets({
      search: searchTerm,
      isFavorite: showFavorites,
      tag: selectedTag
    });
  }, [searchTerm, showFavorites, selectedTag, selectedCollection, snippets, filterSnippets]);

  const handleCollectionSelect = (collection) => {
    setSelectedCollection(collection);
    setSelectedSnippet(null);
  };

  const handleSnippetSelect = (snippet) => {
    setSelectedSnippet(snippet);
  };

  const handleToggleFavorite = async (snippetId) => {
    try {
      await snippetsAPI.toggleFavorite(snippetId);
      updateSnippet(snippetId, { isFavorite: !snippets.find(s => s._id === snippetId)?.isFavorite });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    try {
      await snippetsAPI.delete(snippetId);
      deleteSnippet(snippetId);
      if (selectedSnippet?._id === snippetId) {
        setSelectedSnippet(null);
      }
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  };

  const allTags = getAllTags();
  const favorites = getFavorites();

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent
            collections={collections}
            selectedCollection={selectedCollection}
            onCollectionSelect={handleCollectionSelect}
            favorites={favorites}
            onFavoritesSelect={() => {
              setSelectedCollection(null);
              setShowFavorites(true);
            }}
            onNewCollection={addCollection}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:border-r">
        <SidebarContent
          collections={collections}
          selectedCollection={selectedCollection}
          onCollectionSelect={handleCollectionSelect}
          favorites={favorites}
          onFavoritesSelect={() => {
            setSelectedCollection(null);
            setShowFavorites(true);
          }}
          onNewCollection={addCollection}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">CodeKeep</h1>
              </div>
              
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search snippets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={showFavorites ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavorites(!showFavorites)}
              >
                <Star className="h-4 w-4 mr-2" />
                Favorites
              </Button>
              
              <Button onClick={() => setIsNewSnippetOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Snippet
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Snippet List */}
          <div className="w-1/2 border-r bg-muted/30">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {showFavorites ? 'Favorites' : selectedCollection?.name || 'All Snippets'}
                </h2>
                <div className="flex items-center space-x-2">
                  {allTags.length > 0 && (
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="">All Tags</option>
                      {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <AnimatePresence>
                  {filteredSnippets.map((snippet, index) => (
                    <motion.div
                      key={snippet._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SnippetCard
                        snippet={snippet}
                        isSelected={selectedSnippet?._id === snippet._id}
                        onClick={() => handleSnippetSelect(snippet)}
                        onToggleFavorite={() => handleToggleFavorite(snippet._id)}
                        onDelete={() => handleDeleteSnippet(snippet._id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Snippet Display */}
          <div className="w-1/2">
            <AnimatePresence mode="wait">
              {selectedSnippet ? (
                <motion.div
                  key={selectedSnippet._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <SnippetDisplay
                    snippet={selectedSnippet}
                    onToggleFavorite={() => handleToggleFavorite(selectedSnippet._id)}
                    onDelete={() => handleDeleteSnippet(selectedSnippet._id)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center text-muted-foreground"
                >
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select a snippet to view</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* New Snippet Dialog */}
      <NewSnippetDialog
        open={isNewSnippetOpen}
        onOpenChange={setIsNewSnippetOpen}
        collections={collections}
        onSnippetCreated={(snippet) => {
          addSnippet(snippet);
          setSelectedSnippet(snippet);
          setIsNewSnippetOpen(false);
        }}
      />
    </div>
  );
};

// Sidebar Content Component
const SidebarContent = ({ 
  collections, 
  selectedCollection, 
  onCollectionSelect, 
  favorites, 
  onFavoritesSelect,
  onNewCollection 
}) => {
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isAddingCollection, setIsAddingCollection] = useState(false);

  const handleAddCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const response = await collectionsAPI.create({ name: newCollectionName.trim() });
      onNewCollection(response.data.data);
      setNewCollectionName('');
      setIsAddingCollection(false);
    } catch (error) {
      console.error('Failed to create collection:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Collections</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* Favorites */}
        <Button
          variant={selectedCollection === null ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={onFavoritesSelect}
        >
          <Star className="h-4 w-4 mr-2" />
          Favorites ({favorites.length})
        </Button>

        {/* Collections */}
        {collections.map((collection) => (
          <Button
            key={collection._id}
            variant={selectedCollection?._id === collection._id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => onCollectionSelect(collection)}
          >
            <Folder className="h-4 w-4 mr-2" />
            {collection.name}
          </Button>
        ))}

        {/* Add Collection */}
        {isAddingCollection ? (
          <form onSubmit={handleAddCollection} className="space-y-2">
            <Input
              placeholder="Collection name"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              autoFocus
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className="flex-1">
                Add
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setIsAddingCollection(false);
                  setNewCollectionName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setIsAddingCollection(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
