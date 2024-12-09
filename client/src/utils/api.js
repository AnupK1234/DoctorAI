import axios from "./axiosInstance";

const fetchDocuments = async () => {
  const documents = await axios.post("/files/get-documents");

  return documents;
};

export { fetchDocuments };
