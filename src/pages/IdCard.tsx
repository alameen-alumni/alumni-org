import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useGenerateIdCards } from "@/hooks/use-generate-idcards";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";

const FIXED_COLLECTION = "reunion";
const FIXED_TEMPLATE = "/idCard1.png";
const FIXED_NAME_FIELD = "name";
const FIXED_BATCH_FIELD = "education.passout_year";
const FIXED_SERIAL_FIELD = "sl_no";

export default function IdCard() {
  const [regId, setRegId] = useState('');
  const { generateRange, loading, progress } = useGenerateIdCards();
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!regId.trim()) return;
    setDownloadError(null);

    // Convert reg_id to number
    const regIdNumber = parseInt(regId.trim());
    if (isNaN(regIdNumber)) {
      setDownloadError('Please enter a valid registration number');
      return;
    }

    try {
      const userQuery = query(
        collection(db, FIXED_COLLECTION),
        where("reg_id", "==", regIdNumber)  // Query with number
      );

      const snapshot = await getDocs(userQuery);

      if (snapshot.empty) {
        setDownloadError('No user found with this registration number');
        return;
      }

      const userData = snapshot.docs[0].data();
      const serialNumber = parseInt(userData.sl_no); // Convert sl_no to number

      if (!serialNumber || isNaN(serialNumber)) {
        setDownloadError('User found but missing or invalid serial number');
        return;
      }

      console.log('Found user:', { regId: regIdNumber, serialNumber }); // Debug log

      const result = await generateRange({
        collectionName: FIXED_COLLECTION,
        orderByField: FIXED_SERIAL_FIELD,
        startIndex: serialNumber,
        endIndex: serialNumber,
        templateUrl: FIXED_TEMPLATE,
        nameField: FIXED_NAME_FIELD,
        batchField: FIXED_BATCH_FIELD,
        serialField: FIXED_SERIAL_FIELD,
      });

      if (result?.generatedFiles?.[0]?.blob) {
        const file = result.generatedFiles[0];
        const url = URL.createObjectURL(file.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `idcard_${regIdNumber}.pdf`;  // Use reg_id in filename
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } else {
        setDownloadError('Failed to generate ID card');
      }
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Failed to generate ID card');
      console.error('ID card generation failed:', err);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-6 pt-36 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Download Your ID Card</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            type="number"  // Changed to number input
            value={regId}
            onChange={(e) => setRegId(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Enter your registration number"
            min="1"
          />
        </div>

        {progress?.error && (
          <div className="text-red-500 text-sm">{progress.error}</div>
        )}

        {downloadError && (
          <div className="text-red-500 text-sm">{downloadError}</div>
        )}

        {progress && !progress.error && (
          <div className="text-sm text-gray-600">
            Progress: {progress.completed}/{progress.total}
          </div>
        )}

        <Button
          onClick={handleDownload}
          disabled={loading || !regId.trim()}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Download ID Card'}
        </Button>
      </div>
    </div>
    </>
  );
}