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
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 