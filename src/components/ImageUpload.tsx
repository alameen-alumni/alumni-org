import { useState, useRef, useEffect, type DragEvent, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '../lib/cloudinary';
import { type ImageUploadProps } from '../types';

export default function ImageUpload({ 
  onImageUpload, 
  onMultipleImageUpload,
  currentImage, 
  className = '', 
  fieldName = 'image',
  multiple = false,
  onClearLocalStorage
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  // Load preview from localStorage on mount
  useEffect(() => {
    const savedPreview = localStorage.getItem(`imagePreview_${fieldName}`);
    if (savedPreview && !currentImage) {
      setPreview(savedPreview);
      // Also set selectedFile if we have a saved preview
      if (savedPreview.startsWith('blob:')) {
        // This is a blob URL, we need to recreate the file reference
        // For now, we'll just set the preview and let the parent handle the file
      }
    }
  }, [fieldName, currentImage]);

  // Cleanup function for preview URLs
  const cleanupPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPreviewUrl();
    };
  }, []);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Clear any previous errors
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (multiple) {
      // Handle multiple file selection
      const newFile = file;
      const newPreviewURL = URL.createObjectURL(newFile);
      
      setSelectedFiles(prev => {
        const updatedFiles = [...prev, newFile];
        // Pass updated files to parent component
        if (onMultipleImageUpload) {
          onMultipleImageUpload([], updatedFiles);
        }
        return updatedFiles;
      });
      setPreviews(prev => [...prev, newPreviewURL]);
    } else {
      // Handle single file selection
    // Cleanup previous preview URL
    cleanupPreviewUrl();

    // Create preview URL
    const previewURL = URL.createObjectURL(file);
    previewUrlRef.current = previewURL;
    setPreview(previewURL);
    setSelectedFile(file);
    
      // Store preview URL in localStorage
      localStorage.setItem(`imagePreview_${fieldName}`, previewURL);
      
      // Pass the file to parent component (no upload yet)
    onImageUpload('', file);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        // Handle multiple files
        Array.from(e.dataTransfer.files).forEach(file => {
          handleFileSelect(file);
        });
      } else {
        // Handle single file
      handleFileSelect(e.dataTransfer.files[0]);
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
        // Handle multiple files
        Array.from(e.target.files).forEach(file => {
          handleFileSelect(file);
        });
      } else {
        // Handle single file
      handleFileSelect(e.target.files[0]);
      }
    }
  };

  const removeImage = () => {
    cleanupPreviewUrl();
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    onImageUpload('');
    
    // Clear from localStorage
    localStorage.removeItem(`imagePreview_${fieldName}`);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to clear localStorage (can be called from parent)
  const clearLocalStorage = () => {
    localStorage.removeItem(`imagePreview_${fieldName}`);
    if (onClearLocalStorage) {
      onClearLocalStorage();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileInputChange}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Upload Area */}
      <div
         className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
         {multiple ? (
           // Multiple images mode
           <div className="space-y-4">
             {previews.length > 0 ? (
               <div className="space-y-3 max-h-48 overflow-y-auto">
                                     <div className="space-y-1">
                                         {selectedFiles.map((file, index) => (
                       <div key={index} className="flex items-center justify-between p-1 bg-gray-50 rounded border">
                         <div className="flex items-center space-x-2 flex-1 min-w-0">
                           <img
                             src={previews[index]}
                             alt={`Preview ${index + 1}`}
                             className="w-6 h-6 object-cover rounded flex-shrink-0"
                             onError={(e) => {
                               console.error('Failed to load image preview');
                               setError('Failed to load image preview');
                             }}
                           />
                           <div className="flex-1 min-w-0">
                             <p className="text-xs font-medium text-gray-900 truncate">
                               {file.name}
                             </p>
                             <p className="text-xs text-gray-500">
                               {(file.size / 1024 / 1024).toFixed(2)} MB
                             </p>
                           </div>
                         </div>
                                                   <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // Remove specific image
                              setSelectedFiles(prev => {
                                const remainingFiles = prev.filter((_, i) => i !== index);
                                // Update parent component with remaining files
                                if (onMultipleImageUpload) {
                                  onMultipleImageUpload([], remainingFiles);
                                }
                                return remainingFiles;
                              });
                              setPreviews(prev => prev.filter((_, i) => i !== index));
                            }}
                           className="ml-1 p-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                         >
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    {selectedFiles.length} image(s) selected (will upload on save)
                  </p>
                  {uploading && (
                    <div className="flex items-center justify-center p-2 bg-blue-50 rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-blue-700">Uploading to Cloudinary...</span>
                    </div>
                  )}
                </div>
             ) : (
              <div className="space-y-4">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Upload images
                  </p>
                  <p className="text-sm text-gray-500">
                    Drag and drop images here, or click to select multiple
                  </p>
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  variant="outline"
                  className="mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Single image mode
          preview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg shadow-md"
                onError={(e) => {
                  console.error('Failed to load image preview');
                  setError('Failed to load image preview');
                }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {selectedFile ? 'Image selected (will upload on save)' : 'Image uploaded successfully'}
            </p>
               {uploading && (
                 <div className="flex items-center justify-center p-2 bg-blue-50 rounded-lg">
                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   <span className="text-sm text-blue-700">Uploading to Cloudinary...</span>
                 </div>
               )}
          </div>
        ) : (
          <div className="space-y-4">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Upload an image
              </p>
              <p className="text-sm text-gray-500">
                Drag and drop an image here, or click to select
              </p>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              variant="outline"
              className="mt-2"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
          )
        )}
      </div>
    </div>
  );
} 