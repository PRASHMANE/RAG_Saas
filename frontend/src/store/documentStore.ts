import { create } from "zustand";

type Document = {
  id: string;
  filename: string;
};

type DocumentStore = {
  documents: Document[];
  selectedDocument: Document | null;

  setDocuments: (docs: Document[]) => void;
  setSelectedDocument: (doc: Document | null) => void;
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  selectedDocument: null,

  setDocuments: (docs) => set({ documents: docs }),

  setSelectedDocument: (doc) => set({ selectedDocument: doc }),
}));