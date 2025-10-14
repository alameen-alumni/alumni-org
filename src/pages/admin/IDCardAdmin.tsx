import { Button } from "@/components/ui/button";
import { useGenerateIdCards } from "@/hooks/use-generate-idcards";
import { CheckCircle, XCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Fixed configuration per requirement
const FIXED_COLLECTION = "reunion";
const FIXED_ORDER_BY = "sl_no";
const FIXED_TEMPLATE = "/idCard1.png";
const FIXED_OUTPUT_FOLDER = "idcards";
const FIXED_NAME_FIELD = "name";
const FIXED_BATCH_FIELD = "education.passout_year";
const FIXED_SERIAL_FIELD = "sl_no";

const IDCardAdmin: React.FC = () => {
  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [singleId, setSingleId] = useState("");
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(10);

  // Event presence filter checkboxes
  const [includeYes, setIncludeYes] = useState(true);
  const [includeNo, setIncludeNo] = useState(false);
  const [includeMaybe, setIncludeMaybe] = useState(true);

  // Results tracking for table
  const [resultsSummary, setResultsSummary] = useState<{
    successful: Array<{ sl_no: number; name: string; status: string }>;
    missed: Array<{ sl_no: number; name: string; status: string; reason: string }>;
  }>({ successful: [], missed: [] });

const { loading, progress, generateRange } = useGenerateIdCards();
  const [messages, setMessages] = useState<string[]>([]);
  const [generatedFilesState, setGeneratedFilesState] = useState<
    Array<{ fileName: string; blob: Blob; url?: string; userId: string }>
  >([]);
  const [downloadLinks, setDownloadLinks] = useState<Record<string, string>>(
    {}
  );
  const objectUrlsRef = useRef<string[]>([]);

  const appendMsg = (m: string) => setMessages((s) => [...s, m]);

  // Build presence filter array based on checkbox selection
  const getPresenceFilter = () => {
    const filters = [];
    if (includeYes) filters.push("yes");
    if (includeNo) filters.push("no");
    if (includeMaybe) filters.push("maybe");
    return filters;
  };

  // layout controls
  const [nameSize, setNameSize] = useState<number | "">(18);
  const [idSize, setIdSize] = useState<number | "">(14);
  const [batchSize, setBatchSize] = useState<number | "">(12);
  const [nameColorHex, setNameColorHex] = useState("#000000");
  const [idColorHex, setIdColorHex] = useState("#000000");
  const [batchColorHex, setBatchColorHex] = useState("#000000");
  const [nameX, setNameX] = useState<number | "">("");
  const [nameY, setNameY] = useState<number | "">("");
  const [idX, setIdX] = useState<number | "">("");
  const [idY, setIdY] = useState<number | "">("");
  const [batchX, setBatchX] = useState<number | "">("");
  const [batchY, setBatchY] = useState<number | "">("");

  const hexToRgb = (h: string): [number, number, number] | undefined => {
    if (!h || h[0] !== "#") return undefined;
    const hex = h.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return [r / 255, g / 255, b / 255];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r / 255, g / 255, b / 255];
    }
    return undefined;
  };

  const handleBulkGenerate = async () => {
    setMessages([]);
    setResultsSummary({ successful: [], missed: [] });

    const presenceFilter = getPresenceFilter();
    if (presenceFilter.length === 0) {
      appendMsg("Please select at least one event presence status (Yes, No, or Maybe)");
      return;
    }

    // Use fixed configuration
    appendMsg(
      `Starting generation ${startIndex} → ${endIndex} using template ${FIXED_TEMPLATE} for presence: ${presenceFilter.join(', ')}`
    );

    try {
      const layoutOptions = {
        nameFontSize: typeof nameSize === "number" ? nameSize : undefined,
        idFontSize: typeof idSize === "number" ? idSize : undefined,
        batchFontSize: typeof batchSize === "number" ? batchSize : undefined,
        nameX: typeof nameX === "number" ? nameX : undefined,
        nameY: typeof nameY === "number" ? nameY : undefined,
        idX: typeof idX === "number" ? idX : undefined,
        idY: typeof idY === "number" ? idY : undefined,
        batchX: typeof batchX === "number" ? batchX : undefined,
        batchY: typeof batchY === "number" ? batchY : undefined,
        nameColor: hexToRgb(nameColorHex),
        idColor: hexToRgb(idColorHex),
        batchColor: hexToRgb(batchColorHex),
      };

      const result = await generateRange({
        collectionName: FIXED_COLLECTION,
        orderByField: FIXED_ORDER_BY,
        startIndex,
        endIndex,
        templateUrl: FIXED_TEMPLATE,
        nameField: FIXED_NAME_FIELD,
        batchField: FIXED_BATCH_FIELD,
        serialField: FIXED_SERIAL_FIELD,
        presenceFilter,
        onEach: ({ userId, url, idx }) => {
          const base = `Generated for user ${userId} (index ${idx + 1})`;
          appendMsg(url ? `${base}: ${url}` : base + ".");
        },
        onLog: (m) => appendMsg(`DEBUG: ${m}`),
        layoutOptions,
      });

      // Update results summary
      if (result?.summary) {
        setResultsSummary(result.summary);
      }

      appendMsg("Generation finished.");
      // diagnostic summary to help debug missing downloads
      try {
        const filesCount = result?.generatedFiles?.length ?? 0;
        const skippedCount = result?.skipped?.length ?? 0;
        const errorsCount = result?.errors?.length ?? 0;
        appendMsg(
          `Result summary: files=${filesCount}, skipped=${skippedCount}, errors=${errorsCount}`
        );
        if (filesCount > 0) {
          for (const f of result.generatedFiles) {
            const hasUrl = !!f.url;
            const size =
              f.blob && typeof f.blob.size === "number"
                ? f.blob.size
                : undefined;
            appendMsg(
              `Result file: ${f.fileName} user=${f.userId} hasUrl=${hasUrl} size=${size}`
            );
          }
        }
      } catch (e) {
        void e;
      }

      // store generated files and prepare download links (prefer remote URL, fallback to blob object URL)
      if (result?.generatedFiles && result.generatedFiles.length) {
        // cleanup previous object URLs
        objectUrlsRef.current.forEach((u) => {
          try {
            URL.revokeObjectURL(u);
          } catch (e) {
            void e;
          }
        });
        objectUrlsRef.current = [];

        const links: Record<string, string> = {};
        for (const f of result.generatedFiles) {
          if (f.url) {
            links[f.fileName] = f.url;
          } else if (f.blob) {
            try {
              const obj = URL.createObjectURL(f.blob);
              links[f.fileName] = obj;
              objectUrlsRef.current.push(obj);
            } catch (e) {
              // ignore
            }
          }
        }
        setDownloadLinks(links);
        setGeneratedFilesState(result.generatedFiles);
      } else {
        setDownloadLinks({});
        setGeneratedFilesState([]);
      }

      // If we have a combined PDF (userId === 'combined'), download it directly
      if (result?.generatedFiles && result.generatedFiles.length) {
        const combined = result.generatedFiles.find(
          (f) => f.userId === "combined"
        );
        if (combined) {
          appendMsg(
            `Combined PDF generated: ${combined.fileName}. Attempting download...`
          );
          try {
            // Prefer external URL if the combined file was uploaded and a remote URL exists
            if (combined.url) {
              appendMsg(
                `Remote URL available: ${combined.url} — opening in new tab.`
              );
              // open in new tab; user can then save from browser
              window.open(combined.url, "_blank");
              appendMsg("Remote URL opened in new tab.");
            } else if (combined.blob) {
              const blob = combined.blob;
              appendMsg(
                `No remote URL; using blob fallback. Blob size=${
                  typeof blob.size === "number" ? blob.size : "unknown"
                }`
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = combined.fileName;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
              appendMsg("Combined PDF blob download started.");
            } else {
              appendMsg("Combined file has no remote URL or blob to download.");
            }
          } catch (dErr) {
            const dm = dErr instanceof Error ? dErr.message : String(dErr);
            appendMsg(`Failed to start combined PDF download: ${dm}`);
          }
        } else {
          // No combined file: do not create a zip. Log the available generated files instead.
          appendMsg(
            `Generated ${result.generatedFiles.length} individual files. Zip creation removed by admin request.`
          );
          for (const f of result.generatedFiles) {
            try {
              const size =
                f.blob && typeof f.blob.size === "number"
                  ? f.blob.size
                  : undefined;
              appendMsg(`File: ${f.fileName} (user: ${f.userId}) size=${size}`);
            } catch (fileErr) {
              const fm =
                fileErr instanceof Error ? fileErr.message : String(fileErr);
              appendMsg(`Failed to read info for ${f.fileName}: ${fm}`);
            }
          }
        }
      } else {
        appendMsg("No files were generated for the selected range.");
      }

      if (result?.errors && result.errors.length) {
        appendMsg("Errors encountered:");
        result.errors.forEach((s) => appendMsg(s));
      } else if (result?.skipped && result.skipped.length) {
        result.skipped.forEach((s) => appendMsg(s));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendMsg(`Generation aborted: ${msg}`);
    }
  };

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          void e;
        }
      });
      objectUrlsRef.current = [];
    };
  }, []);

  const handleSingleGenerate = async () => {
    setMessages([]);
    if (!singleId) {
      appendMsg("Please enter a serial number");
      return;
    }

    try {
      const result = await generateRange({
        collectionName: FIXED_COLLECTION,
        orderByField: FIXED_ORDER_BY,
        startIndex: parseInt(singleId),
        endIndex: parseInt(singleId),
        templateUrl: FIXED_TEMPLATE,
        nameField: FIXED_NAME_FIELD,
        batchField: FIXED_BATCH_FIELD,
        serialField: FIXED_SERIAL_FIELD,
      });

      if (result?.generatedFiles && result.generatedFiles.length > 0) {
        const file = result.generatedFiles[0];
        if (file.blob) {
          const url = URL.createObjectURL(file.blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = file.fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          appendMsg("ID Card PDF download started.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      appendMsg(`Generation failed: ${msg}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">ID Card Generator</h2>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="single"
              checked={mode === "single"}
              onChange={(e) => setMode(e.target.value as "single" | "bulk")}
              className="mr-2"
            />
            Single ID Card
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="bulk"
              checked={mode === "bulk"}
              onChange={(e) => setMode(e.target.value as "single" | "bulk")}
              className="mr-2"
            />
            Bulk Generation
          </label>
        </div>

        {mode === "bulk" && (
          <div className="mb-4 p-3 border rounded-lg bg-gray-50 w-56">
            <h3 className="text-sm font-medium mb-2">Event Presence Filter</h3>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeYes}
                  onChange={(e) => setIncludeYes(e.target.checked)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeNo}
                  onChange={(e) => setIncludeNo(e.target.checked)}
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={includeMaybe}
                  onChange={(e) => setIncludeMaybe(e.target.checked)}
                  className="mr-2"
                />
                Maybe
              </label>
            </div>
          </div>
        )}

        {mode === "single" ? (
          <div className="max-w-md">
            <label className="block">
              <div className="text-sm text-gray-600">Serial Number</div>
              <input
                type="number"
                value={singleId}
                onChange={(e) => setSingleId(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                min={1}
              />
            </label>
            <div className="mt-4">
              <Button onClick={handleSingleGenerate} disabled={loading}>
                {loading ? "Generating…" : "Generate ID Card"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              <label className="block">
                <div className="text-sm text-gray-600">From sl_no</div>
                <input
                  type="number"
                  value={startIndex}
                  onChange={(e) => setStartIndex(Number(e.target.value))}
                  className="mt-1 p-2 border rounded w-full"
                  min={1}
                />
              </label>

              <label className="block">
                <div className="text-sm text-gray-600">To sl_no</div>
                <input
                  type="number"
                  value={endIndex}
                  onChange={(e) => setEndIndex(Number(e.target.value))}
                  className="mt-1 p-2 border rounded w-full"
                  min={startIndex}
                />
              </label>
            </div>

            <div className="mt-4">
              <Button onClick={handleBulkGenerate} disabled={loading}>
                {loading ? "Generating…" : "Generate ID Cards"}
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        {generatedFilesState.length > 0 &&
          (() => {
            const combined = generatedFilesState.find(
              (f) => f.userId === "combined"
            );
            const link = combined
              ? downloadLinks[combined.fileName] ?? undefined
              : undefined;
            return link ? (
              <div className="mt-2">
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline">Download Combined PDF</Button>
                </a>
              </div>
            ) : null;
          })()}
      </div>


      {/* Results Summary Table */}
      {(resultsSummary.successful.length > 0 || resultsSummary.missed.length > 0) && (
        <div className="mt-6">
          <h3 className="font-medium mb-4">Generation Summary</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Successful Table */}
            {resultsSummary.successful.length > 0 && (
              <div>
                <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Successful ({resultsSummary.successful.length})
                </h4>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-3 py-2 text-left border-b font-medium text-green-900">SL No</th>
                        <th className="px-3 py-2 text-left border-b font-medium text-green-900">Name</th>
                        <th className="px-3 py-2 text-left border-b font-medium text-green-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {resultsSummary.successful.map((item, i) => (
                        <tr key={i} className="border-b last:border-b-0 hover:bg-green-25">
                          <td className="px-3 py-2 font-mono text-green-800">{item.sl_no}</td>
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'yes' ? 'bg-green-100 text-green-800' :
                              item.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'no' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Missed Table */}
            {resultsSummary.missed.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Missed ({resultsSummary.missed.length})
                </h4>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-red-50">
                      <tr>
                        <th className="px-3 py-2 text-left border-b font-medium text-red-900">SL No</th>
                        <th className="px-3 py-2 text-left border-b font-medium text-red-900">Name</th>
                        <th className="px-3 py-2 text-left border-b font-medium text-red-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {resultsSummary.missed.map((item, i) => (
                        <tr key={i} className="border-b last:border-b-0 hover:bg-red-25">
                          <td className="px-3 py-2 font-mono text-red-800">{item.sl_no}</td>
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'yes' ? 'bg-green-100 text-green-800' :
                              item.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'no' ? 'bg-red-100 text-red-800' :
                              item.status === 'not set' ? 'bg-gray-100 text-gray-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IDCardAdmin;
