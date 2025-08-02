import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Search, RefreshCw, X } from 'lucide-react';

interface AlumniDbItem {
  id: string;
  name: string;
  reg_id: number;
}

const AlumniDbViewer = () => {
  const [alumniData, setAlumniData] = useState<AlumniDbItem[]>([]);
  const [filteredData, setFilteredData] = useState<AlumniDbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all alumni data from Firestore
  const fetchAlumniData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'alumni_db'));
      const data: AlumniDbItem[] = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          name: doc.data().name || '',
          reg_id: doc.data().reg_id || 0
        });
      });
      // Sort by reg_id in ascending order
      const sortedData = data.sort((a, b) => a.reg_id - b.reg_id);
      setAlumniData(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.error('Error fetching alumni data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(alumniData);
    } else {
      const filtered = alumniData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reg_id.toString().includes(searchTerm)
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, alumniData]);

  // Initial data fetch
  useEffect(() => {
    fetchAlumniData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAlumniData();
    setRefreshing(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleCopyId = (regId: number) => {
    navigator.clipboard.writeText(regId.toString());
  };

  const handleCopyName = (name: string) => {
    navigator.clipboard.writeText(name);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        <span className="ml-2 text-gray-600">Loading alumni data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alumni Database</h2>
          <p className="text-gray-600 mt-1">
            Total Records: {alumniData.length} | Showing: {filteredData.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or reg_id..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-10 w-72"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Refresh Button */}
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-900">#</TableHead>
                <TableHead className="font-semibold text-gray-900">Registration ID</TableHead>
                <TableHead className="font-semibold text-gray-900">Name</TableHead>
                <TableHead className="font-semibold text-gray-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No results found for your search.' : 'No alumni data available.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((alumni, index) => (
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
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-sm text-gray-600 text-center">
          Showing {filteredData.length} of {alumniData.length} records
        </div>
      )}
    </div>
  );
};

export default AlumniDbViewer; 