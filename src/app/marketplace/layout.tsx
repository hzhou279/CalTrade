import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CalTrade Marketplace",
  description: "Buy and sell items in the Berkeley community",
};

export default function MarketplaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen" style={{
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
      {children}
    </div>
  );
} 