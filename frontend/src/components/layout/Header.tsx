import { useState } from "react";

import { KeyRound } from "lucide-react";

import ApiKeyModal from "../modals/ApiKeyModal";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-end border-b border-zinc-800 p-4">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-[#10a37f] px-4 py-2"
        >
          <KeyRound size={18} />

          API Key
        </button>
      </header>

      <ApiKeyModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}