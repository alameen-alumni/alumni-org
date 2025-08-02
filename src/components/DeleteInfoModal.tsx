import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type DeleteInfoModalProps } from '../types';

const DeleteInfoModal = ({ open, onOpenChange, deleteInfo }: DeleteInfoModalProps) => {
  const handleCopyUID = () => {
    navigator.clipboard.writeText(deleteInfo.uid);
    alert("UID copied to clipboard!");
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(deleteInfo.email);
    alert("Email copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registration Deleted Successfully</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 mb-3">
              The reunion registration has been deleted successfully!
            </p>
            <p className="text-sm text-gray-600">
              Note: The Firebase Auth user still exists and needs to be deleted manually.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">To delete the Auth user:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Go to Firebase Console → Authentication → Users</li>
              <li>Search for user with the details below</li>
              <li>Click the three dots menu and select "Delete"</li>
            </ol>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">Search Details:</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <span className="font-medium text-gray-600">UID:</span>
                  <span className="font-mono text-gray-800 break-all ml-2">{deleteInfo.uid}</span>
                </div>
                <Button
                  onClick={handleCopyUID}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  Copy
                </Button>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="font-mono text-gray-800 break-all ml-2">{deleteInfo.email}</span>
                </div>
                <Button
                  onClick={handleCopyEmail}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Close
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInfoModal; 