import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ImageUpload from '../../components/ImageUpload';
import { uploadToCloudinary, clearImagePreviews, deleteFromCloudinary } from '../../lib/cloudinary';
import { Loader2, X } from 'lucide-react';
import { GalleryItem, GalleryFormData, emptyGalleryItem } from '../../types/gallery';
import { useGallery } from '../../hooks/use-gallery';

const emptyGallery = emptyGalleryItem;

const GalleryAdmin = () => {
  const { items: gallery, loading, refreshGallery } = useGallery();
  const [openDialog, setOpenDialog] = useState(false);
  const [editGallery, setEditGallery] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<GalleryFormData>(emptyGallery);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [bulkUploadFiles, setBulkUploadFiles] = useState<File[]>([]);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [bulkUploadUrls, setBulkUploadUrls] = useState<string[]>([]);
  const [singleUploadLoading, setSingleUploadLoading] = useState(false);

  // Function to get the next available sl_no
  const getNextSlNo = () => {
    const maxSlNo = Math.max(0, ...gallery.map(item => {
      const slNo = typeof item.sl_no === 'string' ? parseInt(item.sl_no) : item.sl_no;
      return slNo && slNo > 0 ? slNo : 0;
    }));
    return maxSlNo + 1;
  };

  const handleOpenAdd = () => {
    setEditGallery(null);
    setForm({
      ...emptyGallery,
      sl_no: getNextSlNo() // Auto-set the next sl_no as number
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (item) => {
    setEditGallery(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      date: item.date || '',
      category: item.category || '',
      image: item.image || '',
      sl_no: item.sl_no && item.sl_no > 0 ? item.sl_no : '',
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if image is selected for new uploads
    if (!editGallery && !selectedImageFile && !form.image) {
      alert('Please select an image to upload');
      return;
    }
    
    setSingleUploadLoading(true);
    try {
      let imageUrl = form.image;
      if (selectedImageFile) {
        imageUrl = await uploadToCloudinary(selectedImageFile);
      }
      // Convert empty string sl_no to undefined for storage
      const galleryData = { 
        ...form, 
        image: imageUrl,
        sl_no: form.sl_no === '' ? undefined : form.sl_no
      };
      if (editGallery) {
        await updateDoc(doc(db, 'gallery', editGallery.id), galleryData);
      } else {
        await addDoc(collection(db, 'gallery'), galleryData);
      }
      await refreshGallery();
      clearImagePreviews(['galleryImage']);
      setOpenDialog(false);
      setSelectedImageFile(null);
    } catch (err) {
      console.error('Error saving gallery:', err);
      alert('Failed to save gallery');
    } finally {
      setSingleUploadLoading(false);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (bulkUploadFiles.length === 0) {
      alert('Please select at least one image');
      return;
    }

    setBulkUploadLoading(true);
    setBulkUploadProgress(0);

    try {
      const totalFiles = bulkUploadFiles.length;
      let uploadedCount = 0;

      for (let i = 0; i < bulkUploadFiles.length; i++) {
        const file = bulkUploadFiles[i];
        // Upload to Cloudinary first
        const cloudinaryUrl = await uploadToCloudinary(file);
        
        // Save to Firestore with Cloudinary URL
        const galleryData = {
          title: form.title,
          description: form.description,
          date: form.date,
          category: form.category,
          sl_no: getNextSlNo() + i, // Auto-increment sl_no for each image
          image: cloudinaryUrl,
        };

        await addDoc(collection(db, 'gallery'), galleryData);
        
        uploadedCount++;
        setBulkUploadProgress((uploadedCount / totalFiles) * 100);
      }

      setBulkUploadFiles([]);
      setOpenBulkDialog(false);
      await refreshGallery();
      alert(`Successfully uploaded and saved ${uploadedCount} images to gallery`);
    } catch (err) {
      console.error('Error in bulk upload:', err);
      alert('Failed to upload images to gallery');
    } finally {
      setBulkUploadLoading(false);
      setBulkUploadProgress(0);
    }
  };

  const handleBulkImageUpload = (urls: string[], files?: File[]) => {
    if (files && files.length > 0) {
      // Handle files from ImageUpload (no URLs yet)
      setBulkUploadFiles(files);
    }
  };

  const removeBulkImage = (index: number) => {
    setBulkUploadUrls(prev => prev.filter((_, i) => i !== index));
    setBulkUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      // Get the gallery item data to extract image URL
      const galleryItemToDelete = gallery.find(item => item.id === id);
      
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'gallery', id));
      
      // Delete image from Cloudinary if it exists
      if (galleryItemToDelete && galleryItemToDelete.image) {
        try {
          await deleteFromCloudinary(galleryItemToDelete.image);
          console.log('Image deleted from Cloudinary');
        } catch (cloudinaryError) {
          console.warn('Failed to delete image from Cloudinary:', cloudinaryError);
        }
      }
      
      setDeleteId(null);
      // Refresh gallery data
      await refreshGallery();
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
        <div className="flex gap-2">
          <Button onClick={() => {
          setForm({
            ...emptyGallery,
            sl_no: getNextSlNo() // Auto-set the starting sl_no
          });
          setOpenBulkDialog(true);
        }} className="mb-4">Bulk Upload</Button>
          <Button onClick={handleOpenAdd} className="mb-4">Add Image</Button>
        </div>
      </div>
              {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <p>Loading gallery images...</p>
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SL No</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gallery.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  {(() => {
                    const slNo = typeof item.sl_no === 'string' ? parseInt(item.sl_no) : item.sl_no;
                    return slNo && slNo > 0 ? slNo : 'N/A';
                  })()}
                </TableCell>
                <TableCell>
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category || 'N/A'}</TableCell>
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
              <label htmlFor="category" className="block text-xs font-medium mb-2">Category</label>
              <Input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter category (e.g., Charity, Event, etc.)"
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
              <label htmlFor="sl_no" className="block text-xs font-medium mb-2">Serial Number</label>
              <Input
                id="sl_no"
                name="sl_no"
                type="number"
                value={form.sl_no === '' ? '' : form.sl_no}
                onChange={handleChange}
                placeholder="Enter serial number (optional)"
                min="1"
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
              <Button 
                type="submit" 
                disabled={singleUploadLoading || (!editGallery && !selectedImageFile && !form.image)}
              >
                {singleUploadLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {editGallery ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editGallery ? 'Update' : 'Add'
                )}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={singleUploadLoading}>Cancel</Button>
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
      
      {/* Bulk Upload Dialog */}
      <Dialog open={openBulkDialog} onOpenChange={setOpenBulkDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Upload Images</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleBulkUpload}>
            <div>
              <label htmlFor="bulk-title" className="block text-xs font-medium mb-2">Title *</label>
              <Input
                id="bulk-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter title for all images"
                required
              />
            </div>
            <div>
              <label htmlFor="bulk-category" className="block text-xs font-medium mb-2">Category *</label>
              <Input
                id="bulk-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter category for all images"
                required
              />
            </div>
            <div>
              <label htmlFor="bulk-description" className="block text-xs font-medium mb-2">Description</label>
              <Input
                id="bulk-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description for all images"
              />
            </div>
            <div>
              <label htmlFor="bulk-date" className="block text-xs font-medium mb-2">Date</label>
              <Input
                id="bulk-date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                placeholder="Select date for all images"
              />
            </div>
            <div>
              <label htmlFor="bulk-sl_no" className="block text-xs font-medium mb-2">Starting Serial Number (Auto-set)</label>
              <Input
                id="bulk-sl_no"
                name="sl_no"
                type="number"
                value={form.sl_no === '' ? '' : form.sl_no}
                onChange={handleChange}
                placeholder="Starting serial number (auto-incremented for each image)"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Each image will get an incrementing serial number starting from {form.sl_no || getNextSlNo()}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">
                Upload Images (Max 10MB each) *
              </label>
              
              {/* Single ImageUpload with multiple selection */}
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <ImageUpload
                    onImageUpload={() => {}} // Required prop for single image mode
                    onMultipleImageUpload={handleBulkImageUpload}
                    currentImage=""
                    fieldName="bulkUpload"
                    multiple={true}
                  />
                </div>
                

              </div>
              
              {bulkUploadUrls.length > 0 && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    {bulkUploadUrls.filter(url => url).length} image(s) ready for upload
                  </p>
                </div>
              )}
            </div>
            
            {bulkUploadLoading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(bulkUploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${bulkUploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={bulkUploadLoading || bulkUploadFiles.length === 0}
              >
                {bulkUploadLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading to Cloudinary...
                  </>
                ) : (
                  bulkUploadFiles.length === 0 
                    ? 'Select Images to Upload' 
                    : `Upload ${bulkUploadFiles.length} Image${bulkUploadFiles.length !== 1 ? 's' : ''} to Cloudinary`
                )}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={bulkUploadLoading}>Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryAdmin; 