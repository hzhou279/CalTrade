import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      style={{
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div 
        className="bg-white rounded-lg overflow-hidden max-w-5xl w-full max-h-[85vh] flex flex-col md:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: 'scaleIn 0.25s ease-out',
          transformOrigin: 'center',
        }}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 rounded-full p-1.5 hover:bg-white transition-colors z-10 shadow-md"
          aria-label="Close modal"
        >
          <X size={20} color="#111827" />
        </button>
        
        {/* Left side - Image gallery */}
        <div className="w-full md:w-1/2 relative bg-gray-100 flex-shrink-0" style={{ height: '450px' }}>
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={item.title}
              fill
              style={{ objectFit: "contain" }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            
            {/* Image navigation buttons */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 transition-colors z-10 shadow-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90 transition-colors z-10 shadow-sm"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full transition-all ${index === currentImageIndex ? 'bg-white scale-125 shadow-sm' : 'bg-white/50'}`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Right side - Item details */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto" style={{ maxHeight: '450px' }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-2">
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
              >
                {item.category}
              </span>
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {item.condition}
              </span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
          
          <p 
            className="text-3xl font-bold mb-6"
            style={{ color: accentColor }}
          >
            ${item.price.toLocaleString()}
          </p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Location: {item.location}</span>
              <span>Posted: {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center mt-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mr-3">
                {item.sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{item.sellerName}</p>
                <p className="text-sm text-gray-500">Seller</p>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                className="w-full py-3 px-4 text-white font-medium rounded-lg transition-colors hover:opacity-90"
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