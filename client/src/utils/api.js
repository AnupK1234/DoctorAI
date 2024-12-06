import axios from "./axiosInstance";

const fetchDocuments = async () => {
  const documents = await axios.get("/files/get-documents");

  return documents;
};

export { fetchDocuments };
