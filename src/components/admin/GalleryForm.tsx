import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useImportPublicImage } from '../../hooks/use-import-public-image';
import { type GalleryFormProps } from '../../types';
import ImageUpload from '../ImageUpload';

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
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <ImageUpload
                  onImageUpload={onImageUpload}
                  currentImage={form.image}
                  fieldName="galleryImage"
                />
              </div>
              <div className="pt-2">
                <PublicImageButton onImageUpload={onImageUpload} />
              </div>
            </div>
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

function PublicImageButton({ onImageUpload }: { onImageUpload: (url: string, file?: File) => void }) {
  const { validatePublicPath } = useImportPublicImage();

  const handleClick = async () => {
    const filename = prompt('Enter filename from public/gallery (e.g. 1.webp or myphoto.jpg)');
    if (!filename) return;
    const publicPath = `/gallery/${filename}`;
    const exists = await validatePublicPath(publicPath);
    if (!exists) {
      alert(`File not found at ${publicPath}`);
      return;
    }
    // Call parent handler with the public path
    onImageUpload(publicPath);
  };

  return (
    <div>
      <button type="button" onClick={handleClick} className="px-3 py-1 border rounded bg-white hover:bg-gray-50">
        Use public/gallery
      </button>
    </div>
  );
}