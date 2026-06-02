export type ProductType = 'SALAD' | 'SANDWICH';

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: ProductType;
  color: string;
  icon: string;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: string;
  detail: string | null;
  color: string;
}

export interface RecipeStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  difficulty: string;
  chefTip: string | null;
  tips: string[] | null;
  steps: RecipeStep[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  type: ProductType;
  imageColor: string;
  prepTime: number;
  calories: number;
  servings: number;
  rating: number;
  reviewCount: number;
  badges: string[] | null;
  featured: boolean;
  category: Category;
  ingredients: Ingredient[];
  recipe: Recipe | null;
  nutrition?: Record<string, string>;
}

export interface CartItemType {
  id: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  items: { id: number; product: Product; quantity: number; price: number }[];
  createdAt: string;
}
