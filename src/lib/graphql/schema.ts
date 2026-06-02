export const typeDefs = `#graphql
  enum ProductType {
    SALAD
    SANDWICH
  }

  type Category {
    id: Int!
    name: String!
    slug: String!
    type: ProductType!
    color: String!
    icon: String!
    products: [Product!]!
  }

  type Ingredient {
    id: Int!
    name: String!
    quantity: String!
    detail: String
    color: String!
  }

  type RecipeStep {
    id: Int!
    stepNumber: Int!
    title: String!
    description: String!
    duration: String!
  }

  type Recipe {
    id: Int!
    title: String!
    description: String
    difficulty: String!
    chefTip: String
    tips: [String!]
    steps: [RecipeStep!]!
  }

  type Product {
    id: Int!
    name: String!
    slug: String!
    description: String!
    price: Float!
    oldPrice: Float
    type: ProductType!
    imageColor: String!
    prepTime: Int!
    calories: Int!
    servings: Int!
    rating: Float!
    reviewCount: Int!
    badges: [String!]
    featured: Boolean!
    category: Category!
    ingredients: [Ingredient!]!
    recipe: Recipe
  }

  type CartItem {
    id: Int!
    quantity: Int!
    product: Product!
  }

  type OrderItem {
    id: Int!
    quantity: Int!
    price: Float!
    product: Product!
  }

  type Order {
    id: Int!
    orderNumber: String!
    status: String!
    subtotal: Float!
    deliveryFee: Float!
    tax: Float!
    tip: Float!
    total: Float!
    deliveryAddress: String!
    deliveryPhone: String
    items: [OrderItem!]!
    createdAt: String!
  }

  input CreateOrderInput {
    deliveryAddress: String!
    deliveryPhone: String
  }

  type User {
    id: Int!
    name: String!
    email: String!
    avatar: String
    joinDate: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    products(type: ProductType, categorySlug: String, featured: Boolean, limit: Int): [Product!]!
    product(slug: String!): Product
    categories(type: ProductType): [Category!]!
    cart: [CartItem!]!
    orders: [Order!]!
    order(id: Int!): Order
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    addToCart(productId: Int!, quantity: Int): CartItem!
    updateCartItem(productId: Int!, quantity: Int!): CartItem
    removeFromCart(productId: Int!): Boolean!
    clearCart: Boolean!
    createOrder(input: CreateOrderInput!): Order!
  }
`;
