"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MarketplaceItem } from '../../../types/marketplace';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ItemCardProps {
  item: MarketplaceItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  // For multiple images, we'll use the local images we downloaded
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Extract the base name from the image URL
  const getBaseName = (url: string) => {
    // Extract the filename without extension
    const filename = url.split('/').pop() || '';
    return filename.split('.')[0];
  };
  
  const baseName = getBaseName(item.imageUrl);
  
  // Create array of image paths using the base name
  const images = [
    item.imageUrl,
    `/images/marketplace/${baseName}-alt1.jpg`,
    `/images/marketplace/${baseName}-alt2.jpg`,
  ];
  
  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Determine number of lines to show based on description length
  const getDescriptionLines = () => {
    const length = item.description.length;
    if (length < 100) return 2;
    if (length < 200) return 3;
    if (length < 400) return 4;
    return 5;
  };

  const descriptionLines = getDescriptionLines();

  return (
    <Link href={`/marketplace/${item.id}`} className="block h-full">
      <div 
        className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col relative cursor-pointer h-full"
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer"
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "140px" }}>
          <Image
            src={images[currentImageIndex]}
            alt={item.title}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Image navigation buttons */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
              
              {/* Image indicators */}
              <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                {images.map((_, index) => (
                  <span 
                    key={index} 
                    className={`inline-block h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
          
          <div style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            padding: "2px 8px",
            borderRadius: "9999px",
            fontSize: "10px",
            fontWeight: "500",
            zIndex: 5
          }}>
            {item.condition}
          </div>
        </div>
        
        <div style={{ padding: "12px", flex: "1", display: "flex", flexDirection: "column" }}>
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
          <div style={{
            flex: "1",
            overflow: "hidden",
            position: "relative",
            minHeight: `${descriptionLines * 1.3}em` // Set minimum height based on number of lines
          }}>
            <p style={{
              fontSize: "12px",
              color: "#6b7280",
              display: "-webkit-box",
              WebkitLineClamp: descriptionLines,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.3",
              marginBottom: "4px"
            }}>
              {item.description}
            </p>
            {/* Only show gradient fade if description is longer than displayed lines */}
            {item.description.length > 50 && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "20px",
                background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))"
              }}></div>
            )}
          </div>
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