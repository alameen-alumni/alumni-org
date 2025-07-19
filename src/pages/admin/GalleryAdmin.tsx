import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ImageUpload from '../../components/ImageUpload';
import { uploadToCloudinary, clearImagePreviews } from '../../lib/cloudinary';

const emptyGallery = {
  title: '',
  description: '',
  date: '',
  image: '',
};

const GalleryAdmin = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editGallery, setEditGallery] = useState(null);
  const [form, setForm] = useState(emptyGallery);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'gallery'));
      const galleryData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGallery(galleryData);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditGallery(null);
    setForm(emptyGallery);
    setOpenDialog(true);
  };

  const handleOpenEdit = (item) => {
    setEditGallery(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      date: item.date || '',
      image: item.image || '',
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
      if (selectedImageFile) {
        imageUrl = await uploadToCloudinary(selectedImageFile);
      }
      const galleryData = { ...form, image: imageUrl };
      if (editGallery) {
        await updateDoc(doc(db, 'gallery', editGallery.id), galleryData);
      } else {
        await addDoc(collection(db, 'gallery'), galleryData);
      }
      clearImagePreviews(['galleryImage']);
      setOpenDialog(false);
      setSelectedImageFile(null);
      fetchGallery();
    } catch (err) {
      console.error('Error saving gallery image:', err);
      alert('Failed to save gallery image');
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setDeleteId(null);
      fetchGallery();
    } catch (err) {
      alert('Failed to delete gallery image');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h3 className="text-xl font-bold mb-4">Manage Gallery Images</h3>
        <Button onClick={handleOpenAdd} className="mb-4">Add Image</Button>
      </div>
      {loading ? (
        <p>Loading gallery images...</p>
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
            {gallery.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                <TableCell>{item.date || 'N/A'}</TableCell>
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
      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>{editGallery ? 'Edit Image' : 'Add Image'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-xs font-medium mb-2">Title *</label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter image title"
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
                placeholder="Enter image description"
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
              <label className="block text-xs font-medium mb-2">Gallery Image</label>
              <ImageUpload
                onImageUpload={(url, file) => {
                  setForm({ ...form, image: url });
                  setSelectedImageFile(file || null);
                }}
                currentImage={form.image}
                fieldName="galleryImage"
              />
            </div>
            <DialogFooter>
              <Button type="submit">{editGallery ? 'Update' : 'Add'}</Button>
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
            <DialogTitle>Delete Image</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this image?</p>
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

export default GalleryAdmin; 