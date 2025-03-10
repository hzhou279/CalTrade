"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OTPInput, SlotProps } from "input-otp";
import { PhoneIcon, ArrowRightIcon, CheckCircleIcon, Loader2Icon, MailIcon, LockIcon } from "lucide-react";
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

// Email validation schema
const emailSchema = z.string().email({
  message: "Please enter a valid email address"
});

export default function SignIn() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set viewport height for mobile browsers (handles mobile address bar issues)
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    
    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  useEffect(() => {
    if (isCodeSent) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isCodeSent]);

  // Check for email parameter in URL when component mounts
  useEffect(() => {
    // Get email from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      // Set email from URL parameter
      setEmail(emailParam);
      // Switch to email login method
      setLoginMethod("email");
    }
  }, []);

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

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Validate email
      emailSchema.parse(email);
      
      // Validate password (minimum length)
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      
      setIsLoading(true);
      
      // Sign in with email credentials
      const result = await signIn("email-login", {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      // Show success state briefly before redirecting
      setIsSuccess(true);
      setTimeout(() => {
        // Redirect to admin dashboard for admin users, home page for regular users
        router.push("/admin/dashboard");
      }, 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message || "Please check your email");
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
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #4f46e5 0%, #7e22ce 50%, #ec4899 100%)",
      position: "relative"
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
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        position: "relative",
        zIndex: 10,
        overflowY: "auto"
      }}>
        {/* Card Container */}
        <div style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          margin: "auto"
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
            
            {/* Login Method Tabs */}
            <div style={{ 
              display: "flex", 
              borderBottom: "1px solid #e5e7eb", 
              marginBottom: "24px" 
            }}>
              <button 
                onClick={() => setLoginMethod("phone")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "none",
                  border: "none",
                  borderBottom: loginMethod === "phone" ? "2px solid #3b82f6" : "none",
                  color: loginMethod === "phone" ? "#3b82f6" : "#6b7280",
                  fontWeight: loginMethod === "phone" ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                Phone
              </button>
              <button 
                onClick={() => setLoginMethod("email")}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "none",
                  border: "none",
                  borderBottom: loginMethod === "email" ? "2px solid #3b82f6" : "none",
                  color: loginMethod === "email" ? "#3b82f6" : "#6b7280",
                  fontWeight: loginMethod === "email" ? 600 : 400,
                  cursor: "pointer"
                }}
              >
                Email
              </button>
            </div>
            
            {/* Card Content */}
            {loginMethod === "phone" && !isCodeSent && !isSuccess && (
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
            
            {/* Email Login Form */}
            {loginMethod === "email" && !isSuccess && (
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
                </div>
                
                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }}></div>
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>or continue with email</span>
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
                
                {/* Email Form */}
                <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label htmlFor="email" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                      Email
                    </label>
                    <div style={{ position: "relative" }}>
                      <MailIcon style={{ 
                        position: "absolute", 
                        left: "12px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        color: "#9ca3af"
                      }} />
                      <input
                        id="email"
                        type="email"
                        placeholder="admin@caltrade.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label htmlFor="password" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                        Password
                      </label>
                      <a href="#" style={{ fontSize: "14px", color: "#3b82f6", textDecoration: "none" }}>
                        Forgot password?
                      </a>
                    </div>
                    <div style={{ position: "relative" }}>
                      <LockIcon style={{ 
                        position: "absolute", 
                        left: "12px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        width: "20px",
                        height: "20px",
                        color: "#9ca3af"
                      }} />
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoading}
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
                      cursor: isLoading ? "not-allowed" : "pointer",
                      fontWeight: 500,
                      height: "48px",
                      width: "100%",
                      opacity: isLoading ? 0.7 : 1
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span style={{ display: "inline-block", width: "16px", height: "16px", borderRadius: "50%", border: "2px solid white", borderTopColor: "transparent", animation: "spin 1s linear infinite", marginRight: "8px" }}></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </button>
                  
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>
                      Don't have an account?
                    </span>
                    <div style={{ marginTop: "12px" }}>
                      <button 
                        onClick={() => router.push("/auth/signup")}
                        style={{ 
                          display: "inline-block",
                          width: "100%",
                          padding: "10px 0",
                          backgroundColor: "#f3f4f6",
                          color: "#4f46e5",
                          fontWeight: "600",
                          textAlign: "center",
                          borderRadius: "8px",
                          border: "2px solid #4f46e5",
                          textDecoration: "none",
                          transition: "all 0.2s ease",
                          cursor: "pointer"
                        }}
                      >
                        Create an Account
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
            
            {/* Verification Code Step */}
            {loginMethod === "phone" && isCodeSent && !isSuccess && (
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
      
      {/* Footer */}
      <footer style={{
        padding: "16px 24px",
        textAlign: "center",
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: "14px",
        position: "relative",
        zIndex: 10
      }}>
        &copy; {new Date().getFullYear()} CalTrade. All rights reserved.
      </footer>
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

// Add the animation styles back
<style jsx global>{`
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