"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookPage() {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
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
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
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
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
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
          name="customer_name"
          className="rounded border p-3"
          placeholder="Full name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <input
          name="customer_email"
          className="rounded border p-3"
          type="email"
          placeholder="Email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />

        <input
          name="customer_phone"
          className="rounded border p-3"
          type="tel"
          placeholder="Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />

        <input
          name="pickup_address"
          className="rounded border p-3"
          placeholder="Pickup address"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />

        <input
          name="dropoff_address"
          className="rounded border p-3"
          placeholder="Dropoff address"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
          required
        />

        <input
          name="move_date"
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