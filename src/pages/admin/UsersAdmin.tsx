import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', passout_year: '', reg_id: '' });
  const [openDialog, setOpenDialog] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'users', id));
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleOpenEdit = (user) => {
    setEditUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      passout_year: user.passout_year || '',
      reg_id: user.reg_id || '',
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', editUser.id), form);
      setOpenDialog(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className="text-xl font-bold mb-4">Registered Users</h3>
      </div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Passout Year</TableHead>
              <TableHead>Reg ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email || "-"}</TableCell>
                <TableCell>{user.mobile || "-"}</TableCell>
                <TableCell>{user.passout_year || "-"}</TableCell>
                <TableCell>{user.reg_id || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(user)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteId(user.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this user?</p>
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
      {/* Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-2">Name *</label>
              <input 
                id="name"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter user name" 
                className="w-full border rounded p-2" 
                required 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-2">Email *</label>
              <input 
                id="email"
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="Enter email address" 
                className="w-full border rounded p-2" 
                required 
              />
            </div>
            <div>
              <label htmlFor="mobile" className="block text-xs font-medium mb-2">Mobile</label>
              <input 
                id="mobile"
                name="mobile" 
                value={form.mobile} 
                onChange={handleChange} 
                placeholder="Enter mobile number" 
                className="w-full border rounded p-2" 
              />
            </div>
            <div>
              <label htmlFor="passout_year" className="block text-xs font-medium mb-2">Passout Year</label>
              <input 
                id="passout_year"
                name="passout_year" 
                value={form.passout_year} 
                onChange={handleChange} 
                placeholder="Enter passout year" 
                className="w-full border rounded p-2" 
              />
            </div>
            <div>
              <label htmlFor="reg_id" className="block text-xs font-medium mb-2">Registration ID</label>
              <input 
                id="reg_id"
                name="reg_id" 
                value={form.reg_id} 
                onChange={handleChange} 
                placeholder="Enter registration ID" 
                className="w-full border rounded p-2" 
              />
            </div>
            <DialogFooter>
              <Button type="submit">Update</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersAdmin; 