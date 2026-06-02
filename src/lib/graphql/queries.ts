import { gql } from '@apollo/client';

const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id name slug description price oldPrice type imageColor
    prepTime calories servings rating reviewCount badges featured
    category { id name slug color icon type }
    ingredients { id name quantity detail color }
  }
`;

export const GET_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query GetProducts($type: ProductType, $categorySlug: String, $featured: Boolean, $limit: Int) {
    products(type: $type, categorySlug: $categorySlug, featured: $featured, limit: $limit) {
      ...ProductFields
    }
  }
`;

export const GET_PRODUCT = gql`
  ${PRODUCT_FRAGMENT}
  query GetProduct($slug: String!) {
    product(slug: $slug) {
      ...ProductFields
      recipe { id title description difficulty chefTip tips steps { id stepNumber title description duration } }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories($type: ProductType) {
    categories(type: $type) { id name slug type color icon }
  }
`;

export const GET_CART = gql`
  ${PRODUCT_FRAGMENT}
  query GetCart {
    cart { id quantity product { ...ProductFields } }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int) {
    addToCart(productId: $productId, quantity: $quantity) { id quantity }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: Int!, $quantity: Int!) {
    updateCartItem(productId: $productId, quantity: $quantity) { id quantity }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: Int!) {
    removeFromCart(productId: $productId)
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart { clearCart }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id orderNumber status subtotal deliveryFee tax total deliveryAddress createdAt
      items { id quantity price product { id name slug imageColor type } }
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id orderNumber status subtotal deliveryFee tax total deliveryAddress createdAt
      items { id quantity price product { id name slug imageColor type } }
    }
  }
`;

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user { id name email avatar joinDate }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user { id name email avatar joinDate }
    }
  }
`;

export const ME = gql`
  query Me {
    me { id name email avatar joinDate }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: Int!) {
    order(id: $id) {
      id orderNumber status subtotal deliveryFee tax total deliveryAddress createdAt
      items { id quantity price product { id name slug imageColor type } }
    }
  }
`;
