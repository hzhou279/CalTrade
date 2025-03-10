"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../../components/ui/card";
import { Phone, Lock, AlertCircle, Loader2, ArrowRight, MessageSquare } from "lucide-react";

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
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      // Redirect to home page on success
      router.push("/");
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
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--background))]">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--primary))]">CalTrade</h1>
          <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">Your trusted marketplace for secure trading</p>
        </div>
        
        <Card className="w-full shadow-lg border-[hsl(var(--border))]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center text-[hsl(var(--muted-foreground))]">
              Enter your phone number to receive a verification code
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive))] p-4 rounded-md flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
              </div>
            )}
            
            <form className="space-y-4" onSubmit={handlePhoneLogin}>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-[hsl(var(--foreground))]">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] pl-10 pr-3 py-2 text-sm text-[hsl(var(--foreground))] ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isCodeSent && isLoading}
                  />
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Enter your phone number with country code
                </p>
              </div>
              
              {isCodeSent && (
                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-[hsl(var(--foreground))]">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      maxLength={6}
                      className="flex h-10 w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] pl-10 pr-3 py-2 text-sm text-[hsl(var(--foreground))] ring-offset-[hsl(var(--background))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 tracking-widest font-mono"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>
              )}

              <div className="pt-2">
                {!isCodeSent ? (
                  <Button 
                    type="button" 
                    onClick={handleSendCode} 
                    disabled={isLoading || !phone}
                    className="w-full h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Verification Code
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isLoading || !code || code.length < 6}
                    className="w-full h-11"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
                
                {isCodeSent && (
                  <div className="mt-3 text-center">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="text-xs"
                      disabled={countdown > 0 || isLoading}
                      onClick={handleSendCode}
                    >
                      {countdown > 0 ? `Resend code in ${countdown}s` : "Resend verification code"}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
          
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
              <MessageSquare className="mr-2 h-4 w-4 text-green-600" />
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
        </Card>
      </div>
    </div>
  );
} 