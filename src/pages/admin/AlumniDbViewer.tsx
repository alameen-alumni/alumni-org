import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, limit, orderBy, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, RefreshCw, X, ChevronDown } from 'lucide-react';
import { useDebouncedValue } from '../../hooks/use-debounced-value';

interface AlumniDbItem {
  id: string;
  name: string;
  reg_id: number;
}

const ITEMS_PER_PAGE = 12;

const AlumniDbViewer = () => {
  const [alumniData, setAlumniData] = useState<AlumniDbItem[]>([]);
  const [filteredData, setFilteredData] = useState<AlumniDbItem[]>([]);
  const [searchResults, setSearchResults] = useState<AlumniDbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Use debounced search term
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  // Search function - searches entire collection
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setFilteredData(alumniData);
      return;
    }

    setSearchLoading(true);
    try {
      // For better search results, we'll fetch all documents and filter client-side
      // This ensures we can search across the entire collection
      const searchQuery = query(
        collection(db, 'alumni_db'),
        orderBy('reg_id', 'asc')
      );
      
      const searchSnapshot = await getDocs(searchQuery);
      const results: AlumniDbItem[] = [];
      
      searchSnapshot.forEach((doc) => {
        const data = doc.data();
        const name = data.name || '';
        const regId = data.reg_id || 0;
        
        // Check if search term matches name or reg_id
        if (name.toLowerCase().includes(term.toLowerCase()) || 
            regId.toString().includes(term)) {
          results.push({
            id: doc.id,
            name: name,
            reg_id: regId
          });
        }
      });
      
      // Sort results by reg_id
      const sortedResults = results.sort((a, b) => a.reg_id - b.reg_id);
      setSearchResults(sortedResults);
      setFilteredData(sortedResults);
      
    } catch (error) {
      console.error('Error searching alumni:', error);
      setSearchResults([]);
      setFilteredData([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Effect to trigger search when debounced term changes
  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // Clear search and reset to paginated view
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setFilteredData(alumniData);
  };

  // Fetch alumni data from Firestore with pagination
  const fetchAlumniData = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let alumniQuery = query(
        collection(db, 'alumni_db'),
        orderBy('reg_id', 'asc'),
        limit(ITEMS_PER_PAGE)
      );

      if (isLoadMore && lastDoc) {
        alumniQuery = query(
          collection(db, 'alumni_db'),
          orderBy('reg_id', 'asc'),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(alumniQuery);
      const data: AlumniDbItem[] = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          name: doc.data().name || '',
          reg_id: doc.data().reg_id || 0
        });
      });

      if (isLoadMore) {
        setAlumniData(prev => [...prev, ...data]);
        // Only update filteredData if not in search mode
        if (!searchTerm) {
          setFilteredData(prev => [...prev, ...data]);
        }
      } else {
        setAlumniData(data);
        setFilteredData(data);
      }

      // Update pagination state
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);

    } catch (error) {
      console.error('Error fetching alumni data:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (hasMore && !loadingMore && !searchTerm) {
      await fetchAlumniData(true);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAlumniData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setLastDoc(null);
    setHasMore(true);
    setSearchTerm('');
    setSearchResults([]);
    await fetchAlumniData();
    setRefreshing(false);
  };

  const handleCopyId = (regId: number) => {
    navigator.clipboard.writeText(regId.toString());
  };

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name);
  };

  // Determine which data to display
  const displayData = searchTerm ? searchResults : filteredData;
  const isSearchMode = searchTerm.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alumni Database Viewer</h1>
            <p className="text-gray-600 mt-1">View and search through all registered alumni</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name or registration ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Info */}
        {searchTerm && (
          <div className="text-sm text-gray-600 text-center mt-6">
            Found {searchResults.length} result(s) for "{searchTerm}"
          </div>
        )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Registration ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-48">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading alumni data...
                    </div>
                  </TableCell>
                </TableRow>
              ) : searchLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Searching...
                    </div>
                  </TableCell>
                </TableRow>
              ) : displayData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No results found for your search.' : 'No alumni data available.'}
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((alumni, index) => (
                  <TableRow key={alumni.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-900">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-gray-700">
                      {alumni.reg_id}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {alumni.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyId(alumni.reg_id)}
                        >
                          Copy ID
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopyName(alumni.name)}
                        >
                          Copy Name
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Load More Button - Only show when not in search mode */}
        {hasMore && !isSearchMode && (
          <div className="flex justify-center mt-6">
            <Button 
              onClick={loadMore} 
              disabled={loadingMore}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Load More
                </>
              )}
            </Button>
          </div>
        )}

        {/* Show message when no more items */}
        {!hasMore && alumniData.length > 0 && !isSearchMode && (
          <div className="text-center mt-6 text-gray-500">
            <p>You've reached the end of the alumni database!</p>
          </div>
        )}

        

        {/* Total Records Info */}
        {/* <div className="text-sm text-gray-600 text-center mt-4">
          {isSearchMode 
            ? `Search results: ${searchResults.length} records`
            : `Total records loaded: ${alumniData.length}`
          }
        </div> */}
      </div>
    </div>
  );
};

export default AlumniDbViewer; 