import { useState, type ChangeEvent } from "react";
import { db } from "../../lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";

interface AlumniEntry {
  name: string;
  reg_id: number;
}

export default function AlumniDbFiller() {
  const [jsonData, setJsonData] = useState<AlumniEntry[]>([]);
  const [jsonText, setJsonText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");
  
  // Single entry state
  const [singleName, setSingleName] = useState("");
  const [singleRegId, setSingleRegId] = useState("");
  const [singleUploading, setSingleUploading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setJsonData(parsed);
          setJsonText(JSON.stringify(parsed, null, 2));
          setResult("");
        } else {
          setJsonData([]);
          setResult("JSON must be an array of objects.");
        }
      } catch {
        setResult("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      if (Array.isArray(parsed)) {
        setJsonData(parsed);
        setResult("");
      } else {
        setJsonData([]);
        setResult("JSON must be an array of objects.");
      }
    } catch {
      setJsonData([]);
      setResult("Invalid JSON.");
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setResult("");
    let success = 0,
      fail = 0,
      skipped = 0;
    
    for (let idx = 0; idx < jsonData.length; idx++) {
      const entry = jsonData[idx];
      const regIdNum = Number(entry.reg_id);
      let currentStatus = '';
      
      if (typeof entry.name === 'string' && regIdNum) {
        // Check if reg_id exists
        const q = query(
          collection(db, "alumni_db"),
          where("reg_id", "==", regIdNum)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          skipped++;
          currentStatus = `#${idx + 1}: ${entry.name} (${regIdNum}) - Skipped (already exists)`;
          setResult(currentStatus);
          continue;
        }
        try {
          await addDoc(collection(db, "alumni_db"), {
            name: String(entry.name),
            reg_id: regIdNum,
          });
          success++;
          currentStatus = `#${idx + 1}: ${entry.name} (${regIdNum}) - Success`;
        } catch {
          fail++;
          currentStatus = `#${idx + 1}: ${entry.name} (${regIdNum}) - Failed`;
        }
      } else {
        fail++;
        currentStatus = `#${idx + 1}: Invalid entry - Failed`;
      }
      setResult(currentStatus);
    }
    setUploading(false);
    setResult(`Upload complete. Success: ${success}, Skipped: ${skipped}, Failed: ${fail}`);
  };

  const handleSingleUpload = async () => {
    if (!singleName.trim() || !singleRegId.trim()) {
      setResult("Please enter both name and registration ID");
      return;
    }

    const regIdNum = Number(singleRegId);
    if (!regIdNum || isNaN(regIdNum)) {
      setResult("Please enter a valid registration ID number");
      return;
    }

    setSingleUploading(true);
    setResult("");

    try {
      // Check if reg_id exists
      const q = query(
        collection(db, "alumni_db"),
        where("reg_id", "==", regIdNum)
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        setResult(`Entry with registration ID ${regIdNum} already exists`);
        setSingleUploading(false);
        return;
      }

      await addDoc(collection(db, "alumni_db"), {
        name: singleName.trim(),
        reg_id: regIdNum,
      });
      
      setResult(`Successfully added: ${singleName} (${regIdNum})`);
      setSingleName("");
      setSingleRegId("");
    } catch (error) {
      setResult(`Failed to add entry: ${error}`);
    }
    
    setSingleUploading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow ml-32">
      <h1 className="text-2xl font-bold mb-6 text-center">AlumniDB Filler</h1>
      
      {/* Single Entry Section */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h2 className="text-lg font-semibold mb-4 text-center">Add Single Entry</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              placeholder="Enter alumni name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Registration ID</label>
            <input
              type="number"
              value={singleRegId}
              onChange={(e) => setSingleRegId(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              placeholder="Enter registration ID"
            />
          </div>
          <Button 
            onClick={handleSingleUpload} 
            disabled={singleUploading}
            className="w-full"
          >
            {singleUploading ? "Adding..." : "Add Single Entry"}
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Bulk Upload from JSON</h2>
        <input
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          className="mb-4"
        />
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-medium mb-2">
              Paste JSON array here
            </label>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              onClick={() => { setJsonText(''); setJsonData([]); setResult(''); }}
            >
              Clear
            </button>
          </div>
          <textarea
            className="w-full border rounded p-2 text-xs min-h-[120px]"
            value={jsonText}
            onChange={handleTextChange}
            placeholder='[{"name": "Md Afzal Mir", "reg_id": 43264}, ...]'
          />
        </div>
        {jsonData.length > 0 && (
          <div className="my-4">
            <h2 className="font-semibold mb-2">
              Preview ({jsonData.length} entries):
            </h2>
            <pre className="bg-gray-100 p-2 rounded max-h-40 overflow-auto text-xs">
              {JSON.stringify(jsonData.slice(0, 5), null, 2)}
              {jsonData.length > 5 && "\n..."}
            </pre>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload to alumni_db"}
            </Button>
          </div>
        )}
      </div>
      {result && <div className="mt-4 text-sm text-center">{result}</div>}
    </div>
  );
}
