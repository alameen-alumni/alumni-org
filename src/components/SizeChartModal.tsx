import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeChartModal: React.FC<SizeChartModalProps> = ({ isOpen, onClose }) => {
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');

  const handleGenderSelect = (gender: 'men' | 'women') => {
    setSelectedGender(gender);
  };

  const handleCloseModal = () => {
    setSelectedGender(null); // Reset gender selection when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-xl w-full h-[95vh] p-6">
          <p className="text-xl font-bold text-center mb-0.5">Size Chart</p>

        <Tabs defaultValue="men" className="w-full mt-2" onValueChange={(value) => handleGenderSelect(value as 'men' | 'women')}>
          <TabsList className="grid w-full grid-cols-2 gap-4">
            <TabsTrigger value="men" className={selectedGender === 'men' ? 'bg-teal-600 text-white border-2' : 'border-2'}>Men</TabsTrigger>
            <TabsTrigger value="women" className={selectedGender === 'women' ? 'bg-gray-500 text-white border-2' : 'border-2'}>Women</TabsTrigger>
          </TabsList>
          <TabsContent value="men" className="mt-4 flex justify-center">
            <img src="/menSize.jpg" alt="Men's Size Chart" className="max-w-full h-[70vh] rounded-lg shadow-lg" />
          </TabsContent>
          <TabsContent value="women" className="mt-4 flex justify-center">
            <img src="/womenSize.jpg" alt="Women's Size Chart" className="max-w-full h-[70vh] rounded-lg shadow-lg" />
          </TabsContent>
        </Tabs>}

        <div className="mt-8 text-center">
          <Button onClick={handleCloseModal} variant="outline" className="px-6 py-3 text-lg">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SizeChartModal;