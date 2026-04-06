export function BookingTable() {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold text-red-600 mb-4">
        Recent Bookings
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">User</th>
              <th className="py-2">Movie</th>
              <th className="py-2">Seat</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            <Row user="John" movie="Avengers" seat="A5" status="Confirmed" />
            <Row user="Anna" movie="Batman" seat="B2" status="Pending" />
            <Row user="Mike" movie="Spider Man" seat="C8" status="Confirmed" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({
  user,
  movie,
  seat,
  status,
}: {
  user: string;
  movie: string;
  seat: string;
  status: string;
}) {
  return (
    <tr>
      <td className="py-3">{user}</td>
      <td>{movie}</td>
      <td>{seat}</td>
      <td>
        <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
          {status}
        </span>
      </td>
    </tr>
  );
}