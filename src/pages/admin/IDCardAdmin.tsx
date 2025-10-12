import { Button } from '@/components/ui/button';
import { useGenerateIdCards } from '@/hooks/use-generate-idcards';
import JSZip from 'jszip';
import React, { useState } from 'react';

// Fixed configuration per requirement
const FIXED_COLLECTION = 'reunion';
const FIXED_ORDER_BY = 'sl_no';
const FIXED_TEMPLATE = '/idCard.jpg';
const FIXED_OUTPUT_FOLDER = 'idcards';
const FIXED_NAME_FIELD = 'name';
const FIXED_BATCH_FIELD = 'education.passout_year';
const FIXED_SERIAL_FIELD = 'sl_no';

const IDCardAdmin: React.FC = () => {
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(10);
  const { loading, progress, generateRange } = useGenerateIdCards();
  const [messages, setMessages] = useState<string[]>([]);

  const appendMsg = (m: string) => setMessages((s) => [...s, m]);

  const handleGenerate = async () => {
    setMessages([]);
    // Use fixed configuration
    appendMsg(`Starting generation ${startIndex} → ${endIndex} using template ${FIXED_TEMPLATE}`);

    try {
      const result = await generateRange({
        collectionName: FIXED_COLLECTION,
        orderByField: FIXED_ORDER_BY,
        startIndex,
        endIndex,
        templateUrl: FIXED_TEMPLATE,
        outputFolder: FIXED_OUTPUT_FOLDER,
        nameField: FIXED_NAME_FIELD,
        batchField: FIXED_BATCH_FIELD,
        serialField: FIXED_SERIAL_FIELD,
        onEach: ({ userId, url, idx }) => {
          appendMsg(`Generated for user ${userId} (index ${idx + 1}): ${url}`);
        },
      });

      appendMsg('Generation finished.');

      // If we have generated files, build a ZIP and trigger download
      if (result?.generatedFiles && result.generatedFiles.length) {
        appendMsg(`Preparing zip with ${result.generatedFiles.length} files...`);
        const zip = new JSZip();
        result.generatedFiles.forEach((f) => {
          zip.file(f.fileName, f.blob);
        });
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `idcards_${startIndex}_${endIndex}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        appendMsg('Zip download started.');
      }

      if (result?.skipped && result.skipped.length) {
        result.skipped.forEach((s) => appendMsg(s));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendMsg(`Generation aborted: ${msg}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">ID Card Generator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
        <label className="block">
          <div className="text-sm text-gray-600">From sl_no</div>
          <input type="number" value={startIndex} onChange={(e) => setStartIndex(Number(e.target.value))} className="mt-1 p-2 border rounded w-full" min={1} />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">To sl_no</div>
          <input type="number" value={endIndex} onChange={(e) => setEndIndex(Number(e.target.value))} className="mt-1 p-2 border rounded w-full" min={startIndex} />
        </label>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate ID Cards'}
        </Button>
        {progress && (
          <div className="text-sm">
            {progress.completed}/{progress.total} completed {progress.currentUserId ? ` - working ${progress.currentUserId}` : ''}
            {progress.error ? ` (error: ${progress.error})` : ''}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-medium">Logs</h3>
        <div className="mt-2 max-h-64 overflow-auto bg-gray-50 p-3 rounded">
          {messages.map((m, i) => (
            <div key={i} className="text-sm text-gray-700">{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IDCardAdmin;
