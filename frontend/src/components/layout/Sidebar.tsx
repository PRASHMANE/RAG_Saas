import { useEffect, useRef } from "react";
import { FileUp, LogOut, Trash2 } from "lucide-react";

import { getDocuments, uploadDocument } from "../../api/documents";
import { useAuthStore } from "../../store/authStore";
import { useDocumentStore } from "../../store/documentStore";

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const {
    documents,
    selectedDocument,
    setDocuments,
    setSelectedDocument,
  } = useDocumentStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data);

        // auto select first doc if exists
        if (data.length > 0 && !selectedDocument) {
          setSelectedDocument(data[0]);
        }
      } catch (error) {
        console.error("Failed to load documents:", error);
      }
    };

    load();
  }, []);

  // Upload PDF
  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadDocument(file);

      const data = await getDocuments();
      setDocuments(data);

      // auto-select latest uploaded document
      if (data.length > 0) {
        setSelectedDocument(data[data.length - 1]);
      }

      e.target.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <aside className="flex w-72 flex-col border-r border-zinc-800 bg-[#171717] p-4">
      {/* TITLE */}
      <h1 className="mb-6 text-xl font-bold">🤖 DataChat AI</h1>

      {/* USER INFO */}
      <div className="mb-6 rounded-xl bg-zinc-800 p-4">
        <p className="font-medium">{user?.full_name}</p>
        <p className="text-sm text-zinc-400">{user?.email}</p>
      </div>

      {/* UPLOAD */}
      <div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-zinc-800"
        >
          <FileUp size={18} />
          Upload PDF
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {/* DOCUMENT LIST (THIS FIXES YOUR ISSUE) */}
      <div className="mt-6 flex-1 space-y-2 overflow-y-auto">
        {documents.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No documents uploaded
          </p>
        ) : (
          documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDocument(doc)}
              className={`w-full rounded-lg p-3 text-left transition ${
                selectedDocument?.id === doc.id
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-800"
              }`}
            >
              📄 {doc.filename}
            </button>
          ))
        )}
      </div>

      {/* CLEAR (UI ONLY FOR NOW) */}
      <button className="mt-4 flex w-full items-center gap-3 rounded-lg p-3 hover:bg-zinc-800">
        <Trash2 size={18} />
        Clear Data
      </button>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="mt-auto flex items-center gap-3 rounded-lg p-3 hover:bg-zinc-800"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}