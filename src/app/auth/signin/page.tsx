"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OTPInput, SlotProps } from "input-otp";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { PhoneIcon, ArrowRightIcon, CheckCircleIcon, Loader2Icon, MessageSquareIcon } from "lucide-react";
import { cn } from "../../lib/utils";

// Phone number validation schema
const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, {
  message: "Please enter a valid phone number (e.g., +1234567890)"
});

// SMS verification code validation
const verificationCodeSchema = z.string().length(6, {
  message: "Verification code must be 6 digits"
}).regex(/^\d+$/, {
  message: "Verification code must contain only numbers"
});

export default function SignIn() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isCodeSent]);

  // Send verification code
  const handleSendCode = async () => {
    setError("");
    
    try {
      // Validate phone number
      phoneSchema.parse(phone);
      
      setIsLoading(true);
      
      // Call the SMS API
      const response = await fetch("/api/auth/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }
      
      setIsCodeSent(true);
      
      // Start countdown for resend (60 seconds)
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message || "Please enter a valid phone number");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle phone login
  const handlePhoneLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    
    try {
      // Validate inputs
      phoneSchema.parse(phone);
      verificationCodeSchema.parse(code);
      
      setIsLoading(true);
      
      // Sign in with phone credentials
      const result = await signIn("phone-login", {
        phone,
        code,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Show success state briefly before redirecting
      setIsSuccess(true);
      setTimeout(() => {
        // Redirect to home page on success
        router.push("/");
      }, 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message || "Please check your phone number and verification code");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Authentication failed");
      }
      setIsLoading(false);
    }
  };

  // Handle WeChat login
  const handleWeChatLogin = () => {
    signIn("wechat", { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[hsl(var(--background))] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">CalTrade</h1>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Your trusted marketplace for secure trading</p>
        </div>
        
        <Card className="w-full shadow-lg border-[hsl(var(--border))]">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border))]"
                aria-hidden="true"
              >
                {isSuccess ? (
                  <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
                ) : (
                  <PhoneIcon className="h-6 w-6 text-[hsl(var(--foreground))/80]" />
                )}
              </div>
              
              <CardTitle className="text-xl font-semibold tracking-tight">
                {!isCodeSent && !isSuccess && "Phone Verification"}
                {isCodeSent && !isSuccess && "Enter Verification Code"}
                {isSuccess && "Verification Complete"}
              </CardTitle>
              
              <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
                {!isCodeSent && !isSuccess && "Please enter your phone number to receive a verification code"}
                {isCodeSent && !isSuccess && `We've sent a code to ${phone}. Enter it below.`}
                {isSuccess && "You have successfully verified your phone number."}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive))] p-4 rounded-md flex items-start gap-3">
                <div className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5">⚠️</div>
                <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
              </div>
            )}
            
            {!isCodeSent && !isSuccess && (
              <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Enter your phone number with country code
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading || !phone}
                  className="w-full h-11"
                >
                  {isLoading ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
            
            {isCodeSent && !isSuccess && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <div className="flex justify-center py-2">
                    <OTPInput
                      id="verification-code"
                      value={code}
                      onChange={setCode}
                      maxLength={6}
                      containerClassName="flex items-center gap-2 has-[:disabled]:opacity-50"
                      onComplete={handlePhoneLogin}
                      render={({ slots }) => (
                        <div className="flex gap-2">
                          {slots.map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                          ))}
                        </div>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={() => handlePhoneLogin()} 
                    disabled={code.length !== 6 || isLoading}
                    className="w-full h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  
                  <div className="flex justify-center gap-4 text-sm">
                    <button 
                      type="button"
                      className="text-sm text-[hsl(var(--primary))] hover:underline"
                      onClick={() => {
                        setIsCodeSent(false);
                        setCode("");
                      }}
                    >
                      Change number
                    </button>
                    <span className="text-[hsl(var(--muted-foreground))]">•</span>
                    <button 
                      type="button"
                      className="text-sm text-[hsl(var(--primary))] hover:underline disabled:opacity-50 disabled:no-underline"
                      disabled={countdown > 0 || isLoading}
                      onClick={handleSendCode}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {isSuccess && (
              <div className="flex justify-center py-4">
                <div className="animate-pulse text-emerald-500 text-center">
                  <CheckCircleIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>Redirecting to your account...</p>
                </div>
              </div>
            )}
          </CardContent>
          
          {!isSuccess && (
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[hsl(var(--border))]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-[hsl(var(--card))] px-2 text-[hsl(var(--muted-foreground))]">Or continue with</span>
                </div>
              </div>

              <Button 
                onClick={handleWeChatLogin} 
                variant="outline" 
                className="w-full h-11 border-green-600 hover:bg-green-50 dark:hover:bg-green-950 text-green-600"
              >
                <MessageSquareIcon className="mr-2 h-4 w-4 text-green-600" />
                Sign in with WeChat
              </Button>
              
              <p className="text-xs text-center text-[hsl(var(--muted-foreground))] mt-4">
                By signing in, you agree to our{" "}
                <Link href="/terms" className="text-[hsl(var(--primary))] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[hsl(var(--primary))] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "flex h-12 w-10 items-center justify-center rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-base font-medium shadow-sm transition-all",
        props.isActive && "z-10 border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary))/20]"
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
} 