import React, { useRef, useMemo, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Maximize2, 
  Minimize2, 
  Type, 
  Save,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { adminService } from '@/services/admin';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  onAutoSave?: (content: string) => void;
  autoSaveInterval?: number; // in milliseconds
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  readOnly = false,
  className = '',
  onAutoSave,
  autoSaveInterval = 30000
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-save functionality
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  
  const handleAutoSave = useCallback(async (content: string) => {
    if (!onAutoSave || !content.trim()) return;
    
    try {
      setAutoSaving(true);
      await onAutoSave(content);
      setLastSaved(new Date());
    } catch (err) {
      console.warn('Auto-save failed:', err);
    } finally {
      setAutoSaving(false);
    }
  }, [onAutoSave]);

  const handleChange = useCallback((content: string) => {
    onChange(content);
    setError(null);
    
    // Clear existing auto-save timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new auto-save timeout
    if (onAutoSave && autoSaveInterval > 0) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave(content);
      }, autoSaveInterval);
    }
  }, [onChange, onAutoSave, autoSaveInterval, handleAutoSave]);

  // Handle image upload
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        setError(null);
        
        const response = await adminService.uploadMedia(
          file,
          `Image uploaded from rich text editor`,
          `Image: ${file.name}`
        );

        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          quill.insertEmbed(range?.index || 0, 'image', response.file.url);
        }
      } catch (err) {
        setError('Failed to upload image. Please try again.');
        console.error('Image upload failed:', err);
      } finally {
        setUploading(false);
      }
    };
  }, []);

  // Custom toolbar with image upload
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['code-block'],
        ['clean']
      ],
      handlers: {
        image: handleImageUpload
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), [handleImageUpload]);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image', 'video',
    'code-block'
  ];

  // Calculate word count and reading time
  const getWordCount = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text ? text.split(' ').length : 0;
  };

  const getReadingTime = (content: string): number => {
    const wordCount = getWordCount(content);
    return Math.ceil(wordCount / 200); // 200 words per minute
  };

  const wordCount = getWordCount(value);
  const readingTime = getReadingTime(value);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar Extensions */}
      <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Type className="w-4 h-4 mr-1" />
            {wordCount} words • {readingTime} min read
          </span>
          {lastSaved && (
            <span className="flex items-center text-green-600">
              <Save className="w-3 h-3 mr-1" />
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {autoSaving && (
            <span className="flex items-center text-blue-600">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Auto-saving...
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {uploading && (
            <span className="flex items-center text-blue-600">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Uploading image...
            </span>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      {/* Editor Container */}
      <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white p-6' : ''}`}>
        {isFullscreen && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h3 className="text-lg font-semibold">Full Screen Editor</h3>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>
        )}
        
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          readOnly={readOnly}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          className={`
            ${isFullscreen ? 'h-full' : 'min-h-96'}
            ${readOnly ? 'opacity-75' : ''}
          `}
          style={{
            height: isFullscreen ? 'calc(100% - 120px)' : '400px'
          }}
        />
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
          background: #f9fafb;
        }
        
        .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-top: none;
          border-radius: 0 0 0.5rem 0.5rem;
          font-family: inherit;
        }
        
        .ql-editor {
          font-size: 16px;
          line-height: 1.6;
          padding: 1rem;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
          margin: 0.5rem 0;
        }
        
        .ql-editor h1, .ql-editor h2, .ql-editor h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .ql-editor h1 { font-size: 2rem; font-weight: 700; }
        .ql-editor h2 { font-size: 1.5rem; font-weight: 600; }
        .ql-editor h3 { font-size: 1.25rem; font-weight: 600; }
        
        .ql-editor p {
          margin-bottom: 1rem;
        }
        
        .ql-editor blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .ql-editor pre {
          background: #f3f4f6;
          border-radius: 0.375rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        
        .ql-editor code {
          background: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        
        .ql-editor ul, .ql-editor ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .ql-editor li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;