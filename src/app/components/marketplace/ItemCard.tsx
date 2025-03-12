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

  // Determine card properties based on item category
  const getCategoryStyles = () => {
    // Define different sizes for different categories with much more variation
    switch (item.category) {
      case 'Vehicles':
        return {
          imageHeight: 180, // Larger image for vehicles
          descriptionLines: 12, // Show much more description
          cardHeight: 480, // Very tall card
          accentColor: '#3b82f6', // blue
          iconSize: 20
        };
      case 'Furniture':
        return {
          imageHeight: 160,
          descriptionLines: 8,
          cardHeight: 380,
          accentColor: '#8b5cf6', // purple
          iconSize: 18
        };
      case 'Electronics':
        return {
          imageHeight: 150,
          descriptionLines: 6,
          cardHeight: 320,
          accentColor: '#10b981', // green
          iconSize: 16
        };
      case 'Clothing':
        return {
          imageHeight: 160,
          descriptionLines: 4,
          cardHeight: 280,
          accentColor: '#f43f5e', // pink
          iconSize: 16
        };
      case 'Books':
        return {
          imageHeight: 140,
          descriptionLines: 3,
          cardHeight: 240,
          accentColor: '#f59e0b', // amber
          iconSize: 14
        };
      case 'Accessories':
        return {
          imageHeight: 130,
          descriptionLines: 2,
          cardHeight: 210,
          accentColor: '#ec4899', // pink
          iconSize: 14
        };
      case 'Photography':
        return {
          imageHeight: 160,
          descriptionLines: 7,
          cardHeight: 350,
          accentColor: '#6366f1', // indigo
          iconSize: 18
        };
      case 'Audio':
        return {
          imageHeight: 150,
          descriptionLines: 5,
          cardHeight: 300,
          accentColor: '#0ea5e9', // sky blue
          iconSize: 16
        };
      case 'Sports':
        return {
          imageHeight: 150,
          descriptionLines: 7,
          cardHeight: 340,
          accentColor: '#ef4444', // red
          iconSize: 18
        };
      case 'Kitchen':
        return {
          imageHeight: 140,
          descriptionLines: 6,
          cardHeight: 310,
          accentColor: '#f97316', // orange
          iconSize: 16
        };
      case 'Home & Garden':
        return {
          imageHeight: 150,
          descriptionLines: 8,
          cardHeight: 360,
          accentColor: '#22c55e', // green
          iconSize: 16
        };
      case 'Toys & Games':
        return {
          imageHeight: 140,
          descriptionLines: 4,
          cardHeight: 270,
          accentColor: '#a855f7', // purple
          iconSize: 16
        };
      default:
        return {
          imageHeight: 140,
          descriptionLines: 5,
          cardHeight: 300,
          accentColor: '#4f46e5', // indigo
          iconSize: 16
        };
    }
  };

  const { imageHeight, descriptionLines, cardHeight, accentColor, iconSize } = getCategoryStyles();

  // Calculate if the description is long enough to need truncation
  const needsTruncation = item.description.length > (descriptionLines * 40); // Rough estimate of characters per line

  return (
    <Link href={`/marketplace/${item.id}`} className="block h-full">
      <div 
        className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col relative cursor-pointer h-full"
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 1px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer",
          border: `1px solid ${accentColor}25`,
          height: `${cardHeight}px` // Fixed height based on category
        }}
      >
        <div style={{ 
          position: "relative", 
          width: "100%", 
          height: `${imageHeight}px`,
        }}>
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
                <ChevronLeft size={iconSize} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 hover:bg-white/90 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={iconSize} />
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
          
          {/* Category badge */}
          <div style={{
            position: "absolute",
            top: "8px",
            left: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            padding: "2px 8px",
            borderRadius: "9999px",
            fontSize: "10px",
            fontWeight: "500",
            color: accentColor,
            zIndex: 5
          }}>
            {item.category}
          </div>
          
          {/* Condition badge */}
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
        
        <div style={{ 
          padding: "12px", 
          flex: "1", 
          display: "flex", 
          flexDirection: "column",
          height: `${cardHeight - imageHeight - 31}px` // Calculate content height (31px for footer)
        }}>
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
            marginBottom: "8px",
            color: accentColor
          }}>
            ${item.price.toLocaleString()}
          </p>
          <div style={{
            flex: "1",
            overflow: "hidden",
            position: "relative"
          }}>
            <p style={{
              fontSize: "12px",
              color: "#6b7280",
              display: "-webkit-box",
              WebkitLineClamp: descriptionLines,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: "1.4",
              marginBottom: "4px"
            }}>
              {item.description}
            </p>
            {/* Only show gradient fade if description needs truncation */}
            {needsTruncation && (
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "24px",
                background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))"
              }}></div>
            )}
          </div>
        </div>
        
        <div style={{
          padding: "8px 12px",
          borderTop: `1px solid ${accentColor}25`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "10px",
          color: "#6b7280",
          height: "31px"
        }}>
          <span>{item.location}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
} 