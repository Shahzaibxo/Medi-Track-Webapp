import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { stripService } from '../services/ApiClient';

// Global function declaration
declare global {
  interface Window {
    openDownloadModal?: (data: any) => void;
  }
}
import { 
  X, 
  Upload, 
  FileText, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FileUploadModalProps {
  medicineId: string;
  medicineName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  medicineId,
  medicineName,
  onClose,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
      setDownloadLink(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);
    setDownloadLink(null);

    try {
      console.log('Uploading file:', selectedFile.name, 'for medicine:', medicineId);
      const response = await stripService.uploadStripsFile(selectedFile, medicineId);
      console.log('=== UPLOAD API RESPONSE ===');
      console.log('Full response object:', response);
      console.log('Response data:', response.data);
      console.log('Response status:', response.status);
      console.log('Response success:', response.success);
      console.log('Response message:', response.message);
      
      // Log the structure of the response data
      if (response.data) {
        console.log('Response data type:', typeof response.data);
        console.log('Response data keys:', Object.keys(response.data));
        
        // If it's an array, log the first few items
        if (Array.isArray(response.data)) {
          console.log('Response data is an array with length:', response.data.length);
          console.log('First item in array:', response.data[0]);
          if (response.data.length > 1) {
            console.log('Second item in array:', response.data[1]);
          }
        }
        
        // If it has a data property, log that too
        if (response.data.data) {
          console.log('Response data.data:', response.data.data);
          console.log('Response data.data type:', typeof response.data.data);
          if (Array.isArray(response.data.data)) {
            console.log('Response data.data is an array with length:', response.data.data.length);
            console.log('First item in data.data:', response.data.data[0]);
          }
        }
      }
      console.log('=== END UPLOAD API RESPONSE ===');
      
      setUploadResult(response.data);
      
      // Extract download link from response
      if (response.data && response.data.downloadLink) {
        setDownloadLink(response.data.downloadLink);
        console.log('Download link found:', response.data.downloadLink);
      }
      
      // Show success message with details
      const totalRows = response.data?.totalRows || 0;
      const successfulStrips = response.data?.successfulStrips || 0;
      const failedRows = response.data?.failedRows || 0;
      
      addToast({
        type: 'success',
        title: 'File Uploaded Successfully!',
        message: `Processed ${totalRows} rows: ${successfulStrips} successful, ${failedRows} failed. Download link is now available.`
      });

      // Close this modal after 4-5 seconds and open download modal
      setTimeout(() => {
        handleClose();
        // Open download modal with the response data
        if (window.openDownloadModal) {
          window.openDownloadModal(response.data);
        }
      }, 4000);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload file');
      
      addToast({
        type: 'error',
        title: 'Upload Failed',
        message: error.message || 'Failed to upload file'
      });
    }
    
    setUploading(false);
  };

  const handleDownload = () => {
    if (downloadLink) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadLink;
      link.download = `strips-upload-result-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast({
        type: 'success',
        title: 'Download Started',
        message: 'Your CSV file is being downloaded.'
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setError(null);
    setDownloadLink(null);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Strips File</h2>
                <p className="text-sm text-gray-600">For {medicineName}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Upload Status Message */}
              {uploading && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    <div>
                      <p className="text-blue-700 font-medium">Uploading Your File</p>
                      <p className="text-blue-600 text-sm">This may take a few minutes. We'll notify you when it's ready!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Complete Message */}
              {uploadResult && !uploading && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-green-700 font-medium">Upload Complete!</p>
                      <p className="text-green-600 text-sm">Your file has been processed. Check the results below and download if needed.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* File Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    uploading 
                      ? 'border-gray-200 cursor-not-allowed opacity-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                  {selectedFile ? (
                    <div className="space-y-2">
                      <FileText className="h-12 w-12 text-blue-500 mx-auto" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Click to select file</p>
                        <p className="text-xs text-gray-500">CSV, XLSX, XLS files supported</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            {/* File Info */}
            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">File Details</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {selectedFile.name}</p>
                  <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
                  <p><span className="font-medium">Type:</span> {selectedFile.type || 'Unknown'}</p>
                  <p><span className="font-medium">Last Modified:</span> {new Date(selectedFile.lastModified).toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-red-700 font-medium">Upload Error</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success Display */}
            {uploadResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-green-700 font-medium">Upload Successful!</p>
                    <p className="text-green-600 text-sm">Your file has been processed successfully</p>
                  </div>
                </div>
                
                {/* Upload Statistics */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700">{uploadResult.totalRows || 0}</p>
                    <p className="text-xs text-green-600">Total Rows</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-700">{uploadResult.successfulStrips || 0}</p>
                    <p className="text-xs text-green-600">Successful</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{uploadResult.failedRows || 0}</p>
                    <p className="text-xs text-red-600">Failed</p>
                  </div>
                </div>
                
                {/* Download Button */}
                {downloadLink && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Download Results</p>
                        <p className="text-xs text-gray-600">Get the processed CSV file with results</p>
                      </div>
                      <Button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <FileText className="h-4 w-4" />
                        Download CSV
                      </Button>
                    </div>
                  </div>
                )}
                
                {uploadResult.message && (
                  <div className="mt-3 text-sm text-green-600">
                    {uploadResult.message}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              {uploadResult ? (
                // Show Done button after successful upload
                <Button
                  onClick={() => {
                    onSuccess(); // Refresh strips list
                    handleClose(); // Close modal
                  }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Done
                </Button>
              ) : (
                // Show Cancel and Upload buttons before upload
                <>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    loading={uploading}
                    disabled={!selectedFile}
                    className="flex items-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload File
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
