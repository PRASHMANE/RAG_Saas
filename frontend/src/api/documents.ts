import api from "./axios";

import type { Document } from "../types/document";

export const getDocuments = async () => {
  const response = await api.get<Document[]>(
    "/documents"
  );

  return response.data;
};

export const uploadDocument = async (
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteDocument = async (
  id: string
) => {
  await api.delete(`/documents/${id}`);
};