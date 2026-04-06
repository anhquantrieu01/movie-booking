import HeaderServer from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderServer />
      {children}
    </>
  );
}