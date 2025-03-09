import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import twilio from "twilio";
import { Redis } from "ioredis";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

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

    // Check rate limiting (max 5 SMS per phone number per hour)
    const rateLimitKey = `ratelimit:${phone}`;
    const currentCount = await redis.get(rateLimitKey);
    
    if (currentCount && parseInt(currentCount) >= 5) {
      return NextResponse.json(
        { error: "Too many SMS requests. Please try again later." },
        { status: 429 }
      );
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Store code in Redis with 10-minute expiration
    await redis.set(`verification:${phone}`, verificationCode, "EX", 600);
    
    // Increment rate limit counter
    if (currentCount) {
      await redis.incr(rateLimitKey);
    } else {
      await redis.set(rateLimitKey, "1", "EX", 3600); // 1 hour expiration
    }

    // Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Your verification code is: ${verificationCode}. It will expire in 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SMS verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code" },
      { status: 500 }
    );
  }
} 