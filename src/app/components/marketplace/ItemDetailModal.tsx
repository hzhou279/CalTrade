import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MarketplaceItem } from '../../../types/marketplace';

interface ItemDetailModalProps {
  item: MarketplaceItem;
  onClose: () => void;
}

export default function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
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
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Add keyboard event listener for ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Determine accent color based on category
  const getAccentColor = () => {
    switch (item.category) {
      case 'Vehicles': return '#3b82f6'; // blue
      case 'Furniture': return '#8b5cf6'; // purple
      case 'Electronics': return '#10b981'; // green
      case 'Clothing': return '#f43f5e'; // pink
      case 'Books': return '#f59e0b'; // amber
      case 'Accessories': return '#ec4899'; // pink
      case 'Photography': return '#6366f1'; // indigo
      case 'Audio': return '#0ea5e9'; // sky blue
      case 'Sports': return '#ef4444'; // red
      case 'Kitchen': return '#f97316'; // orange
      case 'Home & Garden': return '#22c55e'; // green
      case 'Toys & Games': return '#a855f7'; // purple
      default: return '#4f46e5'; // indigo
    }
  };

  const accentColor = getAccentColor();

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      style={{
        animation: 'fadeIn 0.2s ease-out',
        zIndex: 100
      }}
    >
      <div 
        className="bg-white rounded-lg overflow-hidden flex flex-col lg:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'scaleIn 0.25s ease-out',
          transformOrigin: 'center',
          width: '95%',
          maxWidth: '1200px',
          height: '90vh',
          maxHeight: '700px',
          marginTop: '20px'
        }}
      >
        {/* Left/Top part - Image gallery */}
        <div className="w-full lg:w-1/2 bg-gray-900 flex-shrink-0 h-[40vh] lg:h-full">
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={item.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className="w-full h-full"
            />
            
            {/* Image navigation buttons */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 sm:p-2 hover:bg-white/90 transition-colors z-10 shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1 sm:p-2 hover:bg-white/90 transition-colors z-10 shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center gap-1 sm:gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125 shadow-sm' : 'bg-white/50'}`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            
            {/* Category and condition badges */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-wrap gap-1 sm:gap-2">
              <span 
                className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm"
                style={{ color: accentColor }}
              >
                {item.category}
              </span>
              <span 
                className="inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm text-gray-800"
              >
                {item.condition}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right/Bottom part - Item details */}
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{item.title}</h2>
          
          <p 
            className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-5"
            style={{ color: accentColor }}
          >
            ${item.price.toLocaleString()}
          </p>
          
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Description</h3>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">{item.description}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-3 sm:pt-5">
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              <span className="mb-1 sm:mb-0">Location: {item.location}</span>
              <span>Posted: {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center mt-3 sm:mt-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-2 sm:mr-3">
                {item.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm sm:text-base font-medium">{item.sellerName}</p>
                <p className="text-xs sm:text-sm text-gray-500">Seller</p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6">
              <button 
                className="w-full py-2 sm:py-3 px-4 text-white font-medium rounded-lg transition-colors hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 