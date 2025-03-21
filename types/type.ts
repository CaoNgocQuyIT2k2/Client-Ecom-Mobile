export interface ProductType {
  id: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  soldCount: number;
  ratings: {
    totalRatings: number;
    stars: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
    average: number;
  };
}


interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CategoryType {
  id: number;
  name: string;
  image: string;
}

export interface CartItemType {
  _id: string  // Thêm nếu thiếu
  id: number;
  productId: string; // Thêm productId nếu cần
  title: string;
  price: number;
  quantity: number;
  images: string;
}

export interface NotificationType {
  id: number;
  title: string;
  message: string;
  timestamp: string;
}


export interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  address: {
      fullName: string;
      phone: string;
      addressLine: string;
      city: string;
      state: string;
      country: string;
  };
  products: {
      productId: string;
      title: string;
      quantity: number;
      price: number;
      image: string;
      _id: string;
  }[];
}
