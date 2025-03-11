"use client";

import Image from 'next/image';
import Link from 'next/link';
import { MarketplaceItem } from '../../../types/marketplace';

interface ItemCardProps {
  item: MarketplaceItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/marketplace/${item.id}`} className="block">
      <div 
        className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 h-full flex flex-col relative cursor-pointer"
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer"
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "140px" }}>
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            padding: "2px 8px",
            borderRadius: "9999px",
            fontSize: "10px",
            fontWeight: "500"
          }}>
            {item.condition}
          </div>
        </div>
        <div style={{ padding: "12px", flex: "1" }}>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "4px",
            color: "#111827",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "4px",
            color: "#4f46e5"
          }}>
            ${item.price.toLocaleString()}
          </p>
          <p style={{
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "8px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.3"
          }}>
            {item.description}
          </p>
        </div>
        <div style={{
          padding: "8px 12px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#6b7280"
        }}>
          <span>{item.location}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
} 