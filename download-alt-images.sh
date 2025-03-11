#!/bin/bash

# Create directory for marketplace images if it doesn't exist
mkdir -p public/images/marketplace

# Change to the marketplace images directory
cd public/images/marketplace

# Function to download alternative images for an item
download_alt_images() {
  local base_name=$1
  local alt1_url=$2
  local alt2_url=$3
  
  # Download alternative images
  echo "Downloading alternative images for $base_name"
  curl -s -o "${base_name}-alt1.jpg" "$alt1_url"
  curl -s -o "${base_name}-alt2.jpg" "$alt2_url"
}

# Download alternative images for each item
download_alt_images "macbook" "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop"

download_alt_images "dining-table" "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?q=80&w=600&auto=format&fit=crop"

download_alt_images "air-jordan" "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop"

download_alt_images "iphone" "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600&auto=format&fit=crop"

download_alt_images "textbook" "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop"

download_alt_images "bike" "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=600&auto=format&fit=crop"

download_alt_images "dresser" "https://images.unsplash.com/photo-1551298370-9d3d53740c72?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=600&auto=format&fit=crop"

download_alt_images "ps5" "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1622297845775-5ff3fef71d13?q=80&w=600&auto=format&fit=crop"

download_alt_images "monitor" "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1547119957-637f8679db1e?q=80&w=600&auto=format&fit=crop"

download_alt_images "headphones" "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop"

download_alt_images "camera" "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1581591524425-c7e0978865fc?q=80&w=600&auto=format&fit=crop"

download_alt_images "watch" "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=600&auto=format&fit=crop"

download_alt_images "guitar" "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop"

download_alt_images "desk" "https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1544140708-514b7837c325?q=80&w=600&auto=format&fit=crop"

download_alt_images "chair" "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop"

download_alt_images "lamp" "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=600&auto=format&fit=crop"

download_alt_images "backpack" "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?q=80&w=600&auto=format&fit=crop"

download_alt_images "sneakers" "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop"

download_alt_images "jacket" "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1548126032-079a0fb0099d?q=80&w=600&auto=format&fit=crop"

download_alt_images "sunglasses" "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=600&auto=format&fit=crop"

download_alt_images "coffee-maker" "https://images.unsplash.com/photo-1570087935869-a8041cc3f9ec?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop"

download_alt_images "blender" "https://images.unsplash.com/photo-1659856543532-77b3d27d8c96?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1659856543532-77b3d27d8c96?q=80&w=600&auto=format&fit=crop"

download_alt_images "speaker" "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop"

download_alt_images "keyboard" "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop" "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600&auto=format&fit=crop"

echo "All alternative images downloaded successfully!" 