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

  // Fetch food data from TheMealDB API
  const fetchFoodItems = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch from TheMealDB API - get random meals and category meals
      const categories = ['Beef', 'Chicken', 'Dessert', 'Pasta', 'Seafood', 'Vegetarian'];
      const promises = categories.map(async (category) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        return data.meals?.slice(0, 3) || []; // Get 3 items per category
      });

      const categoryResults = await Promise.all(promises);
      const allMeals = categoryResults.flat();

      // Transform API data to our FoodItem format
      const transformedItems: FoodItem[] = allMeals.map((meal: any, index: number) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        description: `Delicious ${meal.strMeal} prepared with fresh ingredients`,
        price: Math.floor(Math.random() * 20) + 8, // Random price between 8-28
        image: meal.strMealThumb,
        category: getCategoryFromMeal(meal.strMeal),
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating 3.5-5.0
        prepTime: `${Math.floor(Math.random() * 20) + 15}-${Math.floor(Math.random() * 20) + 35} min`
      }));

      if (isLoadMore) {
        setFoodItems(prev => [...prev, ...transformedItems]);
        if (pageNum >= 3) setHasMore(false); // Limit to 3 pages for demo
      } else {
        setFoodItems(transformedItems);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
      // Fallback to mock data if API fails
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
    if (name.includes('burger') || name.includes('beef')) return 'Burgers';
    if (name.includes('chicken') || name.includes('noodle') || name.includes('rice')) return 'Chinese';
    if (name.includes('cake') || name.includes('dessert') || name.includes('sweet')) return 'Desserts';
    if (name.includes('juice') || name.includes('coffee') || name.includes('drink')) return 'Beverages';
    return 'Pizza'; // Default category
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