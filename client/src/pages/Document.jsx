import { useEffect, useState } from "react";
import { Link } from "react-router";
import UploadIcon from "../../public/assets/svg/UploadIcon";
import Accordion from "../components/misc/Accordion";
import { fetchDocuments } from "../utils/api";
import axios from "../utils/axiosInstance";
import Cookie from "js-cookie"

const Document = () => {
  const [documents, setDocuments] = useState();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please choose a smaller file.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const token = Cookie.get("token");

      try {
        const uploadRes = await axios.post("/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Parsing pdf
        if (uploadRes.status == 201) {
          const parseRes = await axios.post("/files/parse", {
            file: uploadRes.data.file,
          });

          if(parseRes.status == 201) alert("Your file has been uploaded")
        }
      } catch (error) {
        alert("Error uploading file")
        console.log("Error in uploading file : ", error);
      }
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
            documents?.map((doc, index) => (
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
    </div>
  );
};

export default Document;
