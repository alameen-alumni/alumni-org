import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { uploadToCloudinary, clearImagePreviews, deleteFromCloudinary } from '../../lib/cloudinary';
import { type GalleryItem, type GalleryFormData } from '../../types';
import { useGallery } from '../../hooks/use-gallery';
import GalleryTable from '../../components/admin/GalleryTable';
import GalleryForm from '../../components/admin/GalleryForm';
import BulkUploadDialog from '../../components/admin/BulkUploadDialog';
import DeleteConfirmationDialog from '../../components/admin/DeleteConfirmationDialog';

const emptyGallery: GalleryFormData = {
  title: '',
  description: '',
  image: '',
  category: '',
  date: '',
  sl_no: ''
};

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
      sl_no: getNextSlNo().toString() // Auto-set the next sl_no as string
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
              sl_no: getNextSlNo().toString() // Auto-set the starting sl_no
            });
            setOpenBulkDialog(true);
          }} className="mb-4">Bulk Upload</Button>
          <Button onClick={handleOpenAdd} className="mb-4">Add Image</Button>
        </div>
      </div>
      
      <GalleryTable 
        gallery={gallery}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={setDeleteId}
      />
      {/* Add/Edit Dialog */}
      <GalleryForm
        open={openDialog}
        onOpenChange={setOpenDialog}
        editGallery={editGallery}
        form={form}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        onImageUpload={(url, file) => {
          setForm({ ...form, image: url });
          setSelectedImageFile(file || null);
        }}
        selectedImageFile={selectedImageFile}
        singleUploadLoading={singleUploadLoading}
      />
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        loading={deleteLoading}
      />
      
      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={openBulkDialog}
        onOpenChange={setOpenBulkDialog}
        form={form}
        onFormChange={handleChange}
        onSubmit={handleBulkUpload}
        onBulkImageUpload={handleBulkImageUpload}
        bulkUploadFiles={bulkUploadFiles}
        bulkUploadLoading={bulkUploadLoading}
        bulkUploadProgress={bulkUploadProgress}
        getNextSlNo={getNextSlNo}
      />
    </div>
  );
};

export default GalleryAdmin; 