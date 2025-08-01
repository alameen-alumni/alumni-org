import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const DonationsAdmin = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [approveId, setApproveId] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveDetails, setApproveDetails] = useState(null);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'donations'));
      const donationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'donations', id));
      setDeleteId(null);
      // Remove only the specific donation from state
      setDonations(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete donation');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setApproveLoading(true);
    try {
      await updateDoc(doc(db, 'donations', id), { approved: true });
      setApproveId(null);
      setApproveDetails(null);
      // Update only the specific donation in state
      setDonations(prev => prev.map(item => 
        item.id === id 
          ? { ...item, approved: true }
          : item
      ));
    } catch (err) {
      alert('Failed to approve donation');
    } finally {
      setApproveLoading(false);
    }
  };

  const approvedDonations = donations.filter(d => d.approved);
  const pendingDonations = donations.filter(d => !d.approved);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className="text-xl font-bold mb-4">Donation Data</h3>
      </div>
      {loading ? (
        <p>Loading donations...</p>
      ) : (
        <>
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Pending Donations</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Screenshot</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDonations.map(donation => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      {donation.image && (
                        <img src={donation.image} alt="Screenshot" className="w-16 h-16 object-cover rounded border" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{donation.name}</TableCell>
                    <TableCell>{donation.email}</TableCell>
                    <TableCell>{donation.amount}</TableCell>
                    <TableCell className="max-w-xs truncate">{donation.msg}</TableCell>
                    <TableCell>{donation.pay_id || 'N/A'}</TableCell>
                    <TableCell>Pending</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setApproveId(donation.id); setApproveDetails(donation); }}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => setDeleteId(donation.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {approvedDonations.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-4">Approved Donations</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Screenshot</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedDonations.map(donation => (
                    <TableRow key={donation.id}>
                      <TableCell>
                        {donation.image && (
                          <img src={donation.image} alt="Screenshot" className="w-16 h-16 object-cover rounded border" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{donation.name}</TableCell>
                      <TableCell>{donation.email}</TableCell>
                      <TableCell>{donation.amount}</TableCell>
                      <TableCell className="max-w-xs truncate">{donation.msg}</TableCell>
                      <TableCell>{donation.pay_id || 'N/A'}</TableCell>
                      <TableCell>Approved</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="destructive" onClick={() => setDeleteId(donation.id)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Donation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this donation?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={() => handleDelete(deleteId)} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Approve Confirmation Dialog */}
      <Dialog open={!!approveId} onOpenChange={() => { setApproveId(null); setApproveDetails(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Donation</DialogTitle>
          </DialogHeader>
          {approveDetails && (
            <div className="mb-4 space-y-1">
              <div><b>Name:</b> {approveDetails.name}</div>
              <div><b>Email:</b> {approveDetails.email}</div>
              <div><b>Amount:</b> {approveDetails.amount}</div>
              <div><b>Message:</b> {approveDetails.msg}</div>
              {approveDetails.image && (
                <div><b>Screenshot:</b><br /><img src={approveDetails.image} alt="Screenshot" className="w-32 h-32 object-cover rounded border mt-1" /></div>
              )}
              {approveDetails.pay_id && (
                <div><b>UTR/Transaction ID:</b> {approveDetails.pay_id}</div>
              )}
              <div><b>Approved:</b> {approveDetails.approved ? 'Yes' : 'No'}</div>
              <div><b>ID:</b> {approveDetails.id}</div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => handleApprove(approveId)} disabled={approveLoading}>
              {approveLoading ? 'Approving...' : 'Approve'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationsAdmin; 