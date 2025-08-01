import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ImageUpload from '../../components/ImageUpload';
import { uploadToCloudinary, clearImagePreviews, deleteFromCloudinary } from '../../lib/cloudinary';

const emptyNotice = {
  title: '',
  description: '',
  date: '',
  btn_url: '',
  image: '',
};

const NoticesAdmin = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editNotice, setEditNotice] = useState(null);
  const [form, setForm] = useState(emptyNotice);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'notice'));
      const noticesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenAdd = () => {
    setEditNotice(null);
    setForm(emptyNotice);
    setOpenDialog(true);
  };

  const handleOpenEdit = (notice) => {
    setEditNotice(notice);
    setForm({
      title: notice.title || '',
      description: notice.description || '',
      date: notice.date || '',
      btn_url: notice.btn_url || '',
      image: notice.image || '',
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
      let imageUrl = form.image;
      
      // Upload image to Cloudinary if a new file was selected
      if (selectedImageFile) {
        imageUrl = await uploadToCloudinary(selectedImageFile);
      }
      
      const noticeData = {
        ...form,
        image: imageUrl
      };
      
      if (editNotice) {
        await updateDoc(doc(db, 'notice', editNotice.id), noticeData);
        // Update only the specific notice in state
        setNotices(prev => prev.map(item => 
          item.id === editNotice.id 
            ? { ...item, ...noticeData }
            : item
        ));
      } else {
        const docRef = await addDoc(collection(db, 'notice'), noticeData);
        // Add new notice to state
        setNotices(prev => [...prev, { id: docRef.id, ...noticeData }]);
      }
      
      // Clear image preview from localStorage
      clearImagePreviews(['noticeImage']);
      
      setOpenDialog(false);
      setSelectedImageFile(null);
    } catch (err) {
      console.error('Error saving notice:', err);
      alert('Failed to save notice');
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      // Get the notice data to extract image URL
      const noticeToDelete = notices.find(notice => notice.id === id);
      
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'notice', id));
      
      // Delete image from Cloudinary if it exists
      if (noticeToDelete && noticeToDelete.image) {
        try {
          await deleteFromCloudinary(noticeToDelete.image);
          console.log('Image deleted from Cloudinary');
        } catch (cloudinaryError) {
          console.warn('Failed to delete image from Cloudinary:', cloudinaryError);
        }
      }
      
      setDeleteId(null);
      // Remove only the specific notice from state
      setNotices(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete notice');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
        <div className='flex justify-between items-center'><h3 className="text-xl font-bold mb-4">Manage Notices</h3>
      <Button onClick={handleOpenAdd} className="mb-4">Add Notice</Button></div>
      
      {loading ? (
        <p>Loading notices...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map(notice => (
              <TableRow key={notice.id}>
                <TableCell>
                  {notice.image && (
                    <img src={notice.image} alt={notice.title} className="w-16 h-16 object-cover rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{notice.title}</TableCell>
                <TableCell className="max-w-xs truncate">{notice.description}</TableCell>
                <TableCell>{notice.date || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(notice)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteId(notice.id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{editNotice ? 'Edit Notice' : 'Add Notice'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-xs font-medium mb-2">Title *</label>
              <Input 
                id="title"
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="Enter notice title" 
                required 
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-xs font-medium mb-2">Description</label>
              <Input 
                id="description"
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Enter notice description" 
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-xs font-medium mb-2">Date</label>
              <Input 
                id="date"
                name="date" 
                type="date"
                value={form.date} 
                onChange={handleChange} 
                placeholder="Select date" 
              />
            </div>
            <div>
              <label htmlFor="btn_url" className="block text-xs font-medium mb-2">Button URL</label>
              <Input 
                id="btn_url"
                name="btn_url" 
                value={form.btn_url} 
                onChange={handleChange} 
                placeholder="Enter button URL (e.g., /reunion2k25)" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Notice Image</label>
              <ImageUpload
                onImageUpload={(url, file) => {
                  setForm({ ...form, image: url });
                  setSelectedImageFile(file || null);
                }}
                currentImage={form.image}
                fieldName="noticeImage"
              />
            </div>
            <DialogFooter>
              <Button type="submit">{editNotice ? 'Update' : 'Add'}</Button>
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
            <DialogTitle>Delete Notice</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this notice?</p>
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

export default NoticesAdmin; 