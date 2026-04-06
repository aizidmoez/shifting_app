"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookPage() {
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("bookings").insert([
      {
        pickup_address: pickupAddress,
        dropoff_address: dropoffAddress,
        move_date: moveDate,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Something went wrong. Booking was not saved.");
      setLoading(false);
      return;
    }

    setMessage("Booking request submitted successfully.");
    setPickupAddress("");
    setDropoffAddress("");
    setMoveDate("");
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6">
      <h1 className="text-4xl font-bold">Book a Move</h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4"
      >
        <input
          className="rounded border p-3"
          placeholder="Pickup address"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />

        <input
          className="rounded border p-3"
          placeholder="Dropoff address"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          required
        />

        <input
          className="rounded border p-3"
          type="date"
          value={moveDate}
          onChange={(e) => setMoveDate(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black p-3 text-white disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Request Move"}
        </button>
      </form>

      {message && <p className="text-sm text-gray-700">{message}</p>}
    </main>
  );
}