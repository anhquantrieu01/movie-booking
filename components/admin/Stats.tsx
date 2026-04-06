export function Stats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Movies" value="24" />
      <StatCard title="Showtimes" value="120" />
      <StatCard title="Users" value="3,200" />
      <StatCard title="Revenue" value="$12,300" />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-red-600">{value}</p>
    </div>
  );
}