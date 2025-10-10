import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { useImportPublicImage } from '../../hooks/use-import-public-image';
import { clearImagePreviews, deleteMultipleFromCloudinary, uploadImagesToCloudinary } from '../../lib/cloudinary';
import { db } from '../../lib/firebase';

const emptyEvent = {
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  category: '',
  image1: '',
  image2: '',
  image3: '',
};

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedImageFiles, setSelectedImageFiles] = useState<{ [key: string]: File | null }>({});

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const { validatePublicPath } = useImportPublicImage();

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenAdd = () => {
    setEditEvent(null);
    setForm(emptyEvent);
    setOpenDialog(true);
  };

  const handleOpenEdit = (event) => {
    setEditEvent(event);
    const images = Array.isArray(event.image) ? event.image : (event.image ? [event.image] : []);
    setForm({
      title: event.title || '',
      description: event.description || '',
      date: event.date || '',
      time: event.time || '',
      venue: event.venue || '',
      category: event.category || '',
      image1: images[0] || '',
      image2: images[1] || '',
      image3: images[2] || '',
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Upload selected images to Cloudinary
      const imageUrls = [...Array(3)].map((_, index) => {
        const imageKey = `image${index + 1}`;
        const selectedFile = selectedImageFiles[imageKey];
        return selectedFile ? null : form[imageKey]; // Keep existing URL if no new file
      });

      // Upload new files to Cloudinary
      const filesToUpload = Object.values(selectedImageFiles).filter(file => file !== null) as File[];
      if (filesToUpload.length > 0) {
        const uploadedUrls = await uploadImagesToCloudinary(filesToUpload);

        // Replace null values with uploaded URLs
        let urlIndex = 0;
        imageUrls.forEach((url, index) => {
          if (url === null) {
            imageUrls[index] = uploadedUrls[urlIndex];
            urlIndex++;
          }
        });
      }

      // Filter out empty URLs
      const imageArray = imageUrls.filter(url => url && url.trim().length > 0);
      const eventData = { ...form, image: imageArray };
      delete eventData.image1;
      delete eventData.image2;
      delete eventData.image3;

      if (editEvent) {
        await updateDoc(doc(db, 'events', editEvent.id), eventData);
        // Update only the specific event in state
        setEvents(prev => prev.map(item =>
          item.id === editEvent.id
            ? { ...item, ...eventData }
            : item
        ));
      } else {
        const docRef = await addDoc(collection(db, 'events'), eventData);
        // Add new event to state
        setEvents(prev => [...prev, { id: docRef.id, ...eventData }]);
      }

      // Clear image previews from localStorage
      clearImagePreviews(['eventImage1', 'eventImage2', 'eventImage3']);

      setOpenDialog(false);
      setSelectedImageFiles({});
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      // Get the event data to extract image URLs
      const eventToDelete = events.find(event => event.id === deleteId);

      // Delete the document from Firestore
      await deleteDoc(doc(db, 'events', deleteId));

      // Delete images from Cloudinary if they exist
      if (eventToDelete) {
        const imageUrls = [];
        if (Array.isArray(eventToDelete.image)) {
          imageUrls.push(...eventToDelete.image.filter(url => url));
        } else if (eventToDelete.image) {
          imageUrls.push(eventToDelete.image);
        }

        if (imageUrls.length > 0) {
          try {
            await deleteMultipleFromCloudinary(imageUrls);
            console.log('Images deleted from Cloudinary');
          } catch (cloudinaryError) {
            console.warn('Failed to delete images from Cloudinary:', cloudinaryError);
          }
        }
      }

      setDeleteId(null);
      setConfirmDelete(false);
      // Remove only the specific event from state
      setEvents(prev => prev.filter(item => item.id !== deleteId));
    } catch (err) {
      setError('Failed to delete event');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Manage Events</h3>
        <Button onClick={handleOpenAdd}>Add Event</Button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map(event => (
              <TableRow key={event.id}>
                <TableCell>
                  {Array.isArray(event.image) ? (
                    event.image[0] && <img src={event.image[0]} alt={event.title} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    event.image && <img src={event.image} alt={event.title} className="w-16 h-16 object-cover rounded" />
                  )}
                </TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(event)} className="mr-2">Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setDeleteId(event.id)}>Delete</Button>
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
            <DialogTitle>{editEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-medium mb-2">Event Title *</label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter event title"
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
                placeholder="Enter event description"
                required
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-xs font-medium mb-2">Date *</label>
              <Input
                id="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                placeholder="Enter event date (e.g., 2024-01-15)"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-xs font-medium mb-2">Time *</label>
              <Input
                id="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                placeholder="Enter event time (e.g., 2:00 PM)"
                required
              />
            </div>
            <div>
              <label htmlFor="venue" className="block text-xs font-medium mb-2">Venue *</label>
              <Input
                id="venue"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Enter event venue"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-medium mb-2">Category</label>
              <Input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter event category (e.g., Meet, Conference, etc.)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Event Image 1</label>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <ImageUpload
                    onImageUpload={(url, file) => {
                      setForm({ ...form, image1: url });
                      setSelectedImageFiles(prev => ({ ...prev, image1: file || null }));
                    }}
                    currentImage={form.image1}
                    fieldName="eventImage1"
                  />
                </div>
                <div className="pt-2">
                  <button type="button" className="px-3 py-1 border rounded bg-white hover:bg-gray-50" onClick={async () => {
                      const filename = prompt('Enter filename from public/event (e.g. 1.webp)');
                      if (!filename) return;
                      const publicPath = `/event/${filename}`;
                    const exists = await validatePublicPath(publicPath);
                    if (!exists) { alert(`File not found at ${publicPath}`); return; }
                    setForm(prev => ({ ...prev, image1: publicPath }));
                  }}>Use public/gallery</button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Event Image 2</label>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <ImageUpload
                    onImageUpload={(url, file) => {
                      setForm({ ...form, image2: url });
                      setSelectedImageFiles(prev => ({ ...prev, image2: file || null }));
                    }}
                    currentImage={form.image2}
                    fieldName="eventImage2"
                  />
                </div>
                <div className="pt-2">
                  <button type="button" className="px-3 py-1 border rounded bg-white hover:bg-gray-50" onClick={async () => {
                    const filename = prompt('Enter filename from public/event (e.g. 2.webp)');
                    if (!filename) return;
                    const publicPath = `/event/${filename}`;
                    const exists = await validatePublicPath(publicPath);
                    if (!exists) { alert(`File not found at ${publicPath}`); return; }
                    setForm(prev => ({ ...prev, image2: publicPath }));
                  }}>Use public/gallery</button>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2">Event Image 3</label>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <ImageUpload
                    onImageUpload={(url, file) => {
                      setForm({ ...form, image3: url });
                      setSelectedImageFiles(prev => ({ ...prev, image3: file || null }));
                    }}
                    currentImage={form.image3}
                    fieldName="eventImage3"
                  />
                </div>
                <div className="pt-2">
                  <button type="button" className="px-3 py-1 border rounded bg-white hover:bg-gray-50" onClick={async () => {
                    const filename = prompt('Enter filename from public/event (e.g. 3.webp)');
                    if (!filename) return;
                    const publicPath = `/event/${filename}`;
                    const exists = await validatePublicPath(publicPath);
                    if (!exists) { alert(`File not found at ${publicPath}`); return; }
                    setForm(prev => ({ ...prev, image3: publicPath }));
                  }}>Use public/gallery</button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">{editEvent ? 'Update' : 'Add'}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete AlertDialog */}
      <AlertDialog open={!!deleteId} onOpenChange={open => { if (!open) { setDeleteId(null); setConfirmDelete(false); } }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event?</AlertDialogTitle>
          </AlertDialogHeader>
          {!confirmDelete ? (
            <>
              <div>Are you sure you want to delete this event? This action cannot be undone.</div>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <Button type="button" variant="destructive" onClick={() => setConfirmDelete(true)}>
                  Confirm to Delete
                </Button>
              </AlertDialogFooter>
            </>
          ) : (
            <>
              <div className="text-red-600 font-semibold mb-2">This action is irreversible. Do you really want to delete?</div>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)}>Back</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                    {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EventsAdmin;