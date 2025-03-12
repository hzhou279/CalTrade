#!/bin/bash

# Create directory for marketplace images
mkdir -p public/images/marketplace

# Change to the marketplace images directory
cd public/images/marketplace

# Download images for existing items
curl -s -o macbook.jpg "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop"
curl -s -o dining-table.jpg "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=600&auto=format&fit=crop"
curl -s -o air-jordan.jpg "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=600&auto=format&fit=crop"
curl -s -o iphone.jpg "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?q=80&w=600&auto=format&fit=crop"
curl -s -o textbook.jpg "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"
curl -s -o bike.jpg "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop"
curl -s -o dresser.jpg "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop"
curl -s -o ps5.jpg "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=600&auto=format&fit=crop"

# Download images for additional items
curl -s -o monitor.jpg "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop"
curl -s -o headphones.jpg "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop"
curl -s -o camera.jpg "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop"
curl -s -o watch.jpg "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
curl -s -o guitar.jpg "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=600&auto=format&fit=crop"
curl -s -o desk.jpg "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600&auto=format&fit=crop"
curl -s -o chair.jpg "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=600&auto=format&fit=crop"
curl -s -o lamp.jpg "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600&auto=format&fit=crop"
curl -s -o backpack.jpg "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop"
curl -s -o sneakers.jpg "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"
curl -s -o jacket.jpg "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=600&auto=format&fit=crop"
curl -s -o sunglasses.jpg "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop"
curl -s -o coffee-maker.jpg "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600&auto=format&fit=crop"
curl -s -o blender.jpg "https://images.unsplash.com/photo-1626143508000-4b5904e5e84a?q=80&w=600&auto=format&fit=crop"
curl -s -o speaker.jpg "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop"
curl -s -o keyboard.jpg "https://images.unsplash.com/photo-1561112078-7d24e04c3407?q=80&w=600&auto=format&fit=crop"

echo "All images downloaded successfully!" 