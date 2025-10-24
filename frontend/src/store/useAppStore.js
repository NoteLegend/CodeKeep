import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      token: null,
      isAuthenticated: false,

      // Collections state
      collections: [],
      selectedCollection: null,

      // Snippets state
      snippets: [],
      selectedSnippet: null,
      filteredSnippets: [],

      // UI state
      sidebarOpen: true,
      loading: false,
      error: null,

      // User actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        collections: [],
        snippets: [],
        selectedSnippet: null,
        selectedCollection: null
      }),

      // Collections actions
      setCollections: (collections) => set({ collections }),
      addCollection: (collection) => set((state) => ({ 
        collections: [...state.collections, collection] 
      })),
      updateCollection: (id, updates) => set((state) => ({
        collections: state.collections.map(collection => 
          collection._id === id ? { ...collection, ...updates } : collection
        )
      })),
      deleteCollection: (id) => set((state) => ({
        collections: state.collections.filter(collection => collection._id !== id),
        selectedCollection: state.selectedCollection?._id === id ? null : state.selectedCollection
      })),
      setSelectedCollection: (collection) => set({ selectedCollection: collection }),

      // Snippets actions
      setSnippets: (snippets) => set({ snippets }),
      addSnippet: (snippet) => set((state) => ({ 
        snippets: [snippet, ...state.snippets] 
      })),
      updateSnippet: (id, updates) => set((state) => ({
        snippets: state.snippets.map(snippet => 
          snippet._id === id ? { ...snippet, ...updates } : snippet
        ),
        selectedSnippet: state.selectedSnippet?._id === id 
          ? { ...state.selectedSnippet, ...updates } 
          : state.selectedSnippet
      })),
      deleteSnippet: (id) => set((state) => ({
        snippets: state.snippets.filter(snippet => snippet._id !== id),
        selectedSnippet: state.selectedSnippet?._id === id ? null : state.selectedSnippet
      })),
      setSelectedSnippet: (snippet) => set({ selectedSnippet: snippet }),
      toggleFavorite: (id) => set((state) => {
        const updatedSnippets = state.snippets.map(snippet => 
          snippet._id === id ? { ...snippet, isFavorite: !snippet.isFavorite } : snippet
        );
        return {
          snippets: updatedSnippets,
          selectedSnippet: state.selectedSnippet?._id === id 
            ? { ...state.selectedSnippet, isFavorite: !state.selectedSnippet.isFavorite }
            : state.selectedSnippet
        };
      }),

      // Filter actions
      filterSnippets: (filters = {}) => {
        const { snippets, selectedCollection } = get();
        let filtered = [...snippets];

        if (selectedCollection) {
          filtered = filtered.filter(snippet => snippet.collection._id === selectedCollection._id);
        }

        if (filters.isFavorite) {
          filtered = filtered.filter(snippet => snippet.isFavorite);
        }

        if (filters.tag) {
          filtered = filtered.filter(snippet => 
            snippet.tags.some(tag => tag.toLowerCase().includes(filters.tag.toLowerCase()))
          );
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filtered = filtered.filter(snippet => 
            snippet.title.toLowerCase().includes(searchTerm) ||
            snippet.language.toLowerCase().includes(searchTerm) ||
            snippet.code.toLowerCase().includes(searchTerm)
          );
        }

        set({ filteredSnippets: filtered });
      },

      // UI actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Get favorites
      getFavorites: () => {
        const { snippets } = get();
        return snippets.filter(snippet => snippet.isFavorite);
      },

      // Get all tags
      getAllTags: () => {
        const { snippets } = get();
        const allTags = snippets.flatMap(snippet => snippet.tags);
        return [...new Set(allTags)];
      }
    }),
    {
      name: 'codekeep-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAppStore;
