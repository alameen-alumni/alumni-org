import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const emptyReunion = {
  name: '',
  email: '',
  passout_year: '',
  registration_id: '',
  magazine: false,
  tshirt: {
    required: false,
    size: '',
  },
};

const ReunionAdmin = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editRegistration, setEditRegistration] = useState(null);
  const [form, setForm] = useState(emptyReunion);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'reunion'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(data);
    } catch (error) {
      console.error('Error fetching reunion registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleOpenEdit = (item) => {
    setEditRegistration(item);
    setForm({
      name: item.name || '',
      email: item.email || '',
      passout_year: item.passout_year || '',
      registration_id: item.registration_id || '',
      magazine: item.magazine || false,
      tshirt: {
        required: item.tshirt?.required || false,
        size: item.tshirt?.size || '',
      },
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('tshirt.')) {
      const tshirtField = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        tshirt: {
          ...prev.tshirt,
          [tshirtField]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        passout_year: form.passout_year ? Number(form.passout_year) : '',
        registration_id: form.registration_id ? Number(form.registration_id) : '',
      };
      await updateDoc(doc(db, 'reunion', editRegistration.id), data);
      setOpenDialog(false);
      fetchRegistrations();
    } catch (err) {
      alert('Failed to update registration');
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'reunion', id));
      setDeleteId(null);
      fetchRegistrations();
    } catch (err) {
      alert('Failed to delete registration : ' + (err?.message || err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className="text-xl font-bold mb-4">Reunion Registrations</h3>
      </div>
      {loading ? (
        <p>Loading registrations...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Passout Year</TableHead>
              <TableHead>Registration ID</TableHead>
              <TableHead>Magazine</TableHead>
              <TableHead>T-Shirt</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.passout_year}</TableCell>
                <TableCell>{item.registration_id}</TableCell>
                <TableCell>{item.magazine ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.tshirt?.required ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.tshirt?.size || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(item)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteId(item.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-2">Name *</label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-2">Email *</label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="passout_year" className="block text-xs font-medium mb-2">Passout Year *</label>
              <Input id="passout_year" name="passout_year" type="number" value={form.passout_year} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="registration_id" className="block text-xs font-medium mb-2">Registration ID *</label>
              <Input id="registration_id" name="registration_id" type="number" value={form.registration_id} onChange={handleChange} required />
            </div>
            <div className="flex items-center gap-2">
              <input id="magazine" name="magazine" type="checkbox" checked={form.magazine} onChange={handleChange} />
              <label htmlFor="magazine" className="text-xs">Opt-in for Magazine</label>
            </div>
            <fieldset className="border p-4 rounded">
              <legend className="text-xs font-semibold">T-Shirt</legend>
              <div className="flex items-center gap-2 mb-2">
                <input id="tshirt.required" name="tshirt.required" type="checkbox" checked={form.tshirt.required} onChange={handleChange} />
                <label htmlFor="tshirt.required" className="text-xs">T-Shirt Required</label>
              </div>
              {form.tshirt.required && (
                <div>
                  <label className="block text-xs font-medium mb-2" htmlFor="tshirt.size">Size</label>
                  <select id="tshirt.size" name="tshirt.size" value={form.tshirt.size} onChange={handleChange} className="w-full border rounded p-2" required={form.tshirt.required}>
                    <option value="">Select Size</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>
              )}
            </fieldset>
            <DialogFooter>
              <Button type="submit">Update</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
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
            <Button variant="destructive" onClick={() => handleDelete(deleteId)} disabled={deleteLoading}>
              {deleteLoading ? 'Deleting...' : 'Delete'}
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

export default ReunionAdmin; 