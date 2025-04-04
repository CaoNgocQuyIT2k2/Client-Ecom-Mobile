export interface ProductType {
  _id: string;
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


export type RecentlyViewedProduct = {
  _id: string;
  IdUser: number;
  title: string;
  price: number;
  image: string;
  viewedAt: string;
  productId: {
    _id: string;
    id: string;
    title: string;
    price: number;
    description: string;
    images: string[];
    category: {
      id: number;
      name: string;
      image: string;
    };
    ratings: {
      stars: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
      };
      totalRatings: number;
      average: number;
    };
    soldCount: number;
  };
};
