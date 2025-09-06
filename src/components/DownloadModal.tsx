import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { 
  X, 
  FileText, 
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface DownloadModalProps {
  uploadResult: any;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  uploadResult,
  onClose
}) => {
  const { addToast } = useToast();

  const handleDownload = () => {
    if (uploadResult?.downloadLink) {
      // Create a temporary anchor element to trigger download
      const prefix = "http://192.168.0.46:8081"; 
    const finalUrl = uploadResult.downloadLink.startsWith("http")
      ? uploadResult.downloadLink
      : `${prefix}${uploadResult.downloadLink}`;
      const link = document.createElement('a');
      link.href = finalUrl;
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

  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upload Complete!</h2>
                <p className="text-sm text-gray-600">Your file has been processed successfully</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Upload Statistics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">{uploadResult?.totalRows || 0}</p>
                <p className="text-sm text-gray-600">Total Rows</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-700">{uploadResult?.successfulStrips || 0}</p>
                <p className="text-sm text-green-600">Successful</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-3xl font-bold text-red-700">{uploadResult?.failedRows || 0}</p>
                <p className="text-sm text-red-600">Failed</p>
              </div>
            </div>

            {/* Message */}
            {uploadResult?.message && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <p className="text-blue-700 text-sm">{uploadResult.message}</p>
                </div>
              </div>
            )}

            {/* Download Section */}
            {uploadResult?.downloadLink ? (
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Results</h3>
                  <p className="text-gray-600 mb-4">
                    Your processed CSV file is ready for download. This file contains the results of your upload.
                  </p>
                  <Button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
                  >
                    <Download className="h-5 w-5" />
                    Download CSV File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-yellow-700 font-medium">No Download Link Available</p>
                    <p className="text-yellow-600 text-sm">The upload was successful but no download link was provided.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
          </div>
        </div>
      </Card>
    </div>
  );
};
