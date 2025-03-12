"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
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
  const [animating, setAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
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

  // Handle card click with animation
  const handleCardClick = () => {
    if (!animating) {
      setAnimating(true);
      
      // Start the animation sequence
      if (cardRef.current) {
        // Initial subtle scale
        cardRef.current.style.transition = 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease-out';
        cardRef.current.style.transform = 'scale(1.03)';
        cardRef.current.style.opacity = '0.95';
        
        // After a short delay, continue with more pronounced animation
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease-out';
            cardRef.current.style.transform = 'scale(1.08)';
            cardRef.current.style.opacity = '0.9';
            
            // Final animation before showing modal
            setTimeout(() => {
              if (cardRef.current) {
                cardRef.current.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out';
                cardRef.current.style.transform = 'scale(1.12)';
                cardRef.current.style.opacity = '0.8';
                
                // Show modal and reset card
                setTimeout(() => {
                  setShowModal(true);
                  
                  // Reset the card style after modal is shown
                  if (cardRef.current) {
                    cardRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
                    cardRef.current.style.transform = 'scale(1)';
                    cardRef.current.style.opacity = '1';
                  }
                  setAnimating(false);
                }, 150);
              }
            }, 100);
          }
        }, 100);
      }
    }
  };

  // Determine card properties based on item category
  const getCategoryStyles = () => {
    // Define different sizes for different categories with variable heights
    const baseImageHeight = window.innerWidth < 640 ? 120 : 140; // Smaller on mobile
    const baseIconSize = window.innerWidth < 640 ? 14 : 16; // Smaller on mobile
    
    switch (item.category) {
      case 'Vehicles':
        return {
          imageHeight: baseImageHeight * 1.8, // Taller for vehicles
          accentColor: '#3b82f6', // blue
          iconSize: baseIconSize + 2
        };
      case 'Furniture':
        return {
          imageHeight: baseImageHeight * 1.6, // Tall for furniture
          accentColor: '#8b5cf6', // purple
          iconSize: baseIconSize
        };
      case 'Electronics':
        return {
          imageHeight: baseImageHeight * 1.4, // Medium-tall for electronics
          accentColor: '#10b981', // green
          iconSize: baseIconSize
        };
      case 'Clothing':
        return {
          imageHeight: baseImageHeight * 1.2, // Standard for clothing
          accentColor: '#f43f5e', // pink
          iconSize: baseIconSize
        };
      case 'Books':
        return {
          imageHeight: baseImageHeight * 1.3, // Medium for books
          accentColor: '#f59e0b', // amber
          iconSize: baseIconSize - 2
        };
      case 'Accessories':
        return {
          imageHeight: baseImageHeight * 1.1, // Shorter for accessories
          accentColor: '#ec4899', // pink
          iconSize: baseIconSize - 2
        };
      case 'Photography':
        return {
          imageHeight: baseImageHeight * 1.5, // Medium-tall for photography
          accentColor: '#6366f1', // indigo
          iconSize: baseIconSize
        };
      case 'Audio':
        return {
          imageHeight: baseImageHeight * 1.4, // Medium for audio
          accentColor: '#0ea5e9', // sky blue
          iconSize: baseIconSize
        };
      case 'Sports':
        return {
          imageHeight: baseImageHeight * 1.3, // Medium for sports
          accentColor: '#ef4444', // red
          iconSize: baseIconSize
        };
      case 'Kitchen':
        return {
          imageHeight: baseImageHeight * 1.2, // Standard for kitchen
          accentColor: '#f97316', // orange
          iconSize: baseIconSize
        };
      case 'Home & Garden':
        return {
          imageHeight: baseImageHeight * 1.7, // Taller for home & garden
          accentColor: '#22c55e', // green
          iconSize: baseIconSize
        };
      case 'Toys & Games':
        return {
          imageHeight: baseImageHeight * 1.2, // Standard for toys & games
          accentColor: '#a855f7', // purple
          iconSize: baseIconSize
        };
      default:
        return {
          imageHeight: baseImageHeight * 1.3, // Default medium height
          accentColor: '#4f46e5', // indigo
          iconSize: baseIconSize
        };
    }
  };

  // Use useEffect to handle window resize and update styles
  const [styles, setStyles] = useState(getCategoryStyles());
  
  useEffect(() => {
    const handleResize = () => {
      setStyles(getCategoryStyles());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { imageHeight, accentColor, iconSize } = styles;

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
        ref={cardRef}
        onClick={handleCardClick}
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
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Image navigation buttons */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-0.5 sm:p-1 hover:bg-white/90 transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={iconSize} />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-0.5 sm:p-1 hover:bg-white/90 transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight size={iconSize} />
              </button>
              
              {/* Image indicators */}
              <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5 sm:gap-1">
                {images.map((_, index) => (
                  <span 
                    key={index} 
                    className={`inline-block h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Category badge */}
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-5 shadow-md"
            style={{ 
              color: accentColor,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: `1px solid ${accentColor}`,
            }}
          >
            {item.category}
          </div>
          
          {/* Condition badge */}
          <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold z-5 shadow-md"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "rgba(75, 85, 99, 1)",
              border: "1px solid rgba(209, 213, 219, 1)"
            }}
          >
            {item.condition}
          </div>
        </div>
        
        <div className="p-2 sm:p-4 flex-1 flex flex-col">
          <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-900 line-clamp-2">
            {item.title}
          </h3>
          <p className="text-base sm:text-lg font-bold text-primary mt-auto" style={{ color: accentColor }}>
            ${item.price.toLocaleString()}
          </p>
        </div>
        
        <div className="px-2 sm:px-4 py-1 sm:py-2 border-t text-[10px] sm:text-xs text-gray-500 flex justify-between items-center"
          style={{ borderColor: `${accentColor}25` }}
        >
          <span className="truncate max-w-[50%]">{item.location}</span>
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