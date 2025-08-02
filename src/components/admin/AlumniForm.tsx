import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ImageUpload from '../ImageUpload';
import { type AlumniFormProps, type Alumni, type AlumniFormData } from '../../types';

const AlumniForm = ({
  open,
  onOpenChange,
  editAlumni,
  form,
  onFormChange,
  onSubmit,
  onImageUpload
}: AlumniFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{editAlumni ? 'Edit Alumni' : 'Add Alumni'}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="name" className="block text-xs font-medium mb-2">Name *</label>
            <Input 
              id="name"
              name="name" 
              value={form.name} 
              onChange={onFormChange} 
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
              onChange={onFormChange} 
              placeholder="Enter designation" 
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-xs font-medium mb-2">Category</label>
            <Input 
              id="category"
              name="category" 
              value={form.category} 
              onChange={onFormChange} 
              placeholder="Enter category" 
            />
          </div>
          <div>
            <label htmlFor="contact" className="block text-xs font-medium mb-2">Contact</label>
            <Input 
              id="contact"
              name="contact" 
              value={form.contact} 
              onChange={onFormChange} 
              placeholder="Enter contact information" 
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-xs font-medium mb-2">Location</label>
            <Input 
              id="location"
              name="location" 
              value={form.location} 
              onChange={onFormChange} 
              placeholder="Enter location" 
            />
          </div>
          <div>
            <label htmlFor="passout_year" className="block text-xs font-medium mb-2">Passout Year</label>
            <Input 
              id="passout_year"
              name="passout_year" 
              value={form.passout_year} 
              onChange={onFormChange} 
              placeholder="Enter passout year" 
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={onFormChange} id="featured" />
            <label htmlFor="featured" className="text-xs">Featured Alumni</label>
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Profile Image</label>
            <ImageUpload
              onImageUpload={onImageUpload}
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
  );
};

export default AlumniForm; 