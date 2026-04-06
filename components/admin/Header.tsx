
export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-xl font-semibold text-red-600">Dashboard</h1>

      <div className="flex items-center gap-3">
        {/* <Image
          src="https://i.pravatar.cc/40"
          alt="User avatar"
          className="w-9 h-9 rounded-full"
          width={40}
          height={40}
        /> */}
      </div>
    </header>
  );
}