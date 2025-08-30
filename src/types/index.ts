export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  securityQuestion: string;
  securityAnswer: string;
  addresses: Address[];
  orders: Order[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  prepTime: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  address: Address;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, securityQuestion: string, securityAnswer: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string, securityAnswer: string) => { success: boolean; password?: string };
  updateProfile: (updates: Partial<User>) => void;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: FoodItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}