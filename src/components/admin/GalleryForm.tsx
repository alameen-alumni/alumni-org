import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { type GalleryFormProps, type GalleryItem, type GalleryFormData } from '../../types';

const GalleryForm = ({
  open,
  onOpenChange,
  editGallery,
  form,
  onFormChange,
  onSubmit,
  onImageUpload,
  selectedImageFile,
  singleUploadLoading
}: GalleryFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={e => e.preventDefault()} onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{editGallery ? 'Edit Image' : 'Add Image'}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="title" className="block text-xs font-medium mb-2">Title *</label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={onFormChange}
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
              onChange={onFormChange}
              placeholder="Enter image description"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-xs font-medium mb-2">Category</label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
              placeholder="Enter serial number (optional)"
              min="1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Gallery Image</label>
            <ImageUpload
              onImageUpload={onImageUpload}
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
  );
};

export default GalleryForm; 