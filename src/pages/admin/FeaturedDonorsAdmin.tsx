import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import AddFeaturedDonorModal from '@/components/admin/AddFeaturedDonorModal';

const getLastClassLabel = (lastClass?: string): string => {
  switch (lastClass) {
    case "10":
      return "Madhyamik";
    case "12":
      return "Higher Secondary";
    default:
      return lastClass || "N/A";
  }
}

interface Donor {
  id: string;
  name: string;
  badge: string;
  amount: number;
  regId?: string; // Optional registration ID
  education?: {
    last_class?: string;
  };
}

const FeaturedDonorsAdmin = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const { toast } = useToast();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [donorToDeleteId, setDonorToDeleteId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'featured_donors'));
      const fetchedDonors: Donor[] = [];
      querySnapshot.forEach((doc) => {
        fetchedDonors.push({ id: doc.id, ...doc.data() } as Donor);
      });
      setDonors(fetchedDonors);
    } catch (error) {
      console.error("Error fetching featured donors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch featured donors.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDonorToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (donorToDeleteId) {
      try {
        await deleteDoc(doc(db, 'featured_donors', donorToDeleteId));
        toast({
          title: "Success",
          description: "Donor deleted successfully.",
        });
        fetchDonors();
      } catch (error) {
        console.error("Error deleting donor:", error);
        toast({
          title: "Error",
          description: "Failed to delete donor.",
          variant: "destructive",
        });
      } finally {
        setIsConfirmModalOpen(false);
        setDonorToDeleteId(null);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Featured Donors</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>Add New Donor</Button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Existing Featured Donors</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Last Class</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Reg ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donors.map((donor) => (
            <TableRow key={donor.id}>
              <TableCell className="font-medium">{donor.name}</TableCell>
              <TableCell>{donor.badge}</TableCell>
              <TableCell>{donor.education?.last_class ? getLastClassLabel(donor.education.last_class) : 'N/A'}</TableCell>
              <TableCell>₹{donor.amount}</TableCell>
              <TableCell>{donor.regId && donor.regId.startsWith('manual-') ? 'Manual' : donor.regId}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(donor.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this featured donor? This action cannot be undone."
      />

      <AddFeaturedDonorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onDonorAdded={fetchDonors}
      />
    </div>
  );
};

export default FeaturedDonorsAdmin;