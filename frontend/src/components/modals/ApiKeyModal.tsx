import { useState } from "react";

import { saveApiKey } from "../../api/settings";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ApiKeyModal({
  open,
  onClose,
}: Props) {
  const [apiKey, setApiKey] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (!open) return null;

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await saveApiKey(apiKey.trim());

      setApiKey("");

      onClose();
    } catch (err) {
      console.error(err);

      setError(
        "Failed to save API key"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-[#2a2a2a] p-6">

        <h2 className="mb-4 text-xl font-semibold">
          Add Groq API Key
        </h2>

        <input
          type="password"
          value={apiKey}
          onChange={(e) =>
            setApiKey(e.target.value)
          }
          placeholder="gsk_..."
          className="w-full rounded-lg border border-zinc-700 bg-[#303030] p-3 outline-none"
        />

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-zinc-300 hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg bg-[#10a37f] px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>

        </div>
      </div>
    </div>
  );
}