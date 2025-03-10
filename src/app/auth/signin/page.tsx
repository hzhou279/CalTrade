"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OTPInput, SlotProps } from "input-otp";
import { PhoneIcon, ArrowRightIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaWeixin } from "react-icons/fa";
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
    // Prevent scrolling on the body
    document.body.style.overflow = "hidden";
    
    return () => {
      // Re-enable scrolling when component unmounts
      document.body.style.overflow = "";
    };
  }, []);

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

  // Handle Google login
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 50%, #ec4899 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Decoration */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent)"
      }}></div>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at bottom left, rgba(255,255,255,0.1), transparent)"
      }}></div>
      
      {/* Header */}
      <header style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 24px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "white"
        }}>
          CalTrade
        </div>
        <nav style={{
          display: "flex",
          gap: "24px"
        }}>
          <Link href="/" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Home</Link>
          <Link href="/about" style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>About</Link>
        </nav>
      </header>
      
      {/* Main Content */}
      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 5
      }}>
        {/* Card Container */}
        <div style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 16px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          position: "relative"
        }}>
          <div style={{ padding: "32px" }}>
            {/* Card Header */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h2 style={{ 
                fontSize: "30px", 
                fontWeight: "bold", 
                color: "#111827",
                margin: "0 0 8px 0"
              }}>
                Welcome to CalTrade
              </h2>
              <p style={{ 
                fontSize: "14px", 
                color: "#6b7280",
                margin: 0
              }}>
                Sign in to start trading in your local Chinese community.
              </p>
            </div>
            
            {/* Card Content */}
            {!isCodeSent && !isSuccess && (
              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Social Login Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <button 
                    onClick={handleGoogleLogin}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      fontWeight: 500,
                      height: "48px",
                      width: "100%"
                    }}
                  >
                    <FcGoogle style={{ marginRight: "8px", width: "20px", height: "20px" }} />
                    <span>Sign in with Google</span>
                  </button>
                  
                  <button 
                    onClick={handleWeChatLogin}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#10b981",
                      color: "white",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      fontWeight: 500,
                      height: "48px",
                      width: "100%"
                    }}
                  >
                    <FaWeixin style={{ marginRight: "8px", width: "20px", height: "20px" }} />
                    <span>Sign in with WeChat</span>
                  </button>
                </div>
                
                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }}></div>
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>or continue with phone</span>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }}></div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div style={{
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px"
                  }}>
                    <span style={{ color: "#ef4444" }}>⚠️</span>
                    <p style={{ margin: 0, fontSize: "14px", color: "#b91c1c" }}>{error}</p>
                  </div>
                )}
                
                {/* Phone Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="phone" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                      Phone Number
                    </label>
                    <div style={{ position: "relative" }}>
                      <PhoneIcon style={{ 
                        position: "absolute", 
                        left: "12px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        color: "#9ca3af"
                      }} />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          height: "44px",
                          paddingLeft: "40px",
                          paddingRight: "12px",
                          borderRadius: "8px",
                          border: "1px solid #d1d5db",
                          fontSize: "14px",
                          outline: "none"
                        }}
                        required
                      />
                    </div>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                      Enter your phone number with country code
                    </p>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isLoading || !phone}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      cursor: isLoading || !phone ? "not-allowed" : "pointer",
                      opacity: isLoading || !phone ? 0.7 : 1,
                      fontWeight: 500,
                      height: "44px",
                      width: "100%"
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon style={{ marginRight: "8px", width: "20px", height: "20px", animation: "spin 1s linear infinite" }} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRightIcon style={{ marginLeft: "8px", width: "20px", height: "20px" }} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
            
            {/* Verification Code Step */}
            {isCodeSent && !isSuccess && (
              <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ 
                    width: "64px", 
                    height: "64px", 
                    borderRadius: "50%", 
                    backgroundColor: "#dbeafe", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}>
                    <PhoneIcon style={{ width: "32px", height: "32px", color: "#3b82f6" }} />
                  </div>
                </div>
                
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>Verification Code</h3>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>We've sent a code to {phone}</p>
                </div>
                
                {error && (
                  <div style={{
                    backgroundColor: "#fee2e2",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px"
                  }}>
                    <span style={{ color: "#ef4444" }}>⚠️</span>
                    <p style={{ margin: 0, fontSize: "14px", color: "#b91c1c" }}>{error}</p>
                  </div>
                )}
                
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
                    <OTPInput
                      id="verification-code"
                      value={code}
                      onChange={setCode}
                      maxLength={6}
                      containerClassName="flex items-center gap-2"
                      onComplete={handlePhoneLogin}
                      render={({ slots }) => (
                        <div style={{ display: "flex", gap: "8px" }}>
                          {slots.map((slot, idx) => (
                            <Slot key={idx} {...slot} />
                          ))}
                        </div>
                      )}
                    />
                  </div>
                  
                  <button 
                    onClick={() => handlePhoneLogin()} 
                    disabled={code.length !== 6 || isLoading}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      cursor: code.length !== 6 || isLoading ? "not-allowed" : "pointer",
                      opacity: code.length !== 6 || isLoading ? 0.7 : 1,
                      fontWeight: 500,
                      height: "44px",
                      width: "100%"
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon style={{ marginRight: "8px", width: "20px", height: "20px", animation: "spin 1s linear infinite" }} />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Code</span>
                        <ArrowRightIcon style={{ marginLeft: "8px", width: "20px", height: "20px" }} />
                      </>
                    )}
                  </button>
                  
                  <div style={{ display: "flex", justifyContent: "center", gap: "16px", fontSize: "14px" }}>
                    <button 
                      type="button"
                      style={{
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textDecoration: "none",
                        fontSize: "14px"
                      }}
                      onClick={() => {
                        setIsCodeSent(false);
                        setCode("");
                      }}
                    >
                      Change number
                    </button>
                    <span style={{ color: "#9ca3af" }}>•</span>
                    <button 
                      type="button"
                      style={{
                        color: "#3b82f6",
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: countdown > 0 || isLoading ? "not-allowed" : "pointer",
                        opacity: countdown > 0 || isLoading ? 0.5 : 1,
                        textDecoration: "none",
                        fontSize: "14px"
                      }}
                      disabled={countdown > 0 || isLoading}
                      onClick={handleSendCode}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success State */}
            {isSuccess && (
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                padding: "24px 0",
                textAlign: "center"
              }}>
                <div style={{ animation: "pulse 2s infinite" }}>
                  <CheckCircleIcon style={{ 
                    width: "64px", 
                    height: "64px", 
                    color: "#10b981", 
                    margin: "0 auto 12px auto" 
                  }} />
                  <p style={{ fontSize: "18px", fontWeight: 500, color: "#111827", margin: "0 0 4px 0" }}>Verification successful!</p>
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Redirecting to your account...</p>
                </div>
              </div>
            )}
            
            {/* Footer */}
            <div style={{ 
              marginTop: "24px", 
              textAlign: "center", 
              fontSize: "14px", 
              color: "#6b7280" 
            }}>
              By signing in, you agree to our <Link href="/terms" style={{ color: "#3b82f6", textDecoration: "none" }}>Terms & Conditions</Link> and <Link href="/privacy" style={{ color: "#3b82f6", textDecoration: "none" }}>Privacy Policy</Link>.
            </div>
          </div>
        </div>
      </main>
      
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "44px",
        height: "44px",
        borderRadius: "8px",
        border: `1px solid ${props.isActive ? "#3b82f6" : "#d1d5db"}`,
        backgroundColor: "white",
        fontSize: "18px",
        fontWeight: 500,
        boxShadow: props.isActive ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "0 1px 2px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s"
      }}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
} 