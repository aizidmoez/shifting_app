"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: number;
  customer_name: string | null;
  customer_phone: string | null;
  assigned_to: string | null;
  admin_notes: string | null;
  pickup_address: string;
  dropoff_address: string;
  move_date: string;
  quote_price: number | null;
  status: string | null;
};

export default function CalendarPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "id, customer_name, customer_phone, assigned_to, admin_notes, pickup_address, dropoff_address, move_date, quote_price, status"
      )
      .order("move_date", { ascending: true });

    if (!error && data) {
      setBookings(data);
    }

    setLoading(false);
  }

  function getStatusClasses(status: string | null) {
    const normalized = status ?? "pending";
    if (normalized === "quoted") {
      return "bg-blue-100 text-blue-700";
    }
    if (normalized === "booked") {
      return "bg-purple-100 text-purple-700";
    }
    if (normalized === "completed") {
      return "bg-green-100 text-green-700";
    }
    return "bg-yellow-100 text-yellow-700";
  }

  const groupedBookings = useMemo(() => {
    const groups: Record<string, Booking[]> = {};

    for (const booking of bookings) {
      const dateKey = booking.move_date || "Unknown date";
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(booking);
    }

    return Object.entries(groups).sort((a, b) => {
      if (a[0] === "Unknown date") return 1;
      if (b[0] === "Unknown date") return -1;
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });
  }, [bookings]);

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Bookings Calendar</h1>
          <p className="mt-2 text-gray-600">Bookings grouped by move date</p>
        </div>
        <Link
          href="/admin"
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Admin
        </Link>
      </div>

      {loading ? (
        <div className="rounded border border-gray-200 p-6 text-center">Loading...</div>
      ) : groupedBookings.length === 0 ? (
        <div className="rounded border border-gray-200 p-6 text-center text-gray-500">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-6">
          {groupedBookings.map(([date, items]) => (
            <section key={date} className="rounded border border-gray-200">
              <div className="border-b bg-gray-50 px-4 py-3">
                <h2 className="text-lg font-semibold">
                  {date === "Unknown date"
                    ? date
                    : new Date(date).toLocaleDateString()}
                </h2>
              </div>
              <div className="divide-y">
                {items.map((booking) => (
                  <div key={booking.id} className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{booking.customer_name ?? "Unknown customer"}</p>
                      <p className="text-gray-600">{booking.customer_phone ?? "-"}</p>
                      <p>
                        <span className="font-medium">Assigned To:</span>{" "}
                        {booking.assigned_to ?? "-"}
                      </p>
                      <p>
                        <span className="font-medium">Notes:</span>{" "}
                        {booking.admin_notes ?? "-"}
                      </p>
                      <p>
                        <span className="font-medium">Pickup:</span> {booking.pickup_address}
                      </p>
                      <p>
                        <span className="font-medium">Dropoff:</span> {booking.dropoff_address}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">
                        {booking.quote_price === null ? "No quote" : `$${booking.quote_price}`}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status ?? "pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
