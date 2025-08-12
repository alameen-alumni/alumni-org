import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  limit,
  orderBy,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight, Eye, EyeOff, Download, X, Search, Loader2, ChevronDown as ChevronDownIcon } from "lucide-react";
import ExcelExportModal from "@/components/ExcelExportModal";
import DeleteInfoModal from "@/components/DeleteInfoModal";

const ITEMS_PER_PAGE = 12;

const emptyReunion = {
  name: "",
  reg_id: "",
  info: {
    contact: {
      email: "",
      mobile: "",
      whatsapp: "",
    },
  },
  profession: {
    working: false,
    company: "",
    position: "",
  },
  event: {
    present: "",
    paid: false,
    pay_id: "",
    payment_approved: false,
    donate: 0,
    perks: {
      to_pay: 0,
    },
    coming_with_anyone: "",
    accompany: 0,
    accompany_rel: "",
  },
};

const ReunionAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRegistration, setEditRegistration] = useState(null);
  const [form, setForm] = useState(emptyReunion);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [updatingId, setUpdatingId] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [showPaymentIdModal, setShowPaymentIdModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteInfoModal, setShowDeleteInfoModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({ uid: "", email: "" });
  
  // Pagination state
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Search function
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredRegistrations(registrations);
      return;
    }

    const filtered = registrations.filter((item: any) => {
      const searchLower = term.toLowerCase();
      const nameMatch = item.name?.toLowerCase().includes(searchLower);
      const regIdMatch = item.reg_id?.toString().includes(searchLower);
      
      return nameMatch || regIdMatch;
    });
    
    setFilteredRegistrations(filtered);
  };

  // Clear search and reset to paginated view
  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredRegistrations(registrations);
  };

  const fetchRegistrations = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let reunionQuery = query(
        collection(db, "reunion"),
        orderBy("createdAt", "desc"),
        limit(ITEMS_PER_PAGE)
      );

      if (isLoadMore && lastDoc) {
        reunionQuery = query(
          collection(db, "reunion"),
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(reunionQuery);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort by createdAt field (newest first, then by registration ID)
      const sortedData = data.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA !== dateB) {
          return dateB - dateA; // Newest first
        }
        // If same date, sort by reg_id
        return (a.reg_id || 0) - (b.reg_id || 0);
      });

      if (isLoadMore) {
        setRegistrations(prev => [...prev, ...sortedData]);
        setFilteredRegistrations(prev => [...prev, ...sortedData]);
      } else {
        setRegistrations(sortedData);
        setFilteredRegistrations(sortedData);
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
    if (hasMore && !loadingMore) {
      await fetchRegistrations(true);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleOpenEdit = (item) => {
    setEditRegistration(item);
    setForm({
      name: item.name || "",
      reg_id: item.reg_id || "",
      info: {
        contact: {
          email: item.info?.contact?.email || "",
          mobile: item.info?.contact?.mobile || "",
          whatsapp: item.info?.contact?.whatsapp || "",
        },
      },
      profession: {
        working: item.profession?.working || false,
        company: item.profession?.company || "",
        position: item.profession?.position || "",
      },
      event: {
        present: item.event?.present || "",
        paid: item.event?.paid || false,
        pay_id: item.event?.pay_id || "",
        payment_approved: item.event?.payment_approved || false,
        donate: item.event?.donate || 0,
        perks: {
          to_pay: item.event?.perks?.to_pay || 0,
        },
        coming_with_anyone: item.event?.coming_with_anyone || "",
        accompany: item.event?.accompany || 0,
        accompany_rel: item.event?.accompany_rel || "",
      },
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Convert number fields to numbers
    const processedValue = type === "number" ? (value === "" ? 0 : Number(value)) : (type === "checkbox" ? checked : value);

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: processedValue,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: processedValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate pay_id is required when payment is marked as done
    if (form.event.paid && !form.event.pay_id?.trim()) {
      alert("Payment ID is required when payment is marked as completed.");
      return;
    }

    setUpdatingId(editRegistration.id);
    try {
      const data = {
        ...form,
        reg_id: form.reg_id ? Number(form.reg_id) : "",
      };
      await updateDoc(doc(db, "reunion", editRegistration.id), data);

      // Update only the specific registration in state
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === editRegistration.id ? { ...reg, ...data } : reg
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
      // First, get the registration data to find the uid
      const registrationRef = doc(db, "reunion", id);
      const registrationSnap = await getDoc(registrationRef);
      
      if (!registrationSnap.exists()) {
        throw new Error("Registration not found");
      }
      
      const registrationData = registrationSnap.data();
      const uid = registrationData.uid;
      
      // Delete the reunion registration
      await deleteDoc(registrationRef);
      
      // If uid exists, show modal with deletion info
      if (uid) {
        const email = registrationData.info?.contact?.email || 'No email found';
        const docId = id;
        
        setDeleteInfo({ uid, email });
        setShowDeleteInfoModal(true);
      } else {
        // If no uid found, just show success message
        alert("Registration deleted successfully!");
      }
      
      setDeleteId(null);

      // Remove only the specific registration from state
      setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
    } catch (err) {
      alert("Failed to delete registration : " + (err?.message || err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleApprovePayment = async (id, approved) => {
    try {
      // Only allow approving, not unapproving from button
      if (!approved) {
        alert("To unapprove payment, please use the Edit form.");
        return;
      }

      // Check if payment is marked as done but no pay_id
      const registration = registrations.find((r) => r.id === id);
      if (registration?.event?.paid && !registration?.event?.pay_id?.trim()) {
        alert(
          "Payment ID is required when payment is marked as completed. Please add Payment ID in Edit form first."
        );
        return;
      }

      setApprovingId(id);
      await updateDoc(doc(db, "reunion", id), {
        "event.payment_approved": approved,
      });

      // Update only the specific registration in state
      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === id
            ? {
                ...reg,
                event: {
                  ...reg.event,
                  payment_approved: approved,
                },
              }
            : reg
        )
      );
    } catch (err) {
      alert(
        "Failed to update payment approval status: " + (err?.message || err)
      );
    } finally {
      setApprovingId(null);
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

  const handleExport = (options: any) => {
    // The ExcelExportModal handles the export internally
    // This function is kept for compatibility but the actual export is done in the modal
    console.log("Export options:", options);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Reunion Registrations</h3>

        <div className="flex gap-2">
          {/* Search Bar */}
          <div className="w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name or registration ID..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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
              fetchRegistrations();
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
            onClick={() => setShowExportModal(true)}
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
            Found {filteredRegistrations.length} result(s) for "{searchTerm}"
          </p>
        )}
      {loading ? (
        <p>Loading registrations...</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Reg ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Working</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.map((item, index) => (
                <>
                  <TableRow key={item.id}>
                    <TableCell className="text-center font-medium text-xs">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-xs">
                      {item.name}
                    </TableCell>
                    <TableCell>{item.reg_id}</TableCell>
                    <TableCell>{item.info?.contact?.email || "-"}</TableCell>
                    <TableCell>{item.info?.contact?.mobile || "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.profession?.working
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.profession?.working ? "Yes" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              item.event?.paid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.event?.paid ? "Paid" : "Unpaid"}
                          </span>
                          {item.event?.paid && item.event?.pay_id && (
                            <button
                              onClick={() => {
                                setSelectedPaymentId(item.event.pay_id);
                                setShowPaymentIdModal(true);
                              }}
                              className="px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                              title="View Payment ID"
                            >
                              ID
                            </button>
                          )}
                        </div>
                        {item.event?.payment_approved && (
                          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            Approved
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₹{item.event?.perks?.to_pay || 0}</TableCell>
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
                          variant={
                            item.event?.payment_approved
                              ? "secondary"
                              : "default"
                          }
                          onClick={() => handleApprovePayment(item.id, true)}
                          disabled={
                            !item.event?.paid ||
                            item.event?.payment_approved ||
                            approvingId === item.id
                          }
                        >
                          {approvingId === item.id
                            ? "Approving..."
                            : item.event?.payment_approved
                            ? "Approved"
                            : "Approve"}
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
                      <TableCell colSpan={9} className="bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Contact Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">
                              Contact Information
                            </h4>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="font-medium">Email:</span>{" "}
                                {item.info?.contact?.email || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Mobile:</span>{" "}
                                {item.info?.contact?.mobile || "-"}
                              </p>
                              <p>
                                <span className="font-medium">WhatsApp:</span>{" "}
                                {item.info?.contact?.whatsapp || "-"}
                              </p>
                            </div>
                          </div>

                          {/* Profession Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">
                              Profession
                            </h4>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="font-medium">Working:</span>{" "}
                                {item.profession?.working ? "Yes" : "No"}
                              </p>
                              {item.profession?.working && (
                                <>
                                  <p>
                                    <span className="font-medium">
                                      Company:
                                    </span>{" "}
                                    {item.profession?.company || "-"}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Position:
                                    </span>{" "}
                                    {item.profession?.position || "-"}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Event Info */}
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-700">
                              Event Details
                            </h4>
                            <div className="text-xs space-y-1">
                              <p>
                                <span className="font-medium">Present:</span>{" "}
                                {item.event?.present || "-"}
                              </p>
                              {item.event?.present === 'yes' && (
                                <>
                                  <p>
                                    <span className="font-medium">Coming with anyone:</span>{" "}
                                    {item.event?.coming_with_anyone || "-"}
                                  </p>
                                  {item.event?.coming_with_anyone === 'yes' && (
                                    <>
                                      <p>
                                        <span className="font-medium">Accompanying Persons:</span>{" "}
                                        {item.event?.accompany || 0}
                                      </p>
                                      <p>
                                        <span className="font-medium">Relationship:</span>{" "}
                                        {item.event?.accompany_rel || "-"}
                                      </p>
                                    </>
                                  )}
                                </>
                              )}
                              <p>
                                <span className="font-medium">Payment ID:</span>{" "}
                                {item.event?.pay_id || "-"}
                              </p>
                              <p>
                                <span className="font-medium">Amount:</span> ₹
                                {item.event?.perks?.to_pay || 0}
                              </p>
                              <p>
                                <span className="font-medium">Donation:</span> ₹
                                {item.event?.donate || 0}
                              </p>
                              <p>
                                <span className="font-medium">Created:</span>{" "}
                                {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>

                          {/* Education Info */}
                          {item.education && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-700">
                                Education
                              </h4>
                              <div className="text-xs space-y-1">
                                <p>
                                  <span className="font-medium">
                                    Admit Year:
                                  </span>{" "}
                                  {item.education?.admit_year || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Passout Year:
                                  </span>{" "}
                                  {item.education?.passout_year || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Current Qualification:
                                  </span>{" "}
                                  {item.education?.current_class || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Current Degree:
                                  </span>{" "}
                                  {item.education?.curr_degree || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">College:</span>{" "}
                                  {item.education?.curr_college || "-"}
                                </p>
                                {item.education?.study && (
                                  <>
                                    <p>
                                      <span className="font-medium">
                                        Year of Graduation:
                                      </span>{" "}
                                      {item.education?.year_of_grad || "-"}
                                    </p>
                                    <p>
                                      <span className="font-medium">
                                        Scholarship Needed:
                                      </span>{" "}
                                      {item.education?.scholarship ? "Yes" : "No"}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Address Info */}
                          {item.info?.address && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-700">
                                Address
                              </h4>
                              <div className="text-xs space-y-1">
                                <p>
                                  <span className="font-medium">Present:</span>{" "}
                                  {item.info?.address?.present || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Permanent:
                                  </span>{" "}
                                  {item.info?.address?.permanent || "-"}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Parent Info */}
                          {item.info?.parent && (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-700">
                                Parent Information
                              </h4>
                              <div className="text-xs space-y-1">
                                <p>
                                  <span className="font-medium">Father:</span>{" "}
                                  {item.info?.parent?.father || "-"}
                                </p>
                                <p>
                                  <span className="font-medium">Mother:</span>{" "}
                                  {item.info?.parent?.mother || "-"}
                                </p>
                              </div>
                            </div>
                          )}
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
      {hasMore && !searchTerm && (
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
      {!hasMore && registrations.length > 0 && !searchTerm && (
        <div className="text-center mt-6 text-gray-500">
          <p>You've reached the end of the reunion registrations!</p>
        </div>
      )}

      {/* Total Records Info */}
      <div className="text-sm text-gray-600 text-center mt-4">
        Total records loaded: {registrations.length}
      </div>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
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
              <label
                htmlFor="reg_id"
                className="block text-xs font-medium mb-2"
              >
                Registration ID *
              </label>
              <Input
                id="reg_id"
                name="reg_id"
                type="number"
                value={form.reg_id}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="info.contact.email"
                className="block text-xs font-medium mb-2"
              >
                Email *
              </label>
              <Input
                id="info.contact.email"
                name="info.contact.email"
                type="email"
                value={form.info.contact.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="info.contact.mobile"
                className="block text-xs font-medium mb-2"
              >
                Mobile
              </label>
              <Input
                id="info.contact.mobile"
                name="info.contact.mobile"
                value={form.info.contact.mobile}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="info.contact.whatsapp"
                className="block text-xs font-medium mb-2"
              >
                WhatsApp
              </label>
              <Input
                id="info.contact.whatsapp"
                name="info.contact.whatsapp"
                value={form.info.contact.whatsapp}
                onChange={handleChange}
              />
            </div>

            <fieldset className="border p-4 rounded">
              <legend className="text-xs font-semibold">Profession</legend>
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="profession.working"
                  name="profession.working"
                  type="checkbox"
                  checked={form.profession.working}
                  onChange={handleChange}
                />
                <label htmlFor="profession.working" className="text-xs">
                  Currently Working
                </label>
              </div>
              {form.profession.working && (
                <>
                  <div className="mb-2">
                    <label
                      htmlFor="profession.company"
                      className="block text-xs font-medium mb-1"
                    >
                      Company
                    </label>
                    <Input
                      id="profession.company"
                      name="profession.company"
                      value={form.profession.company}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="profession.position"
                      className="block text-xs font-medium mb-1"
                    >
                      Position
                    </label>
                    <Input
                      id="profession.position"
                      name="profession.position"
                      value={form.profession.position}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </fieldset>

            <fieldset className="border p-4 rounded">
              <legend className="text-xs font-semibold">Event Details</legend>
              <div className="mb-2">
                <label
                  htmlFor="event.present"
                  className="block text-xs font-medium mb-1"
                >
                  Will Attend
                </label>
                <select
                  id="event.present"
                  name="event.present"
                  value={form.event.present}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="maybe">Maybe</option>
                </select>
              </div>
              <div className="mb-2">
                <label
                  htmlFor="event.donate"
                  className="block text-xs font-medium mb-1"
                >
                  Donation Amount (₹)
                </label>
                <Input
                  id="event.donate"
                  name="event.donate"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.event.donate}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              {form.event.present === 'yes' && (
                <>
                  <div className="mb-2">
                    <label
                      htmlFor="event.coming_with_anyone"
                      className="block text-xs font-medium mb-1"
                    >
                      Coming with anyone?
                    </label>
                    <select
                      id="event.coming_with_anyone"
                      name="event.coming_with_anyone"
                      value={form.event.coming_with_anyone}
                      onChange={handleChange}
                      className="w-full border rounded p-2"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  {form.event.coming_with_anyone === 'yes' && (
                    <>
                      <div className="mb-2">
                        <label
                          htmlFor="event.accompany"
                          className="block text-xs font-medium mb-1"
                        >
                          Number of Accompanying Persons
                        </label>
                        <select
                          id="event.accompany"
                          name="event.accompany"
                          value={form.event.accompany}
                          onChange={handleChange}
                          className="w-full border rounded p-2"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                      <div className="mb-2">
                        <label
                          htmlFor="event.accompany_rel"
                          className="block text-xs font-medium mb-1"
                        >
                          Relationship
                        </label>
                        {(form.event.accompany_rel === 'Other' || (form.event.accompany_rel && !['Spouse', 'Children', 'Parents', 'Siblings', 'Friends', 'Colleagues'].includes(form.event.accompany_rel))) ? (
                          <div className="relative">
                            <Input 
                              name="event.accompany_rel" 
                              value={form.event.accompany_rel === 'Other' ? '' : (form.event.accompany_rel || '')} 
                              onChange={handleChange} 
                              placeholder="Enter your custom relationship" 
                              className="w-full border rounded p-2 pr-8"
                            />
                            <button
                              type="button"
                              onClick={() => handleChange({
                                target: {
                                  name: 'event.accompany_rel',
                                  value: ''
                                }
                              })}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                              title="Switch back to dropdown"
                            >
                              <X className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        ) : (
                          <select
                            id="event.accompany_rel"
                            name="event.accompany_rel"
                            value={form.event.accompany_rel}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                          >
                            <option value="">Select Relationship</option>
                            <option value="Spouse">Spouse</option>
                            <option value="Children">Children</option>
                            <option value="Parents">Parents</option>
                            <option value="Siblings">Siblings</option>
                            <option value="Friends">Friends</option>
                            <option value="Colleagues">Colleagues</option>
                            <option value="Other">Other</option>
                          </select>
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="event.paid"
                  name="event.paid"
                  type="checkbox"
                  checked={form.event.paid}
                  onChange={handleChange}
                />
                <label htmlFor="event.paid" className="text-xs">
                  Payment Completed
                </label>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  id="event.payment_approved"
                  name="event.payment_approved"
                  type="checkbox"
                  checked={form.event.payment_approved}
                  onChange={handleChange}
                />
                <label htmlFor="event.payment_approved" className="text-xs">
                  Payment Approved
                </label>
              </div>
              {form.event.paid && (
                <div>
                  <label
                    htmlFor="event.pay_id"
                    className="block text-xs font-medium mb-1"
                  >
                    Payment ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="event.pay_id"
                    name="event.pay_id"
                    value={form.event.pay_id}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </fieldset>

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
          <p>Are you sure you want to delete this registration?</p>
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

      {/* Payment ID Modal */}
      <Dialog open={showPaymentIdModal} onOpenChange={setShowPaymentIdModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment ID</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Payment ID:
              </p>
              <p className="text-lg font-mono bg-white p-3 rounded border break-all">
                {selectedPaymentId}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(selectedPaymentId);
                  alert("Payment ID copied to clipboard!");
                }}
                variant="outline"
                size="sm"
              >
                Copy
              </Button>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <ExcelExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        data={registrations}
        title="Export Reunion Registrations"
        onExport={handleExport}
      />

      {/* Delete Info Modal */}
      <DeleteInfoModal
        open={showDeleteInfoModal}
        onOpenChange={setShowDeleteInfoModal}
        deleteInfo={deleteInfo}
      />
    </div>
  );
};

export default ReunionAdmin;
