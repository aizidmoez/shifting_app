import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">Shifting App</h1>

      <p className="text-lg text-gray-600">
        Book movers and vehicles instantly
      </p>

      <Link
        href="/book"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Book a Move
      </Link>
    </main>
  );
}