import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  Loader2, 
  AlertCircle,
  Check,
  Camera,
  Link
} from 'lucide-react';
import { adminService } from '@/services/admin';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  showUrlInput?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Upload an image',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  showUrlInput = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlMode, setShowUrlMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Accepted types: ${acceptedTypes.join(', ')}`);
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        throw new Error(`File size must be less than ${maxSize}MB`);
      }

      // Upload file
      const response = await adminService.uploadMedia(
        file,
        `Featured image for blog post`,
        `Uploaded ${file.name}`
      );

      onChange(response.file.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [acceptedTypes, maxSize, onChange]);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlMode(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {value ? (
        // Display selected image
        <div className="relative group">
          <img
            src={value}
            alt="Selected"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
            onError={() => setError('Failed to load image')}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
              <button
                onClick={openFileDialog}
                className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                title="Change image"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemove}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Upload area
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            dragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}`}
          onClick={!uploading ? openFileDialog : undefined}
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="w-12 h-12 text-blue-600 mx-auto animate-spin" />
              <p className="text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                dragOver ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Upload className={`w-8 h-8 ${dragOver ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900 mb-1">{placeholder}</p>
                <p className="text-sm text-gray-500">
                  Drag and drop an image here, or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Supports: {acceptedTypes.map(type => type.split('/')[1]).join(', ')} • Max {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* URL input mode */}
      {showUrlInput && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Or use image URL</span>
            <button
              onClick={() => setShowUrlMode(!showUrlMode)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {showUrlMode ? 'Hide URL input' : 'Use URL instead'}
            </button>
          </div>

          {showUrlMode && (
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
                />
              </div>
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-800 text-sm">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success message for URL */}
      {value && !error && (
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <Check className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
          <span className="text-green-800 text-sm">Image selected successfully</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;