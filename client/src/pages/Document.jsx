import { useEffect, useState } from "react";
import { Link } from "react-router";
import UploadIcon from "../../public/assets/svg/UploadIcon";
import Accordion from "../components/misc/Accordion";
import { fetchDocuments } from "../utils/api";
import axios from "../utils/axiosInstance";
import Cookie from "js-cookie";
import { axiosInstance2 } from "../utils/axiosInstance";
import FileUploadModal from "../components/Modals/FileUploadModal";

const Document = () => {
  const [documents, setDocuments] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleFileUpload = async ({ pdfFile, imageFile }) => {
    const formData = new FormData();
    const token = Cookie.get("token");
    let fileData;

    try {
      // If PDF file exists, upload and parse
      if (pdfFile) {
        formData.append("file", pdfFile);

        const uploadRes = await axios.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadRes.status === 201) {
          const parseRes = await axios.post("/files/parse", {
            file: uploadRes.data.file,
          });
          fileData = uploadRes.data.file;

          if (parseRes.status === 201) alert("Your PDF has been uploaded.");
        }
      }

      // If Image file exists, upload to analyze route
      if (imageFile) {
        formData.append("image", imageFile);

        const analyzeRes = await axiosInstance2.post("/analyze-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const updateRes = await axios.post("/files/img-analysis", {
          fileData,
          analyzeRes
        });

        if (analyzeRes.status === 200) alert("Your image has been uploaded.");
      }
    } catch (error) {
      alert("Error uploading file(s). Please try again.");
      console.error("Error in uploading files:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const docs = await fetchDocuments();
      setDocuments(docs.data);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-black py-10">
      <div className="w-full max-w-md">
        {/* Upload Button */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleOpenModal}
            className="flex justify-center items-center px-6 py-3 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
          >
            <UploadIcon />
            Upload PDF / Image
          </button>
          <p className="text-sm text-gray-500">
            Please upload files less than 5MB
          </p>
        </div>

        {/* Accordion for Documents */}
        <div className="mt-10">
          {documents &&
            documents.map((doc, index) => (
              <Accordion key={doc._id} title={doc.title}>
                <p>
                  <strong>Date:</strong> {doc.createdAt}
                </p>
                <p>
                  <strong>Document ID:</strong> {doc._id}
                </p>
                <p>
                  <strong>Document Link:</strong>{" "}
                  <Link to={doc.fileUrl} className="text-blue-500 font-bold">
                    Link
                  </Link>
                </p>
                <p>
                  <strong>Summary:</strong> {doc.summary}
                </p>
              </Accordion>
            ))}
        </div>
      </div>

      {/* Modal for File Upload */}
      <FileUploadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFileUpload}
      />
    </div>
  );
};

export default Document;
