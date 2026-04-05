export default function BookPage() {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold">Book a Move</h1>
  
        <form className="flex flex-col gap-4 w-80">
          <input
            className="border p-2 rounded"
            placeholder="Pickup address"
          />
  
          <input
            className="border p-2 rounded"
            placeholder="Dropoff address"
          />
  
          <input
            className="border p-2 rounded"
            type="date"
          />
  
          <button className="bg-black text-white p-3 rounded">
            Request Move
          </button>
        </form>
      </main>
    );
  }