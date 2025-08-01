import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ImageUpload from '../../components/ImageUpload';
import { uploadToCloudinary, clearImagePreviews } from '../../lib/cloudinary';

const emptyAlumni = {
  name: '',
  designation: '',
  category: '',
  contact: '',
  location: '',
  passout_year: '',
  featured: false,
  image: '',
};

const AlumniAdmin = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editAlumni, setEditAlumni] = useState(null);
  const [form, setForm] = useState(emptyAlumni);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'alumni_community'));
      const membersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleOpenAdd = () => {
    setEditAlumni(null);
    setForm(emptyAlumni);
    setOpenDialog(true);
  };

  const handleOpenEdit = (alumni) => {
    setEditAlumni(alumni);
    setForm({
      name: alumni.name || '',
      designation: alumni.designation || '',
      category: alumni.category || '',
      contact: alumni.contact || '',
      location: alumni.location || '',
      passout_year: alumni.passout_year || '',
      featured: alumni.featured || false,
      image: alumni.image || '',
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
        imageUrl = await uploadToCloudinary(selectedImageFile);
      }
      
      const alumniData = {
        ...form,
        image: imageUrl
      };
      
      if (editAlumni) {
        await updateDoc(doc(db, 'alumni_community', editAlumni.id), alumniData);
        // Update only the specific alumni in state
        setMembers(prev => prev.map(item => 
          item.id === editAlumni.id 
            ? { ...item, ...alumniData }
            : item
        ));
      } else {
        const docRef = await addDoc(collection(db, 'alumni_community'), alumniData);
        // Add new alumni to state
        setMembers(prev => [...prev, { id: docRef.id, ...alumniData }]);
      }
      
      // Clear image preview from localStorage
      clearImagePreviews(['alumniImage']);
      
      setOpenDialog(false);
      setSelectedImageFile(null);
    } catch (err) {
      console.error('Error saving alumni:', err);
      alert('Failed to save alumni');
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'alumni_community', id));
      setDeleteId(null);
      // Remove only the specific alumni from state
      setMembers(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting alumni:', err);
      alert('Failed to delete alumni');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between items-center'><h3 className="text-xl font-bold mb-4">Alumni Community Section</h3>
      <Button onClick={handleOpenAdd} className="mb-4">Add Alumni</Button></div>
      
      {loading ? (
        <p>Loading alumni...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Passout Year</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(member => (
              <TableRow key={member.id}>
                <TableCell>
                  {member.image && (
                    <img src={member.image} alt={member.name} className="w-16 h-16 object-cover rounded" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>{member.designation}</TableCell>
                <TableCell>{member.category}</TableCell>
                <TableCell>{member.contact}</TableCell>
                <TableCell>{member.location}</TableCell>
                <TableCell>{member.passout_year}</TableCell>
                <TableCell>{member.featured ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleOpenEdit(member)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteId(member.id)}>Delete</Button>
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
            <DialogTitle>{editAlumni ? 'Edit Alumni' : 'Add Alumni'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-medium mb-2">Name *</label>
              <Input 
                id="name"
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                placeholder="Enter alumni name" 
                required 
              />
            </div>
            <div>
              <label htmlFor="designation" className="block text-xs font-medium mb-2">Designation</label>
              <Input 
                id="designation"
                name="designation" 
                value={form.designation} 
                onChange={handleChange} 
                placeholder="Enter designation" 
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-medium mb-2">Category</label>
              <Input 
                id="category"
                name="category" 
                value={form.category} 
                onChange={handleChange} 
                placeholder="Enter category" 
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-xs font-medium mb-2">Contact</label>
              <Input 
                id="contact"
                name="contact" 
                value={form.contact} 
                onChange={handleChange} 
                placeholder="Enter contact information" 
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-xs font-medium mb-2">Location</label>
              <Input 
                id="location"
                name="location" 
                value={form.location} 
                onChange={handleChange} 
                placeholder="Enter location" 
              />
            </div>
            <div>
              <label htmlFor="passout_year" className="block text-xs font-medium mb-2">Passout Year</label>
              <Input 
                id="passout_year"
                name="passout_year" 
                value={form.passout_year} 
                onChange={handleChange} 
                placeholder="Enter passout year" 
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featured" />
              <label htmlFor="featured" className="text-xs">Featured Alumni</label>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Profile Image</label>
              <ImageUpload
                onImageUpload={(url, file) => {
                  setForm({ ...form, image: url });
                  setSelectedImageFile(file || null);
                }}
                currentImage={form.image}
                fieldName="alumniImage"
              />
            </div>
            <DialogFooter>
              <Button type="submit">{editAlumni ? 'Update' : 'Add'}</Button>
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
            <DialogTitle>Delete Alumni</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this alumni?</p>
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

export default AlumniAdmin; 