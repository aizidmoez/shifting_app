import { NextResponse } from "next/server";

type SendQuoteBody = {
  customer_name: string | null;
  customer_email: string | null;
  quote_price: number;
  pickup_address: string;
  dropoff_address: string;
  move_date: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SendQuoteBody>;
    const customerName = body.customer_name?.trim() || "Customer";
    const customerEmail = body.customer_email?.trim();
    const quotePrice = body.quote_price;
    const pickupAddress = body.pickup_address?.trim() || "-";
    const dropoffAddress = body.dropoff_address?.trim() || "-";
    const moveDate = body.move_date?.trim() || "-";

    if (!customerEmail || typeof quotePrice !== "number") {
      return NextResponse.json(
        { error: "customer_email and quote_price are required." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Missing RESEND_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const text = `Hello ${customerName},

Your moving quote is $${quotePrice}.

Pickup: ${pickupAddress}
Dropoff: ${dropoffAddress}
Move Date: ${moveDate}

Reply to this email or call us to confirm your booking.`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [customerEmail],
        subject: "Your moving quote",
        text,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      return NextResponse.json(
        { error: "Failed to send email.", details: resendError },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
