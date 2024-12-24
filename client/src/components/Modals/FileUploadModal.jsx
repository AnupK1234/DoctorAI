import { useState } from "react";
import { FaFilePdf, FaImage, FaTrash, FaTimes } from "react-icons/fa";

const FileUploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleFileSelect = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 5MB limit. Please choose a smaller file.");
      return;
    }

    if (fileType === "pdf" && file.type === "application/pdf") {
      setPdfFile(file);
    } else if (fileType === "image" && file.type.startsWith("image/")) {
      setImageFile(file);
    } else {
      alert(`Invalid file type. Please upload a valid ${fileType.toUpperCase()} file.`);
    }
  };

  const handleRemoveFile = (fileType) => {
    if (fileType === "pdf") setPdfFile(null);
    if (fileType === "image") setImageFile(null);
  };

  const handleSubmit = () => {
    if (!pdfFile && !imageFile) {
      alert("Please upload at least one file before submitting.");
      return;
    }

    onSubmit({ pdfFile, imageFile });
    setPdfFile(null);
    setImageFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <FaTimes size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Upload Files</h2>

        <div className="space-y-6">
          {/* PDF Upload */}
          <div>
            <label
              htmlFor="pdf-upload"
              className="block text-lg font-medium cursor-pointer flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <FaFilePdf />
              <span>Upload PDF</span>
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "pdf")}
            />
            {pdfFile && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-gray-700">{pdfFile.name}</span>
                <button
                  onClick={() => handleRemoveFile("pdf")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label
              htmlFor="image-upload"
              className="block text-lg font-medium cursor-pointer flex items-center space-x-2 text-green-600 hover:text-green-800"
            >
              <FaImage />
              <span>Upload Image</span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e, "image")}
            />
            {imageFile && (
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-gray-700">{imageFile.name}</span>
                <button
                  onClick={() => handleRemoveFile("image")}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-blue-500 text-white font-medium text-lg py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Submit Files for Processing
        </button>
      </div>
    </div>
  );
};

export default FileUploadModal;
