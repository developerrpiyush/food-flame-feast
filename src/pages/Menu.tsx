import React, { useState, useEffect, useCallback } from 'react';
import { FoodCard } from '@/components/FoodCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import { FoodItem } from '@/types';

export const Menu: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const categories = ['All', 'Pizza', 'Burgers', 'Chinese', 'Desserts', 'Beverages'];

  // Fetch food data from multiple APIs
  const fetchFoodItems = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      let allTransformedItems: FoodItem[] = [];

      // Fetch from TheMealDB API
      const mealCategories = ['Beef', 'Chicken', 'Dessert', 'Pasta', 'Seafood', 'Vegetarian'];
      const mealPromises = mealCategories.map(async (category) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        return data.meals?.slice(0, 4) || []; // Get 4 items per category
      });

      const mealResults = await Promise.all(mealPromises);
      const allMeals = mealResults.flat();

      // Transform TheMealDB data
      const mealItems: FoodItem[] = allMeals.map((meal: any) => ({
        id: `meal-${meal.idMeal}`,
        name: meal.strMeal,
        description: `Delicious ${meal.strMeal} prepared with fresh ingredients and authentic spices`,
        price: Math.floor(Math.random() * 20) + 8,
        image: meal.strMealThumb,
        category: getCategoryFromMeal(meal.strMeal),
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        prepTime: `${Math.floor(Math.random() * 20) + 15}-${Math.floor(Math.random() * 20) + 35} min`
      }));

      allTransformedItems = [...allTransformedItems, ...mealItems];

      // Fetch from CocktailDB API for beverages
      try {
        const drinkResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Ordinary_Drink');
        const drinkData = await drinkResponse.json();
        const drinks = drinkData.drinks?.slice(0, 8) || [];

        const drinkItems: FoodItem[] = drinks.map((drink: any) => ({
          id: `drink-${drink.idDrink}`,
          name: drink.strDrink,
          description: `Refreshing ${drink.strDrink} - perfect to complement your meal`,
          price: Math.floor(Math.random() * 8) + 3,
          image: drink.strDrinkThumb,
          category: 'Beverages',
          rating: Math.round((Math.random() * 1.0 + 4.0) * 10) / 10,
          prepTime: '2-5 min'
        }));

        allTransformedItems = [...allTransformedItems, ...drinkItems];
      } catch (drinkError) {
        console.log('Drinks API failed, continuing without beverages');
      }

      // Add some custom pizza items
      const pizzaItems: FoodItem[] = [
        {
          id: 'pizza-1',
          name: 'Margherita Pizza',
          description: 'Classic Italian pizza with fresh tomatoes, mozzarella, and basil',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&h=500&fit=crop',
          category: 'Pizza',
          rating: 4.8,
          prepTime: '15-20 min'
        },
        {
          id: 'pizza-2',
          name: 'Pepperoni Pizza',
          description: 'Loaded with premium pepperoni and melted cheese',
          price: 15.99,
          image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=500&fit=crop',
          category: 'Pizza',
          rating: 4.7,
          prepTime: '15-20 min'
        },
        {
          id: 'pizza-3',
          name: 'Veggie Supreme Pizza',
          description: 'Fresh vegetables, bell peppers, mushrooms, and olives',
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=500&fit=crop',
          category: 'Pizza',
          rating: 4.6,
          prepTime: '15-20 min'
        }
      ];

      // Add custom burger items
      const burgerItems: FoodItem[] = [
        {
          id: 'burger-1',
          name: 'Classic Beef Burger',
          description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce',
          price: 11.99,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop',
          category: 'Burgers',
          rating: 4.5,
          prepTime: '10-15 min'
        },
        {
          id: 'burger-2',
          name: 'Chicken Deluxe Burger',
          description: 'Crispy chicken breast with mayo, lettuce, and pickles',
          price: 10.99,
          image: 'https://images.unsplash.com/photo-1606755962773-d324e2dabd05?w=500&h=500&fit=crop',
          category: 'Burgers',
          rating: 4.4,
          prepTime: '10-15 min'
        },
        {
          id: 'burger-3',
          name: 'Double Cheese Burger',
          description: 'Two beef patties with double cheese and caramelized onions',
          price: 16.99,
          image: 'https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?w=500&h=500&fit=crop',
          category: 'Burgers',
          rating: 4.8,
          prepTime: '12-18 min'
        }
      ];

      allTransformedItems = [...allTransformedItems, ...pizzaItems, ...burgerItems];

      if (isLoadMore) {
        // For load more, shuffle and add new items
        const shuffled = [...allTransformedItems].sort(() => Math.random() - 0.5);
        setFoodItems(prev => [...prev, ...shuffled.slice(0, 12)]);
        if (pageNum >= 4) setHasMore(false);
      } else {
        setFoodItems(allTransformedItems);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      // Fallback to mock data if all APIs fail
      const mockItems: FoodItem[] = [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Fresh tomato sauce, mozzarella, and basil',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
          category: 'Pizza',
          rating: 4.8,
          prepTime: '20-30 min'
        },
        {
          id: '2',
          name: 'Classic Burger',
          description: 'Beef patty, lettuce, tomato, cheese, and sauce',
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          category: 'Burgers',
          rating: 4.6,
          prepTime: '15-25 min'
        }
      ];
      setFoodItems(isLoadMore ? prev => [...prev, ...mockItems] : mockItems);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Helper function to categorize meals
  const getCategoryFromMeal = (mealName: string): string => {
    const name = mealName.toLowerCase();
    if (name.includes('pizza')) return 'Pizza';
    if (name.includes('burger') || name.includes('beef') && !name.includes('cake')) return 'Burgers';
    if (name.includes('chicken') || name.includes('noodle') || name.includes('rice') || name.includes('stir') || name.includes('asian')) return 'Chinese';
    if (name.includes('cake') || name.includes('dessert') || name.includes('sweet') || name.includes('ice') || name.includes('chocolate') || name.includes('cookie')) return 'Desserts';
    if (name.includes('juice') || name.includes('coffee') || name.includes('drink') || name.includes('cocktail') || name.includes('tea')) return 'Beverages';
    
    // More specific categorization
    if (name.includes('seafood') || name.includes('fish') || name.includes('salmon') || name.includes('tuna')) return 'Chinese';
    if (name.includes('pasta') || name.includes('spaghetti') || name.includes('lasagna')) return 'Pizza';
    
    return 'Chinese'; // Default category for variety
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore || !hasMore) {
      return;
    }
    setPage(prev => prev + 1);
  }, [loadingMore, hasMore]);

  // Load more items when page changes
  useEffect(() => {
    if (page > 1) {
      fetchFoodItems(page, true);
    }
  }, [page, fetchFoodItems]);

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  useEffect(() => {
    let filtered = foodItems;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategory, foodItems]);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-muted-foreground">Discover delicious food from our kitchen</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "btn-hero" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <Badge variant="outline" className="text-sm">
            {filteredItems.length} items found
          </Badge>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="food-card animate-pulse">
                <div className="h-48 bg-muted rounded-t-2xl"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-muted rounded w-16"></div>
                    <div className="h-8 w-8 bg-muted rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Food Items Grid */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="scroll-reveal revealed animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FoodCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button/Loading */}
        {!loading && hasMore && (
          <div className="text-center mt-12">
            {loadingMore ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more delicious food...</span>
              </div>
            ) : (
              <Button 
                onClick={() => setPage(prev => prev + 1)}
                variant="outline"
                size="lg"
                className="hover-glow"
              >
                Load More Food
              </Button>
            )}
          </div>
        )}

        {/* No results */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};