"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
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
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer"
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "200px" }}>
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: "500"
          }}>
            {item.condition}
          </div>
        </div>
        <div style={{ padding: "16px", flex: "1" }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#111827",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "8px",
            color: "#4f46e5"
          }}>
            ${item.price.toLocaleString()}
          </p>
          <p style={{
            fontSize: "14px",
            color: "#6b7280",
            marginBottom: "12px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {item.description}
          </p>
        </div>
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            {item.location}
          </span>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
} 