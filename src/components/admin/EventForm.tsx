import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ImageUpload from '../ImageUpload';
import { type EventFormProps, type Event, type EventFormData } from '../../types';

const EventForm = ({
  open,
  onOpenChange,
  editEvent,
  form,
  onFormChange,
  onSubmit,
  onImageUpload
}: EventFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{editEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-medium mb-2">Event Title *</label>
            <Input 
              id="title" 
              name="title" 
              value={form.title} 
              onChange={onFormChange} 
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
              onChange={onFormChange} 
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
              onChange={onFormChange} 
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
              onChange={onFormChange} 
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
              onChange={onFormChange} 
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
              onChange={onFormChange} 
              placeholder="Enter event category (e.g., Meet, Conference, etc.)" 
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Event Image 1</label>
            <ImageUpload
              onImageUpload={(url, file) => onImageUpload('image1', url, file)}
              currentImage={form.image1}
              fieldName="eventImage1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Event Image 2</label>
            <ImageUpload
              onImageUpload={(url, file) => onImageUpload('image2', url, file)}
              currentImage={form.image2}
              fieldName="eventImage2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2">Event Image 3</label>
            <ImageUpload
              onImageUpload={(url, file) => onImageUpload('image3', url, file)}
              currentImage={form.image3}
              fieldName="eventImage3"
            />
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
  );
};

export default EventForm; 