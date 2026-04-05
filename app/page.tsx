import Link from "next/link";

const services = [
  {
    title: "Small Move",
    description: "Perfect for single items, student rooms, or studio apartments.",
    price: "From £40/hour",
  },
  {
    title: "Standard Move",
    description: "Ideal for 1–2 bedroom flats with furniture and boxes.",
    price: "From £65/hour",
  },
  {
    title: "Large Move",
    description: "Best for family homes, bulky furniture, and full relocations.",
    price: "From £90/hour",
  },
];

const trustPoints = [
  "Trusted movers and drivers",
  "Transparent hourly pricing",
  "Same-day availability",
  "Support for small and large moves",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="px-6 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <span className="rounded-full border px-4 py-1 text-sm text-gray-600">
            Book movers and vehicles on demand
          </span>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight md:text-6xl">
            Fast and Reliable Help for Every Move
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Need a mover, a van, or both? Book trusted shifting help in minutes
            with simple hourly pricing.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/book"
              className="rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-90"
            >
              Book a Move
            </Link>

            <a
              href="#services"
              className="rounded-lg border border-black px-6 py-3 transition hover:bg-gray-50"
            >
              View Services
            </a>
          </div>
        </div>
      </section>

      <section id="services" className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Services for Every Move</h2>
            <p className="mt-3 text-gray-600">
              Start simple. Offer clear options people can understand instantly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <h3 className="text-2xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-gray-600">{service.description}</p>
                <p className="mt-6 text-lg font-bold">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold">Why People Would Trust This</h2>
            <p className="mt-3 text-gray-600">
              Moving is stressful. The site has to feel safe and clear.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="text-lg font-medium">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 p-10 text-center shadow-sm">
          <h2 className="text-3xl font-bold">Ready to book your move?</h2>
          <p className="mt-4 text-gray-600">
            Tell us where you are moving from, where you are going, and when you
            need help.
          </p>

          <div className="mt-8">
            <Link
              href="/book"
              className="rounded-lg bg-black px-6 py-3 text-white transition hover:opacity-90"
            >
              Go to Booking Form
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}