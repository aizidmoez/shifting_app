import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

type Booking = {
  id: number;
  pickup_address: string;
  dropoff_address: string;
  move_date: string;
  status: string;
  created_at: string;
};

export default async function AdminPage() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-red-600">Failed to load bookings.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">All booking requests</p>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Pickup</th>
              <th className="border px-4 py-2 text-left">Dropoff</th>
              <th className="border px-4 py-2 text-left">Move Date</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {bookings && bookings.length > 0 ? (
              bookings.map((booking: Booking) => (
                <tr key={booking.id}>
                  <td className="border px-4 py-2">{booking.id}</td>
                  <td className="border px-4 py-2">{booking.pickup_address}</td>
                  <td className="border px-4 py-2">{booking.dropoff_address}</td>
                  <td className="border px-4 py-2">{booking.move_date}</td>
                  <td className="border px-4 py-2">{booking.status}</td>
                  <td className="border px-4 py-2">
                    {new Date(booking.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border px-4 py-6 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}