"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Booking = {
  id: number;
  pickup_address: string;
  dropoff_address: string;
  move_date: string;
  status: string | null;
  quote_price: number | null;
  created_at: string;
};

const statusOptions = ["pending", "quoted", "booked", "completed"];
type StatusFilter = "all" | "pending" | "quoted" | "booked" | "completed";

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteInputs, setQuoteInputs] = useState<Record<number, string>>({});

  async function loadBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookings(data);
      const initialQuotes: Record<number, string> = {};
      data.forEach((booking: Booking) => {
        initialQuotes[booking.id] =
          booking.quote_price === null ? "" : String(booking.quote_price);
      });
      setQuoteInputs(initialQuotes);
    }

    setLoading(false);
  }

  async function updateStatus(id: number, newStatus: string) {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      alert("Failed to update status.");
      return;
    }

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status: newStatus } : booking
      )
    );
  }

  async function updateQuotePrice(booking: Booking, value: string) {
    const trimmedValue = value.trim();
    const price = trimmedValue === "" ? null : Number(trimmedValue);

    if (trimmedValue !== "" && Number.isNaN(price)) {
      alert("Please enter a valid number.");
      return;
    }

    const shouldPromoteStatus =
      price !== null && (booking.status ?? "pending") === "pending";

    if (booking.quote_price === price && !shouldPromoteStatus) {
      return;
    }

    const updatePayload: { quote_price: number | null; status?: string } = {
      quote_price: price,
    };

    if (shouldPromoteStatus) {
      updatePayload.status = "quoted";
    }

    const { error } = await supabase
      .from("bookings")
      .update(updatePayload)
      .eq("id", booking.id);

    if (error) {
      alert("Failed to update quote price.");
      return;
    }

    setBookings((prev) =>
      prev.map((item) =>
        item.id === booking.id
          ? {
              ...item,
              quote_price: price,
              status:
                updatePayload.status !== undefined
                  ? updatePayload.status
                  : item.status,
            }
          : item
      )
    );

    setQuoteInputs((prev) => ({
      ...prev,
      [booking.id]: price === null ? "" : String(price),
    }));
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

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredBookings = bookings.filter((booking) => {
    const bookingStatus = (booking.status ?? "pending") as StatusFilter;
    const matchesStatus = statusFilter === "all" || bookingStatus === statusFilter;
    const matchesSearch =
      normalizedSearch === "" ||
      booking.pickup_address.toLowerCase().includes(normalizedSearch) ||
      booking.dropoff_address.toLowerCase().includes(normalizedSearch);
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">All booking requests</p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", ...statusOptions] as StatusFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatusFilter(option)}
              className={`rounded border px-3 py-1.5 text-sm capitalize transition ${
                statusFilter === option
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search pickup or dropoff..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm md:w-80"
        />
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">ID</th>
              <th className="border px-4 py-2 text-left">Pickup</th>
              <th className="border px-4 py-2 text-left">Dropoff</th>
              <th className="border px-4 py-2 text-left">Move Date</th>
              <th className="border px-4 py-2 text-left">Price</th>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="border px-4 py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="border px-4 py-2">{booking.id}</td>
                  <td className="border px-4 py-2">{booking.pickup_address}</td>
                  <td className="border px-4 py-2">{booking.dropoff_address}</td>
                  <td className="border px-4 py-2">{booking.move_date}</td>
                  <td className="border px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-28 rounded border p-2"
                        value={quoteInputs[booking.id] ?? ""}
                        onChange={(e) =>
                          setQuoteInputs((prev) => ({
                            ...prev,
                            [booking.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="rounded bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                        onClick={() =>
                          updateQuotePrice(booking, quoteInputs[booking.id] ?? "")
                        }
                      >
                        Save
                      </button>
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {booking.status ?? "pending"}
                      </span>
                      <select
                        className="rounded border p-2"
                        value={booking.status ?? "pending"}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(booking.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border px-4 py-6 text-center text-gray-500">
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