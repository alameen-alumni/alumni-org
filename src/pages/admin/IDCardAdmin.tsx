import { Button } from '@/components/ui/button';
import { useGenerateIdCards } from '@/hooks/use-generate-idcards';
import React, { useState } from 'react';

const IDCardAdmin: React.FC = () => {
  const [collectionName, setCollectionName] = useState('alumni');
  const [orderByField, setOrderByField] = useState('sl_no');
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(10);
  const [templateUrl, setTemplateUrl] = useState('/idcard/template.png');
  const [outputFolder, setOutputFolder] = useState('idcards');

  const [nameField, setNameField] = useState('name');
  const [batchField, setBatchField] = useState('batch');
  const [serialField, setSerialField] = useState('sl_no');

  const { loading, progress, generateRange } = useGenerateIdCards();
  const [messages, setMessages] = useState<string[]>([]);

  const appendMsg = (m: string) => setMessages((s) => [...s, m]);

  const handleGenerate = async () => {
    setMessages([]);
    if (!templateUrl) {
      appendMsg('Template URL is required');
      return;
    }
    if (!nameField || !batchField || !serialField) {
      appendMsg('Name field, Batch field and Serial field keys are required');
      return;
    }

    appendMsg(`Starting generation ${startIndex} → ${endIndex} using template ${templateUrl}`);

    try {
      await generateRange({
        collectionName,
        orderByField,
        startIndex,
        endIndex,
        templateUrl,
        outputFolder,
        nameField,
        batchField,
        serialField,
        onEach: ({ userId, url, idx }) => {
          appendMsg(`Generated for user ${userId} (index ${idx + 1}): ${url}`);
        },
      });
      appendMsg('Generation finished.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendMsg(`Generation aborted: ${msg}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">ID Card Generator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl">
        <label className="block">
          <div className="text-sm text-gray-600">Firestore collection</div>
          <input value={collectionName} onChange={(e) => setCollectionName(e.target.value)} className="mt-1 p-2 border rounded w-full" />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">Order by field</div>
          <input value={orderByField} onChange={(e) => setOrderByField(e.target.value)} className="mt-1 p-2 border rounded w-full" />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">Start index (1-based)</div>
          <input type="number" value={startIndex} onChange={(e) => setStartIndex(Number(e.target.value))} className="mt-1 p-2 border rounded w-full" />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">End index (inclusive)</div>
          <input type="number" value={endIndex} onChange={(e) => setEndIndex(Number(e.target.value))} className="mt-1 p-2 border rounded w-full" />
        </label>

        <label className="block md:col-span-2">
          <div className="text-sm text-gray-600">Template URL (public path or full URL)</div>
          <input value={templateUrl} onChange={(e) => setTemplateUrl(e.target.value)} className="mt-1 p-2 border rounded w-full" />
          <div className="text-xs text-gray-500 mt-1">Example: /idcard/template.png or https://example.com/template.png</div>
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">Storage output folder</div>
          <input value={outputFolder} onChange={(e) => setOutputFolder(e.target.value)} className="mt-1 p-2 border rounded w-full" />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">Name field key (required)</div>
          <input value={nameField} onChange={(e) => setNameField(e.target.value)} className="mt-1 p-2 border rounded w-full" />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">Batch field key (required)</div>
          <input value={batchField} onChange={(e) => setBatchField(e.target.value)} className="mt-1 p-2 border rounded w-full" />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600">Serial field key (required)</div>
          <input value={serialField} onChange={(e) => setSerialField(e.target.value)} className="mt-1 p-2 border rounded w-full" />
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
