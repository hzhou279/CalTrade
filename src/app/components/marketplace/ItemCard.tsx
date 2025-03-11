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
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md hover:translate-y-[-4px]">
        <div className="relative w-full h-48">
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
            {item.condition}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold line-clamp-1">{item.title}</h3>
          <p className="text-xl font-bold mt-1">${item.price.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs text-gray-500">{item.location}</span>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
} 