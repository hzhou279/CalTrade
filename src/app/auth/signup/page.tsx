"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { Mail as MailIcon, Lock as LockIcon, User as UserIcon, ArrowLeft } from "lucide-react";

// Email validation schema
const emailSchema = z.string().email({
  message: "Please enter a valid email address"
});

// Password validation schema
const passwordSchema = z.string().min(6, {
  message: "Password must be at least 6 characters long"
});

// Name validation schema
const nameSchema = z.string().min(2, {
  message: "Name must be at least 2 characters long"
});

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Replace with a useEffect that only sets a min-height for mobile devices
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

  // Handle sign up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      // Validate inputs
      nameSchema.parse(name);
      emailSchema.parse(email);
      passwordSchema.parse(password);
      
      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      setIsLoading(true);
      
      // Call the API to create a new user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }
      
      // Show success state briefly before redirecting
      setIsSuccess(true);
      setTimeout(() => {
        // Redirect to sign-in page
        router.push("/auth/signin?email=" + encodeURIComponent(email));
      }, 2000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create account");
      }
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg, #0f766e 0%, #1e40af 50%, #7e22ce 100%)",
      position: "relative"
    }}>
      {/* Background Decoration */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at bottom right, rgba(255,255,255,0.15), transparent)"
      }}></div>
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent)"
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
        <div style={{ 
          width: "100%", 
          maxWidth: "480px",
          backgroundColor: "white", 
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          margin: "auto"
        }}>
          {/* Card Header with Decorative Element */}
          <div style={{ 
            backgroundColor: "#0f766e", 
            padding: "24px", 
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "150px",
              height: "150px",
              background: "radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 70%)",
              borderRadius: "0 0 0 100%"
            }}></div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              <Link href="/auth/signin" style={{ color: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", textDecoration: "none" }}>
                <ArrowLeft size={16} style={{ marginRight: "4px" }} />
                <span style={{ fontSize: "14px" }}>Back to Sign In</span>
              </Link>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "white", marginBottom: "8px" }}>
              Join CalTrade Today
            </h1>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", marginBottom: "0" }}>
              Create your account to start trading
            </p>
          </div>
          
          {/* Card Content */}
          {isSuccess ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                borderRadius: "50%", 
                backgroundColor: "#ecfdf5", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                margin: "0 auto 24px"
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#111827", marginBottom: "12px" }}>
                Account Created Successfully!
              </h2>
              <p style={{ fontSize: "16px", color: "#6b7280", marginBottom: "16px" }}>
                You will be redirected to the sign-in page shortly.
              </p>
            </div>
          ) : (
            <div style={{ padding: "32px" }}>
              {/* Error Message */}
              {error && (
                <div style={{
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px"
                }}>
                  <span style={{ color: "#ef4444" }}>⚠️</span>
                  <p style={{ margin: 0, fontSize: "14px", color: "#b91c1c" }}>{error}</p>
                </div>
              )}
              
              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="name" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                    Full Name
                  </label>
                  <div style={{ position: "relative" }}>
                    <UserIcon style={{ 
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      color: "#0f766e"
                    }} />
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        height: "48px",
                        paddingLeft: "40px",
                        paddingRight: "12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "15px",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#0f766e";
                        e.target.style.boxShadow = "0 0 0 2px rgba(15, 118, 110, 0.2)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#d1d5db";
                        e.target.style.boxShadow = "none";
                      }}
                      required
                    />
                  </div>
                </div>
                
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
                      color: "#0f766e"
                    }} />
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        height: "48px",
                        paddingLeft: "40px",
                        paddingRight: "12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "15px",
                        outline: "none"
                      }}
                      required
                    />
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="password" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <LockIcon style={{ 
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      color: "#0f766e"
                    }} />
                    <input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        height: "48px",
                        paddingLeft: "40px",
                        paddingRight: "12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "15px",
                        outline: "none"
                      }}
                      required
                      minLength={6}
                    />
                  </div>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0" }}>
                    Password must be at least 6 characters long
                  </p>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label htmlFor="confirmPassword" style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <LockIcon style={{ 
                      position: "absolute", 
                      left: "12px", 
                      top: "50%", 
                      transform: "translateY(-50%)",
                      width: "20px",
                      height: "20px",
                      color: "#0f766e"
                    }} />
                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        height: "48px",
                        paddingLeft: "40px",
                        paddingRight: "12px",
                        borderRadius: "8px",
                        border: "1px solid #d1d5db",
                        fontSize: "15px",
                        outline: "none"
                      }}
                      required
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
                    backgroundColor: "#0f766e",
                    color: "white",
                    padding: "14px 16px",
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px rgba(15, 118, 110, 0.25)",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: "16px",
                    height: "52px",
                    width: "100%",
                    opacity: isLoading ? 0.7 : 1,
                    marginTop: "12px",
                    transition: "transform 0.2s, background-color 0.2s"
                  }}
                  onMouseOver={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#0e6b63";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isLoading) {
                      e.currentTarget.style.backgroundColor = "#0f766e";
                      e.currentTarget.style.transform = "none";
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <span style={{ display: "inline-block", width: "18px", height: "18px", borderRadius: "50%", border: "2px solid white", borderTopColor: "transparent", animation: "spin 1s linear infinite", marginRight: "8px" }}></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                
                <div style={{ 
                  textAlign: "center", 
                  marginTop: "16px",
                  padding: "16px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "8px"
                }}>
                  <span style={{ fontSize: "15px", color: "#4b5563" }}>
                    Already have an account?{" "}
                    <Link href="/auth/signin" style={{ color: "#0f766e", textDecoration: "none", fontWeight: 600 }}>
                      Sign in
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          )}
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