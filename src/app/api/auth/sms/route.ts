import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Phone number validation schema
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// Generate a random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate phone number
    const { phone } = body;
    
    try {
      phoneSchema.parse(phone);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid phone number format" },
        { status: 400 }
      );
    }

    // In a production environment, we would:
    // 1. Check rate limiting with Redis
    // 2. Generate and store verification code in Redis
    // 3. Send SMS via Twilio
    
    // For development/testing, we'll simulate success
    const verificationCode = generateVerificationCode();
    
    console.log(`[DEV MODE] Generated verification code for ${phone}: ${verificationCode}`);
    
    // In development, we'll return the code in the response (NEVER do this in production)
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({ 
        success: true,
        devCode: verificationCode // Only for development!
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SMS verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
} 