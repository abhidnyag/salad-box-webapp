import { PrismaClient, ProductType } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.recipeStep.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ─── Demo User ───
  await prisma.user.create({
    data: { id: 1, name: 'Demo User', email: 'demo@saladbox.com', password: hashPassword('demo1234') },
  });

  // ─── Categories ───
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Classic Salads', slug: 'classic-salads', type: 'SALAD', color: '#2E7D32', icon: '🥗' } }),
    prisma.category.create({ data: { name: 'Protein Bowls', slug: 'protein-bowls', type: 'SALAD', color: '#1B5E20', icon: '💪' } }),
    prisma.category.create({ data: { name: 'Mediterranean', slug: 'mediterranean', type: 'SALAD', color: '#4CAF50', icon: '🫒' } }),
    prisma.category.create({ data: { name: 'Classic Sandwiches', slug: 'classic-sandwiches', type: 'SANDWICH', color: '#E65100', icon: '🥪' } }),
    prisma.category.create({ data: { name: 'Gourmet Subs', slug: 'gourmet-subs', type: 'SANDWICH', color: '#FF6D00', icon: '🧑‍🍳' } }),
    prisma.category.create({ data: { name: 'Wraps & Rolls', slug: 'wraps-rolls', type: 'SANDWICH', color: '#BF360C', icon: '🌯' } }),
  ]);

  const [classicSalad, proteinBowl, mediterranean, classicSandwich, gourmetSub, wrapRoll] = categories;

  // ─── Salad Products ───
  const salads = [
    {
      name: 'Caesar Supreme',
      slug: 'caesar-supreme',
      description: 'A timeless Caesar salad with crispy romaine, shaved parmesan, crunchy croutons, and our signature anchovy-free Caesar dressing. Perfect for a light yet satisfying meal.',
      price: 12.99,
      oldPrice: 15.99,
      type: 'SALAD' as ProductType,
      imageColor: '#E8F5E9',
      prepTime: 10,
      calories: 320,
      servings: 2,
      rating: 4.8,
      reviewCount: 234,
      badges: 'Bestseller',
      featured: true,
      categoryId: classicSalad.id,
      ingredients: [
        { name: 'Romaine Lettuce', quantity: '2 heads', detail: 'Crispy and fresh', color: '#81C784' },
        { name: 'Parmesan Cheese', quantity: '60g', detail: 'Aged 12 months, shaved', color: '#FFF9C4' },
        { name: 'Croutons', quantity: '1 cup', detail: 'Garlic herb', color: '#D7CCC8' },
        { name: 'Caesar Dressing', quantity: '120ml', detail: 'House-made, anchovy-free', color: '#FFF3E0' },
        { name: 'Cherry Tomatoes', quantity: '100g', detail: 'Vine-ripened', color: '#EF5350' },
        { name: 'Lemon', quantity: '1 piece', detail: 'For garnish', color: '#FFF176' },
      ],
      recipe: {
        title: 'Classic Caesar Supreme Salad',
        description: 'Learn to make the perfect Caesar salad with restaurant-quality technique at home.',
        difficulty: 'Easy',
        chefTip: 'Chill your plates in the freezer for 10 minutes before serving for the crispiest salad.\nToss the dressing with lettuce just before serving to keep it crisp.\nUse a vegetable peeler for perfect parmesan shavings.',
        steps: [
          { stepNumber: 1, title: 'Prep the Lettuce', description: 'Wash and dry the romaine lettuce thoroughly. Tear into bite-sized pieces and place in a large bowl.', duration: '3 min' },
          { stepNumber: 2, title: 'Make Croutons', description: 'Toss bread cubes with olive oil, garlic, and herbs. Toast until golden and crunchy.', duration: '2 min' },
          { stepNumber: 3, title: 'Shave the Parmesan', description: 'Using a vegetable peeler, create thin parmesan shavings. Set aside.', duration: '1 min' },
          { stepNumber: 4, title: 'Dress & Toss', description: 'Pour the Caesar dressing over the lettuce and toss until evenly coated. Add croutons and tomatoes.', duration: '2 min' },
          { stepNumber: 5, title: 'Plate & Serve', description: 'Divide between plates, top with parmesan shavings, squeeze lemon, and serve immediately.', duration: '2 min' },
        ],
      },
    },
    {
      name: 'Greek Garden Bowl',
      slug: 'greek-garden-bowl',
      description: 'A vibrant Mediterranean bowl with crisp cucumber, ripe tomatoes, Kalamata olives, red onion, and creamy feta cheese drizzled with extra virgin olive oil and oregano.',
      price: 13.49,
      type: 'SALAD' as ProductType,
      imageColor: '#C8E6C9',
      prepTime: 8,
      calories: 290,
      servings: 2,
      rating: 4.7,
      reviewCount: 189,
      badges: 'Vegetarian',
      featured: true,
      categoryId: mediterranean.id,
      ingredients: [
        { name: 'Cucumber', quantity: '1 large', detail: 'English cucumber, diced', color: '#A5D6A7' },
        { name: 'Tomatoes', quantity: '200g', detail: 'Mixed heirloom', color: '#EF5350' },
        { name: 'Feta Cheese', quantity: '100g', detail: 'Greek PDO, crumbled', color: '#FAFAFA' },
        { name: 'Kalamata Olives', quantity: '80g', detail: 'Pitted', color: '#4A148C' },
        { name: 'Red Onion', quantity: '1 small', detail: 'Thinly sliced', color: '#CE93D8' },
        { name: 'Olive Oil & Oregano', quantity: '60ml', detail: 'Extra virgin blend', color: '#C5E1A5' },
      ],
      recipe: {
        title: 'Authentic Greek Garden Bowl',
        description: 'A refreshing Greek salad that transports you to the Mediterranean with every bite.',
        difficulty: 'Easy',
        chefTip: 'Let the salad sit for 5 minutes after dressing to let the flavors meld.\nUse the best quality olive oil you can find — it makes a big difference.',
        steps: [
          { stepNumber: 1, title: 'Chop Vegetables', description: 'Dice cucumber into half-moons, quarter the tomatoes, and thinly slice the red onion.', duration: '4 min' },
          { stepNumber: 2, title: 'Combine Ingredients', description: 'In a large bowl, combine cucumber, tomatoes, onion, and olives. Toss gently.', duration: '1 min' },
          { stepNumber: 3, title: 'Add Feta', description: 'Crumble the feta cheese over the top of the salad. Do not toss yet.', duration: '1 min' },
          { stepNumber: 4, title: 'Dress & Serve', description: 'Drizzle generously with the olive oil and oregano blend. Season with salt and pepper to taste.', duration: '2 min' },
        ],
      },
    },
    {
      name: 'Grilled Chicken Power Bowl',
      slug: 'grilled-chicken-power-bowl',
      description: 'A high-protein powerhouse featuring herb-marinated grilled chicken breast, quinoa, roasted sweet potato, avocado, and a tangy lemon-tahini dressing.',
      price: 15.99,
      oldPrice: 18.99,
      type: 'SALAD' as ProductType,
      imageColor: '#DCEDC8',
      prepTime: 15,
      calories: 520,
      servings: 2,
      rating: 4.9,
      reviewCount: 312,
      badges: 'High Protein,Popular',
      featured: true,
      categoryId: proteinBowl.id,
      ingredients: [
        { name: 'Chicken Breast', quantity: '300g', detail: 'Herb-marinated, pre-grilled', color: '#FFCC80' },
        { name: 'Quinoa', quantity: '200g', detail: 'Tri-color, pre-cooked', color: '#FFF9C4' },
        { name: 'Sweet Potato', quantity: '200g', detail: 'Cubed, pre-roasted', color: '#FF8A65' },
        { name: 'Avocado', quantity: '1 large', detail: 'Ripe', color: '#A5D6A7' },
        { name: 'Mixed Greens', quantity: '100g', detail: 'Baby spinach & arugula', color: '#66BB6A' },
        { name: 'Lemon Tahini Dressing', quantity: '80ml', detail: 'House-made', color: '#FFF3E0' },
        { name: 'Pumpkin Seeds', quantity: '30g', detail: 'Toasted', color: '#8D6E63' },
      ],
      recipe: {
        title: 'Grilled Chicken Power Bowl',
        description: 'A nutritious and filling bowl packed with protein and wholesome ingredients.',
        difficulty: 'Medium',
        chefTip: 'Warm the chicken and sweet potato slightly before assembling for the best texture.\nSlice the avocado just before serving to prevent browning.',
        steps: [
          { stepNumber: 1, title: 'Warm Proteins', description: 'Gently warm the pre-grilled chicken and roasted sweet potato in a skillet or microwave.', duration: '3 min' },
          { stepNumber: 2, title: 'Build the Base', description: 'Arrange mixed greens in bowls, then add a bed of quinoa on one side.', duration: '2 min' },
          { stepNumber: 3, title: 'Slice & Arrange', description: 'Slice the chicken breast diagonally. Halve and slice the avocado. Arrange everything neatly in the bowl.', duration: '3 min' },
          { stepNumber: 4, title: 'Add Toppings', description: 'Scatter sweet potato cubes and toasted pumpkin seeds over the bowl.', duration: '2 min' },
          { stepNumber: 5, title: 'Drizzle & Serve', description: 'Pour the lemon tahini dressing over the bowl. Serve immediately.', duration: '1 min' },
        ],
      },
    },
    {
      name: 'Asian Sesame Crunch',
      slug: 'asian-sesame-crunch',
      description: 'A crunchy Asian-inspired salad with shredded cabbage, edamame, mandarin oranges, crispy wonton strips, and a zesty sesame-ginger dressing.',
      price: 13.99,
      type: 'SALAD' as ProductType,
      imageColor: '#F1F8E9',
      prepTime: 10,
      calories: 340,
      servings: 2,
      rating: 4.6,
      reviewCount: 156,
      badges: 'Vegan',
      featured: true,
      categoryId: classicSalad.id,
      ingredients: [
        { name: 'Napa Cabbage', quantity: '300g', detail: 'Finely shredded', color: '#C5E1A5' },
        { name: 'Edamame', quantity: '100g', detail: 'Shelled, blanched', color: '#81C784' },
        { name: 'Mandarin Oranges', quantity: '150g', detail: 'Segments', color: '#FFB74D' },
        { name: 'Wonton Strips', quantity: '60g', detail: 'Crispy', color: '#D7CCC8' },
        { name: 'Sesame-Ginger Dressing', quantity: '100ml', detail: 'House-made', color: '#8D6E63' },
        { name: 'Toasted Sesame Seeds', quantity: '20g', color: '#FFF9C4' },
      ],
      recipe: {
        title: 'Asian Sesame Crunch Salad',
        description: 'A textural delight that balances crunch, sweetness, and umami in every bite.',
        difficulty: 'Easy',
        chefTip: 'Add the wonton strips just before serving to keep them crispy.',
        steps: [
          { stepNumber: 1, title: 'Shred Cabbage', description: 'Finely shred the napa cabbage and place in a large mixing bowl.', duration: '3 min' },
          { stepNumber: 2, title: 'Prep Toppings', description: 'Drain the mandarin oranges and blanch the edamame if needed.', duration: '2 min' },
          { stepNumber: 3, title: 'Combine & Dress', description: 'Add edamame and mandarins to the cabbage. Pour dressing over and toss well.', duration: '2 min' },
          { stepNumber: 4, title: 'Top & Serve', description: 'Top with crispy wonton strips and toasted sesame seeds. Serve immediately.', duration: '1 min' },
        ],
      },
    },
    {
      name: 'Kale & Quinoa Detox',
      slug: 'kale-quinoa-detox',
      description: 'A nutrient-dense detox bowl with massaged kale, fluffy quinoa, roasted beets, pickled onions, goat cheese, and a bright apple cider vinaigrette.',
      price: 14.49,
      type: 'SALAD' as ProductType,
      imageColor: '#E8F5E9',
      prepTime: 12,
      calories: 380,
      servings: 2,
      rating: 4.5,
      reviewCount: 98,
      featured: false,
      categoryId: proteinBowl.id,
      ingredients: [
        { name: 'Tuscan Kale', quantity: '200g', detail: 'De-stemmed', color: '#2E7D32' },
        { name: 'Quinoa', quantity: '150g', detail: 'White, pre-cooked', color: '#FFF9C4' },
        { name: 'Roasted Beets', quantity: '150g', detail: 'Diced', color: '#C62828' },
        { name: 'Goat Cheese', quantity: '60g', detail: 'Crumbled', color: '#FAFAFA' },
        { name: 'Pickled Red Onion', quantity: '50g', color: '#F48FB1' },
        { name: 'Apple Cider Vinaigrette', quantity: '80ml', color: '#FFCC80' },
      ],
      recipe: {
        title: 'Kale & Quinoa Detox Bowl',
        description: 'A cleansing bowl that proves healthy eating can be absolutely delicious.',
        difficulty: 'Easy',
        chefTip: 'Massage the kale with a pinch of salt and a squeeze of lemon for 2 minutes to soften it.',
        steps: [
          { stepNumber: 1, title: 'Massage Kale', description: 'Remove stems from kale, chop leaves, and massage with a pinch of salt and lemon juice until softened.', duration: '3 min' },
          { stepNumber: 2, title: 'Build Base', description: 'Arrange massaged kale in bowls and top with quinoa.', duration: '2 min' },
          { stepNumber: 3, title: 'Add Toppings', description: 'Arrange roasted beets, pickled onion, and crumbled goat cheese on top.', duration: '2 min' },
          { stepNumber: 4, title: 'Dress & Serve', description: 'Drizzle with apple cider vinaigrette and serve.', duration: '1 min' },
        ],
      },
    },
    {
      name: 'Tabbouleh Fresh Box',
      slug: 'tabbouleh-fresh-box',
      description: 'An authentic Middle Eastern tabbouleh with bulgur wheat, fresh parsley, mint, diced tomatoes, and cucumber dressed in lemon and olive oil.',
      price: 11.99,
      type: 'SALAD' as ProductType,
      imageColor: '#C8E6C9',
      prepTime: 15,
      calories: 260,
      servings: 2,
      rating: 4.4,
      reviewCount: 87,
      badges: 'Vegan',
      featured: false,
      categoryId: mediterranean.id,
      ingredients: [
        { name: 'Bulgur Wheat', quantity: '150g', detail: 'Fine grain', color: '#D7CCC8' },
        { name: 'Flat-leaf Parsley', quantity: '2 bunches', detail: 'Finely chopped', color: '#66BB6A' },
        { name: 'Fresh Mint', quantity: '1 bunch', detail: 'Finely chopped', color: '#81C784' },
        { name: 'Tomatoes', quantity: '200g', detail: 'Finely diced', color: '#EF5350' },
        { name: 'Cucumber', quantity: '1 medium', detail: 'Finely diced', color: '#A5D6A7' },
        { name: 'Lemon-Olive Oil Dressing', quantity: '80ml', color: '#FFF9C4' },
      ],
      recipe: {
        title: 'Classic Tabbouleh',
        description: 'A refreshing herb-forward salad straight from the Levant.',
        difficulty: 'Easy',
        chefTip: 'The key to great tabbouleh is using way more parsley than you think.\nLet the bulgur soak rather than cook it for the best texture.',
        steps: [
          { stepNumber: 1, title: 'Soak Bulgur', description: 'Place bulgur in a bowl, cover with boiling water, and let soak for 10 minutes. Drain and squeeze dry.', duration: '10 min' },
          { stepNumber: 2, title: 'Chop Herbs', description: 'Finely chop the parsley and mint. They should be almost minced.', duration: '3 min' },
          { stepNumber: 3, title: 'Dice Vegetables', description: 'Finely dice the tomatoes and cucumber into small, uniform pieces.', duration: '2 min' },
          { stepNumber: 4, title: 'Combine & Dress', description: 'Mix everything together in a large bowl. Pour the dressing over and toss well. Let rest 5 minutes before serving.', duration: '2 min' },
        ],
      },
    },
  ];

  // ─── Sandwich Products ───
  const sandwiches = [
    {
      name: 'Club Royale',
      slug: 'club-royale',
      description: 'The ultimate triple-decker club sandwich with roasted turkey, crispy bacon, ripe tomato, butter lettuce, and garlic aioli on toasted sourdough.',
      price: 14.99,
      oldPrice: 17.99,
      type: 'SANDWICH' as ProductType,
      imageColor: '#FFF3E0',
      prepTime: 12,
      calories: 580,
      servings: 2,
      rating: 4.8,
      reviewCount: 267,
      badges: 'Bestseller',
      featured: true,
      categoryId: classicSandwich.id,
      ingredients: [
        { name: 'Sourdough Bread', quantity: '6 slices', detail: 'Artisan, thick-cut', color: '#D7CCC8' },
        { name: 'Roasted Turkey', quantity: '200g', detail: 'Herb-roasted, sliced', color: '#FFCC80' },
        { name: 'Applewood Bacon', quantity: '6 strips', detail: 'Thick-cut', color: '#BF360C' },
        { name: 'Butter Lettuce', quantity: '4 leaves', detail: 'Crisp', color: '#C5E1A5' },
        { name: 'Tomato', quantity: '1 large', detail: 'Beefsteak, sliced', color: '#EF5350' },
        { name: 'Garlic Aioli', quantity: '60ml', detail: 'House-made', color: '#FFF9C4' },
      ],
      recipe: {
        title: 'Club Royale Triple-Decker',
        description: 'Master the art of the perfect club sandwich with proper layering technique.',
        difficulty: 'Easy',
        chefTip: 'Toast the bread just until golden — too dark and it crumbles.\nCut diagonally and secure with picks for the classic presentation.',
        steps: [
          { stepNumber: 1, title: 'Toast Bread', description: 'Toast all 6 slices of sourdough until golden brown. Let cool slightly.', duration: '3 min' },
          { stepNumber: 2, title: 'Cook Bacon', description: 'Cook bacon strips until crispy. Drain on paper towels.', duration: '5 min' },
          { stepNumber: 3, title: 'Spread Aioli', description: 'Spread garlic aioli on one side of each toast slice.', duration: '1 min' },
          { stepNumber: 4, title: 'Layer First Deck', description: 'On the first slice, layer turkey, lettuce, and tomato. Top with second slice.', duration: '1 min' },
          { stepNumber: 5, title: 'Layer Second Deck', description: 'Add remaining turkey, bacon strips, lettuce. Top with final slice. Cut diagonally.', duration: '2 min' },
        ],
      },
    },
    {
      name: 'Caprese Ciabatta',
      slug: 'caprese-ciabatta',
      description: 'Fresh mozzarella, vine-ripened tomatoes, fragrant basil, and aged balsamic glaze on a warm ciabatta roll. Simple Italian perfection.',
      price: 12.49,
      type: 'SANDWICH' as ProductType,
      imageColor: '#FFF8E1',
      prepTime: 8,
      calories: 420,
      servings: 2,
      rating: 4.7,
      reviewCount: 198,
      badges: 'Vegetarian',
      featured: true,
      categoryId: gourmetSub.id,
      ingredients: [
        { name: 'Ciabatta Rolls', quantity: '2 pieces', detail: 'Fresh-baked', color: '#D7CCC8' },
        { name: 'Fresh Mozzarella', quantity: '200g', detail: 'Buffalo, sliced', color: '#FAFAFA' },
        { name: 'Heirloom Tomatoes', quantity: '2 large', detail: 'Sliced thick', color: '#EF5350' },
        { name: 'Fresh Basil', quantity: '1 bunch', detail: 'Large leaves', color: '#66BB6A' },
        { name: 'Balsamic Glaze', quantity: '40ml', detail: 'Aged Modena', color: '#4E342E' },
        { name: 'Extra Virgin Olive Oil', quantity: '30ml', detail: 'Italian', color: '#C5E1A5' },
      ],
      recipe: {
        title: 'Caprese Ciabatta Sandwich',
        description: 'The simplest ingredients, prepared with care, create something extraordinary.',
        difficulty: 'Easy',
        chefTip: 'Use room-temperature mozzarella for the best flavor and texture.\nDon\'t skip the salt — it brings out the sweetness of the tomatoes.',
        steps: [
          { stepNumber: 1, title: 'Warm Ciabatta', description: 'Slice ciabatta rolls in half and warm in the oven for 2 minutes until slightly crispy.', duration: '2 min' },
          { stepNumber: 2, title: 'Slice Ingredients', description: 'Slice mozzarella and tomatoes into thick, even rounds.', duration: '2 min' },
          { stepNumber: 3, title: 'Assemble', description: 'Layer mozzarella, tomato, and basil leaves alternately on the ciabatta base. Season with salt and pepper.', duration: '2 min' },
          { stepNumber: 4, title: 'Finish & Serve', description: 'Drizzle with olive oil and balsamic glaze. Close the sandwich and press gently.', duration: '2 min' },
        ],
      },
    },
    {
      name: 'Smoked Salmon Bagel',
      slug: 'smoked-salmon-bagel',
      description: 'Premium smoked salmon layered on a toasted everything bagel with cream cheese, capers, red onion, and fresh dill. A New York classic.',
      price: 16.49,
      type: 'SANDWICH' as ProductType,
      imageColor: '#FFE0B2',
      prepTime: 8,
      calories: 450,
      servings: 2,
      rating: 4.9,
      reviewCount: 321,
      badges: 'Premium,Popular',
      featured: true,
      categoryId: gourmetSub.id,
      ingredients: [
        { name: 'Everything Bagels', quantity: '2 pieces', detail: 'Fresh, hand-rolled', color: '#D7CCC8' },
        { name: 'Smoked Salmon', quantity: '200g', detail: 'Scottish, sliced thin', color: '#FF8A65' },
        { name: 'Cream Cheese', quantity: '120g', detail: 'Whipped', color: '#FAFAFA' },
        { name: 'Capers', quantity: '30g', detail: 'Brined', color: '#81C784' },
        { name: 'Red Onion', quantity: '1 small', detail: 'Paper-thin slices', color: '#CE93D8' },
        { name: 'Fresh Dill', quantity: '1 bunch', color: '#A5D6A7' },
        { name: 'Lemon Wedges', quantity: '2 pieces', color: '#FFF176' },
      ],
      recipe: {
        title: 'Classic Smoked Salmon Bagel',
        description: 'Build the perfect lox bagel with proper technique and premium ingredients.',
        difficulty: 'Easy',
        chefTip: 'Spread the cream cheese while the bagel is still warm so it gets slightly melty.\nFold the salmon into rosettes for an elegant presentation.',
        steps: [
          { stepNumber: 1, title: 'Toast Bagels', description: 'Slice bagels in half and toast until golden on the cut side.', duration: '2 min' },
          { stepNumber: 2, title: 'Spread Cream Cheese', description: 'Generously spread whipped cream cheese on both halves while still warm.', duration: '1 min' },
          { stepNumber: 3, title: 'Layer Salmon', description: 'Drape smoked salmon slices over the bottom half, folding gently for volume.', duration: '2 min' },
          { stepNumber: 4, title: 'Garnish & Serve', description: 'Top with red onion rings, capers, fresh dill. Squeeze lemon over and close.', duration: '2 min' },
        ],
      },
    },
    {
      name: 'BBQ Pulled Pork Sub',
      slug: 'bbq-pulled-pork-sub',
      description: 'Slow-smoked pulled pork drenched in tangy BBQ sauce with crunchy coleslaw and pickles on a toasted hoagie roll.',
      price: 15.49,
      oldPrice: 18.49,
      type: 'SANDWICH' as ProductType,
      imageColor: '#FFCCBC',
      prepTime: 10,
      calories: 640,
      servings: 2,
      rating: 4.7,
      reviewCount: 245,
      badges: 'Popular',
      featured: true,
      categoryId: classicSandwich.id,
      ingredients: [
        { name: 'Hoagie Rolls', quantity: '2 pieces', detail: 'Soft, fresh-baked', color: '#D7CCC8' },
        { name: 'Pulled Pork', quantity: '300g', detail: 'Slow-smoked 12 hours', color: '#8D6E63' },
        { name: 'BBQ Sauce', quantity: '100ml', detail: 'Smoky chipotle blend', color: '#BF360C' },
        { name: 'Coleslaw Mix', quantity: '150g', detail: 'Cabbage & carrot', color: '#C5E1A5' },
        { name: 'Coleslaw Dressing', quantity: '60ml', detail: 'Creamy ranch', color: '#FFF9C4' },
        { name: 'Dill Pickles', quantity: '4 spears', color: '#81C784' },
      ],
      recipe: {
        title: 'BBQ Pulled Pork Sub',
        description: 'A hearty, smoky sandwich that brings BBQ flavors to your kitchen.',
        difficulty: 'Easy',
        chefTip: 'Warm the pulled pork in the BBQ sauce for the juiciest result.\nMake the coleslaw right before assembly so it stays crunchy.',
        steps: [
          { stepNumber: 1, title: 'Heat Pork', description: 'Warm the pulled pork with BBQ sauce in a skillet over medium heat until heated through.', duration: '4 min' },
          { stepNumber: 2, title: 'Make Coleslaw', description: 'Toss the coleslaw mix with the creamy dressing. Season with salt and pepper.', duration: '2 min' },
          { stepNumber: 3, title: 'Toast Rolls', description: 'Split hoagie rolls and toast lightly under the broiler.', duration: '2 min' },
          { stepNumber: 4, title: 'Assemble & Serve', description: 'Pile pork on the rolls, top with coleslaw and pickles. Serve with extra BBQ sauce on the side.', duration: '2 min' },
        ],
      },
    },
    {
      name: 'Mediterranean Veggie Wrap',
      slug: 'mediterranean-veggie-wrap',
      description: 'A colorful wrap loaded with hummus, roasted red peppers, grilled zucchini, artichoke hearts, baby spinach, and crumbled feta in a whole wheat tortilla.',
      price: 12.99,
      type: 'SANDWICH' as ProductType,
      imageColor: '#FFF3E0',
      prepTime: 10,
      calories: 380,
      servings: 2,
      rating: 4.6,
      reviewCount: 134,
      badges: 'Vegetarian,Healthy',
      featured: false,
      categoryId: wrapRoll.id,
      ingredients: [
        { name: 'Whole Wheat Tortillas', quantity: '2 large', detail: '12-inch', color: '#D7CCC8' },
        { name: 'Hummus', quantity: '120g', detail: 'Classic, house-made', color: '#FFF9C4' },
        { name: 'Roasted Red Peppers', quantity: '100g', detail: 'Marinated', color: '#EF5350' },
        { name: 'Grilled Zucchini', quantity: '1 medium', detail: 'Sliced & grilled', color: '#81C784' },
        { name: 'Artichoke Hearts', quantity: '80g', detail: 'Marinated', color: '#C5E1A5' },
        { name: 'Baby Spinach', quantity: '60g', color: '#66BB6A' },
        { name: 'Feta Cheese', quantity: '60g', detail: 'Crumbled', color: '#FAFAFA' },
      ],
      recipe: {
        title: 'Mediterranean Veggie Wrap',
        description: 'A wholesome wrap bursting with Mediterranean flavors and textures.',
        difficulty: 'Easy',
        chefTip: 'Warm the tortillas for 10 seconds in a dry pan to make them more pliable.\nDon\'t overfill — leave room to fold the bottom up first.',
        steps: [
          { stepNumber: 1, title: 'Warm Tortillas', description: 'Heat tortillas in a dry pan for 10 seconds per side until pliable.', duration: '1 min' },
          { stepNumber: 2, title: 'Spread Hummus', description: 'Spread a thick layer of hummus across each tortilla, leaving edges clear.', duration: '1 min' },
          { stepNumber: 3, title: 'Layer Fillings', description: 'Arrange spinach, zucchini, peppers, artichoke hearts, and feta in a line across the center.', duration: '3 min' },
          { stepNumber: 4, title: 'Roll & Serve', description: 'Fold the bottom up, then roll tightly from one side. Cut diagonally and serve.', duration: '2 min' },
        ],
      },
    },
    {
      name: 'Chicken Tikka Wrap',
      slug: 'chicken-tikka-wrap',
      description: 'Tandoori-spiced chicken tikka with cool cucumber raita, pickled onions, fresh cilantro, and crispy lettuce in a garlic naan wrap.',
      price: 14.49,
      type: 'SANDWICH' as ProductType,
      imageColor: '#FFCCBC',
      prepTime: 12,
      calories: 490,
      servings: 2,
      rating: 4.8,
      reviewCount: 176,
      badges: 'Spicy',
      featured: false,
      categoryId: wrapRoll.id,
      ingredients: [
        { name: 'Garlic Naan', quantity: '2 pieces', detail: 'Fresh, oval-shaped', color: '#D7CCC8' },
        { name: 'Chicken Tikka', quantity: '250g', detail: 'Pre-marinated & grilled', color: '#FF7043' },
        { name: 'Cucumber Raita', quantity: '100ml', detail: 'Yogurt-based', color: '#E0F7FA' },
        { name: 'Pickled Onions', quantity: '60g', detail: 'Pink, tangy', color: '#F48FB1' },
        { name: 'Fresh Cilantro', quantity: '1 bunch', color: '#66BB6A' },
        { name: 'Crispy Lettuce', quantity: '4 leaves', color: '#C5E1A5' },
      ],
      recipe: {
        title: 'Chicken Tikka Naan Wrap',
        description: 'Bring the flavors of an Indian kitchen into a handheld wrap.',
        difficulty: 'Medium',
        chefTip: 'Warm the naan on a dry skillet until it puffs slightly for the best wrap texture.\nChar the chicken tikka briefly under the broiler for smoky edges.',
        steps: [
          { stepNumber: 1, title: 'Warm Chicken', description: 'Heat chicken tikka in a skillet until warmed through with slightly charred edges.', duration: '4 min' },
          { stepNumber: 2, title: 'Warm Naan', description: 'Heat naan bread in a dry pan until soft and pliable, about 30 seconds per side.', duration: '2 min' },
          { stepNumber: 3, title: 'Spread & Layer', description: 'Spread raita on the naan. Layer lettuce, chicken tikka, pickled onions, and cilantro.', duration: '3 min' },
          { stepNumber: 4, title: 'Roll & Serve', description: 'Roll the naan tightly around the filling. Cut in half at an angle.', duration: '1 min' },
        ],
      },
    },
  ];

  // ─── Create all products with nested relations ───
  for (const productData of [...salads, ...sandwiches]) {
    const { ingredients, recipe, ...product } = productData;
    await prisma.product.create({
      data: {
        ...product,
        ingredients: { create: ingredients },
        recipe: {
          create: {
            title: recipe.title,
            description: recipe.description,
            difficulty: recipe.difficulty,
            chefTip: recipe.chefTip,
            steps: { create: recipe.steps },
          },
        },
      },
    });
  }

  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  console.log(`✓ Seeded ${categoryCount} categories and ${productCount} products with ingredients and recipes`);
  console.log('✓ Demo user created (id: 1, email: demo@saladbox.com)');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
