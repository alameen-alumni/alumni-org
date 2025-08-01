import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Megaphone, FileText, Calendar, MapPin, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import { uploadToCloudinary, clearImagePreviews } from '../../lib/cloudinary';

const emptyModal = {
  title: '',
  description: '',
  date: '',
  venue: '',
  image: '',
  reg_url: '',
  visible: false,
};

const ModalAdmin = () => {
  const [modals, setModals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [form, setForm] = useState(emptyModal);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const fetchModals = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'modal'));
      const modalsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setModals(modalsData);
    } catch (error) {
      console.error('Error fetching modals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModals();
  }, []);

  const handleOpenAdd = () => {
    setEditModal(null);
    setForm(emptyModal);
    setOpenDialog(true);
  };

  const handleOpenEdit = (modal) => {
    setEditModal(modal);
    setForm({
      title: modal.title || '',
      description: modal.description || '',
      date: modal.date || '',
      venue: modal.venue || '',
      image: modal.image || '',
      reg_url: modal.reg_url || '',
      visible: modal.visible || false,
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = form.image;
      
      // Upload image to Cloudinary if a new file was selected
      if (selectedImageFile) {
        try {
          console.log('Starting image upload...');
          imageUrl = await uploadToCloudinary(selectedImageFile);
          console.log('Image upload successful:', imageUrl);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          alert(`Image upload failed: ${uploadError.message}. Please check your Cloudinary configuration.`);
          return;
        }
      }
      
      const modalData = {
        ...form,
        image: imageUrl
      };
      
      // If setting visible, set all others to false first
      if (form.visible) {
        const updates = modals.filter(m => m.visible).map(m => updateDoc(doc(db, 'modal', m.id), { visible: false }));
        await Promise.all(updates);
      }
      
      if (editModal) {
        await updateDoc(doc(db, 'modal', editModal.id), modalData);
        // Update only the specific modal in state
        setModals(prev => prev.map(item => 
          item.id === editModal.id 
            ? { ...item, ...modalData }
            : item
        ));
      } else {
        const docRef = await addDoc(collection(db, 'modal'), modalData);
        // Add new modal to state
        setModals(prev => [...prev, { id: docRef.id, ...modalData }]);
      }
      
      // Clear image preview from localStorage
      clearImagePreviews(['modalImage']);
      
      // Clear localStorage cache to force homepage refetch
      localStorage.removeItem('modalData');
      localStorage.removeItem('modalTimestamp');
      
      setOpenDialog(false);
      setSelectedImageFile(null);
    } catch (err) {
      console.error('Error saving modal:', err);
      alert(`Failed to save modal: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'modal', id));
      // Clear localStorage cache to force homepage refetch
      localStorage.removeItem('modalData');
      localStorage.removeItem('modalTimestamp');
      setDeleteId(null);
      // Remove only the specific modal from state
      setModals(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete modal');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className="text-xl font-bold mb-4">Manage Modals</h3>
        <Button onClick={handleOpenAdd} className="mb-4">Add Modal</Button>
      </div>
      {loading ? (
        <p>Loading modals...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Registration Link</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modals
              .sort((a, b) => {
                // Sort visible modals first, then by title
                if (a.visible && !b.visible) return -1;
                if (!a.visible && b.visible) return 1;
                return a.title.localeCompare(b.title);
              })
              .map(modal => (
                <TableRow key={modal.id} className={modal.visible ? 'bg-blue-50' : ''}>
                  <TableCell>
                    {modal.image && (
                      <img src={modal.image} alt={modal.title} className="w-16 h-16 object-cover rounded" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {modal.visible && <Megaphone className="w-4 h-4 text-blue-500" />}
                      {modal.title}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{modal.description}</TableCell>
                  <TableCell>{modal.date || 'N/A'}</TableCell>
                  <TableCell>{modal.venue || 'N/A'}</TableCell>
                  <TableCell className="max-w-xs truncate">{modal.reg_url || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      modal.visible 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {modal.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenEdit(modal)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => setDeleteId(modal.id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent 
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => {
            // Allow file input interactions
            if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
          }} 
          onInteractOutside={(e) => {
            // Allow file input interactions
            if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
              return;
            }
            e.preventDefault();
            e.stopPropagation();
          }}
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>{editModal ? 'Edit Modal' : 'Add Modal'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-xs font-medium mb-2">Modal Title *</label>
              <Input 
                id="title"
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Enter modal title" 
                required 
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-xs font-medium mb-2">Description *</label>
              <Input 
                id="description"
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Enter modal description" 
                required 
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-xs font-medium mb-2">Date</label>
              <Input 
                id="date"
                name="date" 
                value={form.date} 
                onChange={handleChange} 
                placeholder="Enter date (e.g., 2024-01-15)" 
              />
            </div>
            <div>
              <label htmlFor="venue" className="block text-xs font-medium mb-2">Venue</label>
              <Input 
                id="venue"
                name="venue" 
                value={form.venue} 
                onChange={handleChange} 
                placeholder="Enter venue" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Modal Image</label>
              <ImageUpload
                onImageUpload={(url, file) => {
                  setForm({ ...form, image: url });
                  setSelectedImageFile(file || null);
                }}
                currentImage={form.image}
                fieldName="modalImage"
              />
            </div>
            <div>
              <label htmlFor="reg_url" className="block text-xs font-medium mb-2">Registration Link</label>
              <Input 
                id="reg_url"
                name="reg_url" 
                value={form.reg_url} 
                onChange={handleChange} 
                placeholder="Enter registration URL" 
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="visible" checked={form.visible} onChange={handleChange} id="visible" />
              <label htmlFor="visible" className="text-xs">Visible (Show on Homepage)</label>
            </div>
            <DialogFooter>
              <Button type="submit">{editModal ? 'Update' : 'Add'}</Button>
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
            <DialogTitle>Delete Modal</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this modal?</p>
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

export default ModalAdmin; 