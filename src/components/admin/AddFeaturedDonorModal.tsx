import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

const getLastClassLabel = (lastClass?: string): string => {
  switch (lastClass) {
    case "10":
      return "Madhyamik";
    case "12":
      return "Higher Secondary";
    default:
      return lastClass || "N/A";
  }
}

interface AddFeaturedDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonorAdded: () => void;
}

const AddFeaturedDonorModal = ({ isOpen, onClose, onDonorAdded }: AddFeaturedDonorModalProps) => {
  const [addMethod, setAddMethod] = useState('manual');
  const [regIdInput, setRegIdInput] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualBadge, setManualBadge] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualLastClass, setManualLastClass] = useState('');
  const { toast } = useToast();

  const handleAddDonor = async () => {
    try {
      if (addMethod === 'regId') {
        if (!regIdInput) {
          toast({ title: "Error", description: "Please enter a registration number.", variant: "destructive" });
          return;
        }

        const duplicateQuery = query(collection(db, 'featured_donors'), where('regId', '==', regIdInput));
        const duplicateSnapshot = await getDocs(duplicateQuery);
        if (!duplicateSnapshot.empty) {
          toast({ title: "Error", description: "Donor with this registration number already exists.", variant: "destructive" });
          return;
        }

        const reunionQuery = query(collection(db, 'reunion'), where('reg_id', '==', parseInt(regIdInput)));
        const reunionSnapshot = await getDocs(reunionQuery);
        if (reunionSnapshot.empty) {
          toast({ title: "Error", description: "No user found with this registration number.", variant: "destructive" });
          return;
        }

        const reunionData = reunionSnapshot.docs[0].data();
        const donorAmount = reunionData.event?.donate || 0;
        if (donorAmount === 0) {
          toast({ title: "Error", description: "Donor amount is zero.", variant: "destructive" });
          return;
        }

        await addDoc(collection(db, 'featured_donors'), {
          name: reunionData.name || 'N/A',
          badge: reunionData.education?.passout_year?.toString() || 'N/A',
          amount: donorAmount,
          regId: regIdInput,
          education: { last_class: reunionData.education?.last_class?.toString() }
        });
        toast({ title: "Success", description: "Donor added from registration number." });
      } else {
        if (!manualName || !manualBadge || !manualAmount) {
          toast({ title: "Error", description: "Please fill all manual donor fields.", variant: "destructive" });
          return;
        }
        const parsedAmount = parseFloat(manualAmount);
        if (parsedAmount === 0) {
          toast({ title: "Error", description: "Donor amount is zero.", variant: "destructive" });
          return;
        }

        await addDoc(collection(db, 'featured_donors'), {
          name: manualName,
          badge: manualBadge,
          amount: parsedAmount,
          regId: 'manual-' + Date.now(),
          education: { last_class: manualLastClass }
        });
        toast({ title: "Success", description: "Manual donor added." });
      }

      setRegIdInput('');
      setManualName('');
      setManualBadge('');
      setManualAmount('');
      setManualLastClass('');
      onDonorAdded();
      onClose();
    } catch (error) {
      console.error("Error adding donor:", error);
      toast({ title: "Error", description: "Failed to add donor.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Donor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <RadioGroup defaultValue="manual" onValueChange={setAddMethod} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual">Manually Input</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regId" id="regId" />
              <Label htmlFor="regId">Add by Registration Number</Label>
            </div>
          </RadioGroup>

          {addMethod === 'regId' ? (
            <div className="flex flex-col space-y-3">
              <Input
                placeholder="Registration Number"
                value={regIdInput}
                onChange={(e) => setRegIdInput(e.target.value)}
              />
              <Button onClick={handleAddDonor}>Add Donor by Reg ID</Button>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <Input
                placeholder="Donor Name"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
              <Input
                placeholder="Badge (e.g., 2000-2004 Batch)"
                value={manualBadge}
                onChange={(e) => setManualBadge(e.target.value)}
              />
              <Input
                placeholder="Amount"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                type="number"
              />
              <Input
                placeholder="Last Class (e.g., 10 or 12)"
                value={manualLastClass}
                onChange={(e) => setManualLastClass(e.target.value)}
              />
              <Button onClick={handleAddDonor}>Add Manual Donor</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeaturedDonorModal;