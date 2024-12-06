import { useState } from "react";
import UploadIcon from "../assets/svg/UploadIcon";
import Accordion from "../components/misc/Accordion";
import { documentsArr } from "../constants/constants";
import axios from "../utils/axiosInstance";

const Document = () => {
  const [documents, setDocuments] = useState(documentsArr);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please choose a smaller file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      try {
        const uploadRes = await axios.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Parsing pdf
        if (uploadRes.status == 201) {
          const parseRes = await axios.post(
            "/files/parse",
            { fileUrl: uploadRes.data.file.fileUrl },
          );
        }
        
      } catch (error) {
        console.log("Error in uploading file : ", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-black py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <label
            htmlFor="file-upload"
            className="flex justify-center items-center cursor-pointer px-6 py-3 text-lg font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition"
          >
            <UploadIcon />
            Upload PDF
          </label>
          <p className="text-sm text-gray-500">
            Please upload PDF less than 5MB
          </p>
          <input
            id="file-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        <div className="mt-10">
          {documents &&
            documents?.map((doc) => (
              <Accordion key={doc.id} title={doc.title}>
                <p>
                  <strong>Date:</strong> {doc.date}
                </p>
                <p>
                  <strong>Document ID:</strong> {doc.id}
                </p>
                <p>
                  <strong>Summary:</strong> {doc.summary}
                </p>
              </Accordion>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Document;
