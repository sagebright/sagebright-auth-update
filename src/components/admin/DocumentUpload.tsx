
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileUp, X, Eye, File, Save, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentUploadProps {
  onSave?: (documentData: any) => void;
  onCancel?: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  onSave,
  onCancel 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [documentType, setDocumentType] = useState('policy');
  const [visibility, setVisibility] = useState('private');

  // Sample tags for demonstration
  const availableTags = [
    'Onboarding', 'HR', 'Policy', 'Training', 'Benefits', 
    'Finance', 'Legal', 'IT', 'Operations', 'Marketing'
  ];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleFile(selectedFile);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setTitle(file.name.split('.')[0]); // Set default title as filename
    
    // If it's an image, create a preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    setTitle('');
    setDescription('');
    setSelectedTags([]);
  };

  const handleSave = () => {
    const documentData = {
      file,
      title,
      description,
      tags: selectedTags,
      type: documentType,
      visibility,
      uploadedAt: new Date().toISOString(),
    };
    
    onSave?.(documentData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center ${
              isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Drag & Drop File Here</h3>
            <p className="text-sm text-muted-foreground mb-4">or</p>
            <div className="relative">
              <Input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <Button variant="outline" className="relative">
                Browse Files
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Supported formats: PDF, DOCX, XLSX, JPG, PNG (max 10MB)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              {/* File Preview */}
              <div className="w-1/3 border rounded-lg p-4 flex flex-col items-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="File preview"
                    className="max-h-[200px] object-contain rounded mb-2"
                  />
                ) : (
                  <div className="h-[200px] w-full flex items-center justify-center">
                    <File className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground truncate w-full text-center mt-2">
                  {file.name}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" /> Preview
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleRemoveFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Document Metadata */}
              <div className="w-2/3 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter document title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full h-24 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter document description"
                  />
                </div>

                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="policy">Policy</option>
                    <option value="procedure">Procedure</option>
                    <option value="form">Form</option>
                    <option value="guide">Guide</option>
                    <option value="report">Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Visibility
                  </label>
                  <select 
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                  >
                    <option value="private">Private (Admins Only)</option>
                    <option value="internal">Internal (All Employees)</option>
                    <option value="restricted">Restricted (Select Departments)</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleTagToggle(tag)} 
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map(tag => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {file && (
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Save Document
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
