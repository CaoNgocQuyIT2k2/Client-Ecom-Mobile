// context/WishlistContext.tsx
import { getWishlist } from '@/services/wishlistService';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  wishlist: string[];  // Giả sử wishlist là một mảng các productId
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    // Lấy danh sách yêu thích từ API hoặc AsyncStorage (nếu có)
    // Ví dụ load dữ liệu từ API
    const fetchWishlist = async () => {
      // Giả lập lấy dữ liệu
      const response = await getWishlist();
      setWishlist(response.wishlist || []);
    };

    fetchWishlist();
  }, []);

  const addToWishlist = (productId: string) => {
    setWishlist(prevWishlist => [...prevWishlist, productId]);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prevWishlist => prevWishlist.filter(id => id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
