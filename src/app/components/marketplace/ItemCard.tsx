"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MarketplaceItem } from '../../../types/marketplace';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ItemDetailModal from './ItemDetailModal';

interface ItemCardProps {
  item: MarketplaceItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  // For multiple images, we'll use the local images we downloaded
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
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
    // Define different sizes for different categories with more compact heights
    switch (item.category) {
      case 'Vehicles':
        return {
          imageHeight: 160 * 1.5, // Increased by 1.5x
          cardHeight: 260 * 1.5, // Reduced height since we're removing description
          accentColor: '#3b82f6', // blue
          iconSize: 18
        };
      case 'Furniture':
        return {
          imageHeight: 140 * 1.5, // Increased by 1.5x
          cardHeight: 240 * 1.5, // Reduced height since we're removing description
          accentColor: '#8b5cf6', // purple
          iconSize: 16
        };
      case 'Electronics':
        return {
          imageHeight: 130 * 1.5, // Increased by 1.5x
          cardHeight: 220 * 1.5, // Reduced height since we're removing description
          accentColor: '#10b981', // green
          iconSize: 16
        };
      case 'Clothing':
        return {
          imageHeight: 140 * 1.5, // Increased by 1.5x
          cardHeight: 220 * 1.5, // Reduced height since we're removing description
          accentColor: '#f43f5e', // pink
          iconSize: 16
        };
      case 'Books':
        return {
          imageHeight: 130 * 1.5, // Increased by 1.5x
          cardHeight: 210 * 1.5, // Reduced height since we're removing description
          accentColor: '#f59e0b', // amber
          iconSize: 14
        };
      case 'Accessories':
        return {
          imageHeight: 120 * 1.5, // Increased by 1.5x
          cardHeight: 200 * 1.5, // Reduced height since we're removing description
          accentColor: '#ec4899', // pink
          iconSize: 14
        };
      case 'Photography':
        return {
          imageHeight: 140 * 1.5, // Increased by 1.5x
          cardHeight: 220 * 1.5, // Reduced height since we're removing description
          accentColor: '#6366f1', // indigo
          iconSize: 16
        };
      case 'Audio':
        return {
          imageHeight: 130 * 1.5, // Increased by 1.5x
          cardHeight: 210 * 1.5, // Reduced height since we're removing description
          accentColor: '#0ea5e9', // sky blue
          iconSize: 16
        };
      case 'Sports':
        return {
          imageHeight: 140 * 1.5, // Increased by 1.5x
          cardHeight: 220 * 1.5, // Reduced height since we're removing description
          accentColor: '#ef4444', // red
          iconSize: 16
        };
      case 'Kitchen':
        return {
          imageHeight: 130 * 1.5, // Increased by 1.5x
          cardHeight: 210 * 1.5, // Reduced height since we're removing description
          accentColor: '#f97316', // orange
          iconSize: 16
        };
      case 'Home & Garden':
        return {
          imageHeight: 140 * 1.5, // Increased by 1.5x
          cardHeight: 220 * 1.5, // Reduced height since we're removing description
          accentColor: '#22c55e', // green
          iconSize: 16
        };
      case 'Toys & Games':
        return {
          imageHeight: 130 * 1.5, // Increased by 1.5x
          cardHeight: 210 * 1.5, // Reduced height since we're removing description
          accentColor: '#a855f7', // purple
          iconSize: 16
        };
      default:
        return {
          imageHeight: 130 * 1.5, // Increased by 1.5x
          cardHeight: 210 * 1.5, // Reduced height since we're removing description
          accentColor: '#4f46e5', // indigo
          iconSize: 16
        };
    }
  };

  const { imageHeight, cardHeight, accentColor, iconSize } = getCategoryStyles();

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showModal]);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col relative cursor-pointer"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          cursor: "pointer",
          border: `2px solid ${accentColor}40`,
          height: `${cardHeight}px`, // Fixed height based on category
          width: "100%", // Take full width of parent
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
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
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
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
            padding: "4px 10px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontWeight: "500",
            zIndex: 5
          }}>
            {item.condition}
          </div>
        </div>
        
        <div style={{ 
          padding: "16px", 
          flex: "1", 
          display: "flex", 
          flexDirection: "column",
          height: `${cardHeight - imageHeight - 28}px` // Calculate content height (28px for footer)
        }}>
          <h3 style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "6px",
            color: "#111827",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.3"
          }}>
            {item.title}
          </h3>
          <p style={{
            fontSize: "18px",
            fontWeight: "700",
            color: accentColor
          }}>
            ${item.price.toLocaleString()}
          </p>
        </div>
        
        <div style={{
          padding: "8px 16px",
          borderTop: `1px solid ${accentColor}25`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "12px",
          color: "#6b7280",
          height: "36px"
        }}>
          <span>{item.location}</span>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      
      {/* Item Detail Modal */}
      {showModal && (
        <ItemDetailModal 
          item={item} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
} 