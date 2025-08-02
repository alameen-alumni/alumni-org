import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { type BulkUploadDialogProps, type GalleryFormData } from '../../types';

const BulkUploadDialog = ({
  open,
  onOpenChange,
  form,
  onFormChange,
  onSubmit,
  onBulkImageUpload,
  bulkUploadFiles,
  bulkUploadLoading,
  bulkUploadProgress,
  getNextSlNo
}: BulkUploadDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Images</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="bulk-title" className="block text-xs font-medium mb-2">Title *</label>
            <Input
              id="bulk-title"
              name="title"
              value={form.title}
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
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
              onChange={onFormChange}
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
                  onMultipleImageUpload={onBulkImageUpload}
                  currentImage=""
                  fieldName="bulkUpload"
                  multiple={true}
                />
              </div>
            </div>
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
  );
};

export default BulkUploadDialog; 