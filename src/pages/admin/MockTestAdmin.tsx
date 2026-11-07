import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  limit,
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { ChevronDown, ChevronRight, Download, X, Search, Loader2, ChevronDown as ChevronDownIcon } from "lucide-react";
import { useDebouncedValue } from "../../hooks/use-debounced-value";
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 12;

const emptyMockTest = {
  name: "",
  email: "",
  mobile: "",
  is_alumni: "",
  reg_id: "",
  father_name: "",
  address: "",
  preparing_for: "",
};

const MockTestAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRegistration, setEditRegistration] = useState(null);
  const [form, setForm] = useState(emptyMockTest);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [updatingId, setUpdatingId] = useState(null);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  // Pagination state
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Use debounced search term
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  // Search function - searches entire collection
  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setFilteredRegistrations(registrations);
      return;
    }

    setSearchLoading(true);
    try {
      const searchQuery = query(
        collection(db, "mocktest"),
        orderBy('mock_reg_no_numeric', 'desc')
      );

      const searchSnapshot = await getDocs(searchQuery);
      const results = [];

      searchSnapshot.forEach((doc) => {
        const data = doc.data();
        const name = data.name || '';
        const mockRegNo = data.mock_reg_no || '';
        const email = data.email || '';

        // Check if search term matches name, mock_reg_no, or email
        if (name.toLowerCase().includes(term.toLowerCase()) ||
            mockRegNo.toLowerCase().includes(term.toLowerCase()) ||
            email.toLowerCase().includes(term.toLowerCase())) {
          results.push({
            id: doc.id,
            ...data
          });
        }
      });

      // Sort by mock_reg_no_numeric descending
      const sortedResults = results.sort((a: DocumentData, b: DocumentData) => {
        const aMockRegNo = typeof a.mock_reg_no_numeric === 'number' ? a.mock_reg_no_numeric : 0;
        const bMockRegNo = typeof b.mock_reg_no_numeric === 'number' ? b.mock_reg_no_numeric : 0;
        return bMockRegNo - aMockRegNo;
      });

      setSearchResults(sortedResults);
      setFilteredRegistrations(sortedResults);

    } catch (error) {
      console.error("Error searching registrations:", error);
      setSearchResults([]);
      setFilteredRegistrations([]);
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
    setFilteredRegistrations(registrations);
  };

  // Determine if we're in search mode
  const isSearchMode = searchTerm.trim().length > 0;

  const fetchRegistrations = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let mockTestQuery = query(
        collection(db, "mocktest"),
        orderBy("mock_reg_no_numeric", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      if (isLoadMore && lastDoc) {
        mockTestQuery = query(
          collection(db, "mocktest"),
          orderBy("mock_reg_no_numeric", "desc"),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(mockTestQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isLoadMore) {
        setRegistrations(prev => [...prev, ...data]);
        if (!searchTerm) {
          setFilteredRegistrations(prev => [...prev, ...data]);
        }
      } else {
        setRegistrations(data);
        setFilteredRegistrations(data);
      }

      // Update pagination state
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastDoc(lastVisible);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);

    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = async () => {
    if (hasMore && !loadingMore && !searchTerm) {
      await fetchRegistrations(true);
    }
  };

  // Function to count total registrations
  const countTotalRegistrations = async () => {
    try {
      const countQuery = query(collection(db, "mocktest"));
      const countSnapshot = await getDocs(countQuery);
      setTotalRegistrations(countSnapshot.size);
    } catch (error) {
      console.error("Error counting registrations:", error);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    countTotalRegistrations();
  }, []);

  const handleOpenEdit = (item) => {
    setEditRegistration(item);
    setForm({
      name: item.name || "",
      email: item.email || "",
      mobile: item.mobile || "",
      is_alumni: item.is_alumni || "",
      reg_id: item.reg_id || "",
      father_name: item.father_name || "",
      address: item.address || "",
      preparing_for: item.preparing_for || "",
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUpdatingId(editRegistration.id);
    try {
      await updateDoc(doc(db, "mocktest", editRegistration.id), form);

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === editRegistration.id ? { ...reg, ...form } : reg
        )
      );

      setOpenDialog(false);
    } catch (err) {
      alert("Failed to update registration");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "mocktest", id));
      setDeleteId(null);
      setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
      alert("Registration deleted successfully!");
    } catch (err) {
      alert("Failed to delete registration: " + (err?.message || err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleRowExpansion = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Export to Excel
  const handleExportToExcel = async () => {
    try {
      // Fetch all registrations for export
      const allQuery = query(
        collection(db, "mocktest"),
        orderBy("mock_reg_no_numeric", "desc")
      );
      const allSnapshot = await getDocs(allQuery);
      const allData = allSnapshot.docs.map((doc) => doc.data());

      // Prepare data for Excel
      const excelData = allData.map((item, index) => ({
        'S.No': index + 1,
        'Mock Test Reg No': item.mock_reg_no || '-',
        'Name': item.name || '-',
        'Father Name': item.father_name || '-',
        'Mobile': item.mobile || '-',
        'Email': item.email || '-',
        'Alumni': item.is_alumni === 'yes' ? 'Yes' : 'No',
        'Alumni Reg ID': item.is_alumni === 'yes' ? (item.reg_id || '-') : 'N/A',
        'Address': item.address || '-',
        'Secondary Year': item.education?.secondary?.year || '-',
        'Secondary %': item.education?.secondary?.percentage || '-',
        'Higher Secondary Year': item.education?.higher_secondary?.year || '-',
        'Higher Secondary %': item.education?.higher_secondary?.percentage || '-',
        'Higher Secondary Stream': item.education?.higher_secondary?.stream || '-',
        'Graduation Year': item.education?.graduation?.year || '-',
        'Graduation %': item.education?.graduation?.percentage || '-',
        'Graduation Stream': item.education?.graduation?.stream || '-',
        'Post Graduation': item.education?.post_graduation || '-',
        'B.Ed': item.education?.bed || '-',
        'Qualified Exams': item.education?.qualified_exams || '-',
        'Preparing For': item.preparing_for || '-',
        'Registration Date': formatDate(item.createdAt),
      }));

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Mock Test Registrations");

      // Generate filename with current date
      const filename = `mocktest_registrations_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export data to Excel");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Mock Test Registrations</h3>

        <div className="flex gap-2">
          {/* Search Bar */}
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name, email, or reg no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
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
          </div>

          {/* Refresh Button */}
          <Button
            onClick={() => {
              setLastDoc(null);
              setHasMore(true);
              setSearchTerm('');
              setSearchResults([]);
              fetchRegistrations();
              countTotalRegistrations();
            }}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button
            onClick={handleExportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={loading || registrations.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      {searchTerm && (
        <p className="text-sm text-gray-600 mt-1">
          Found {searchResults.length} result(s) for "{searchTerm}"
        </p>
      )}

      {loading ? (
        <p>Loading registrations...</p>
      ) : searchLoading ? (
        <p>Searching...</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mock Reg No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Alumni</TableHead>
                <TableHead>Preparing For</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((item) => (
                <>
                  <TableRow key={item.id}>
                    <TableCell className="font-bold text-teal-700">
                      {item.mock_reg_no || "-"}
                    </TableCell>
                    <TableCell className="font-medium text-xs">
                      {item.name}
                    </TableCell>
                    <TableCell>{item.mobile || "-"}</TableCell>
                    <TableCell className="text-xs">{item.email || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.is_alumni === 'yes'
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.is_alumni === 'yes' ? `Yes (${item.reg_id})` : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{item.preparing_for || "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleRowExpansion(item.id)}
                        >
                          {expandedRows.has(item.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(item)}
                          disabled={updatingId === item.id}
                        >
                          {updatingId === item.id ? "Updating..." : "Edit"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(item.id)}
                          disabled={deleteLoading && deleteId === item.id}
                        >
                          {deleteLoading && deleteId === item.id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(item.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Personal Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">
                              Personal Information
                            </h4>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {item.name || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Father's Name:</span>{" "}
                                {item.father_name || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Mobile:</span>{" "}
                                {item.mobile || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {item.email || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Address:</span>{" "}
                                {item.address || "-"}
                              </p>
                            </div>
                          </div>

                          {/* Education Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">
                              Education Details
                            </h4>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="font-medium">Secondary:</span>{" "}
                                {item.education?.secondary?.year || "-"} ({item.education?.secondary?.percentage || "-"}%)
                              </p>
                              <p>
                                <span className="font-medium">Higher Secondary:</span>{" "}
                                {item.education?.higher_secondary?.year || "-"} ({item.education?.higher_secondary?.percentage || "-"}%)
                              </p>
                              <p>
                                <span className="font-medium">Stream:</span>{" "}
                                {item.education?.higher_secondary?.stream || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Graduation:</span>{" "}
                                {item.education?.graduation?.year || "-"} ({item.education?.graduation?.percentage || "-"}%)
                              </p>
                              <p>
                                <span className="font-medium">Degree:</span>{" "}
                                {item.education?.graduation?.stream || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Post Graduation:</span>{" "}
                                {item.education?.post_graduation || "-"}
                              </p>
                              <p>
                                <span className="font-medium">B.Ed:</span>{" "}
                                {item.education?.bed || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Qualified Exams:</span>{" "}
                                {item.education?.qualified_exams || "None"}
                              </p>
                            </div>
                          </div>

                          {/* Exam Preparation */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">
                              Exam Preparation
                            </h4>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="font-medium">Preparing For:</span>{" "}
                                {item.preparing_for || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Registration Date:</span>{" "}
                                {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Load More Button */}
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
                <ChevronDownIcon className="h-4 w-4" />
                Load More
              </>
            )}
          </Button>
        </div>
      )}

      {/* Show message when no more items */}
      {!hasMore && registrations.length > 0 && !isSearchMode && (
        <div className="text-center mt-6 text-gray-500">
          <p>You've reached the end of the mock test registrations!</p>
        </div>
      )}

      {/* Total Records Info */}
      <div className="text-sm text-gray-600 text-center mt-4">
        {isSearchMode
          ? `Search results: ${searchResults.length} records`
          : `Showing ${registrations.length} of ${totalRegistrations} total records`
        }
      </div>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Mock Test Registration</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-2">
                Name *
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="father_name" className="block text-xs font-medium mb-2">
                Father's Name
              </label>
              <Input
                id="father_name"
                name="father_name"
                value={form.father_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-2">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-xs font-medium mb-2">
                Mobile
              </label>
              <Input
                id="mobile"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-xs font-medium mb-2">
                Address
              </label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="preparing_for" className="block text-xs font-medium mb-2">
                Preparing For
              </label>
              <Input
                id="preparing_for"
                name="preparing_for"
                value={form.preparing_for}
                onChange={handleChange}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={updatingId === editRegistration?.id}
              >
                {updatingId === editRegistration?.id ? "Updating..." : "Update"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Registration</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this mock test registration?</p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteId)}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MockTestAdmin;
