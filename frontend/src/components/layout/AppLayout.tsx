import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({
  children,
}: Props) {
  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}