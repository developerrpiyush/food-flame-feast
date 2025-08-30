import React, { useState, useEffect } from 'react';
import { FoodCard } from '@/components/FoodCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { FoodItem } from '@/types';

export const Menu: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Pizza', 'Burgers', 'Chinese', 'Desserts', 'Beverages'];

  useEffect(() => {
    // Simulate API call - in real app, would fetch from multiple food APIs
    const fetchFoodItems = async () => {
      setLoading(true);
      
      // Mock data simulating different API responses
      const mockItems: FoodItem[] = [
        // Pizza items
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
          name: 'Pepperoni Pizza',
          description: 'Classic pepperoni with mozzarella cheese',
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
          category: 'Pizza',
          rating: 4.7,
          prepTime: '25-35 min'
        },
        // Burger items
        {
          id: '3',
          name: 'Classic Burger',
          description: 'Beef patty, lettuce, tomato, cheese, and sauce',
          price: 9.99,
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
          category: 'Burgers',
          rating: 4.6,
          prepTime: '15-25 min'
        },
        {
          id: '4',
          name: 'Chicken Burger',
          description: 'Grilled chicken breast with fresh vegetables',
          price: 11.99,
          image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400',
          category: 'Burgers',
          rating: 4.5,
          prepTime: '18-28 min'
        },
        // Chinese items
        {
          id: '5',
          name: 'Sweet & Sour Chicken',
          description: 'Crispy chicken with sweet and sour sauce',
          price: 13.99,
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
          category: 'Chinese',
          rating: 4.7,
          prepTime: '20-30 min'
        },
        {
          id: '6',
          name: 'Fried Rice',
          description: 'Wok-fried rice with vegetables and egg',
          price: 8.99,
          image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
          category: 'Chinese',
          rating: 4.4,
          prepTime: '15-20 min'
        },
        // Desserts
        {
          id: '7',
          name: 'Chocolate Brownie',
          description: 'Rich, fudgy brownie with chocolate chips',
          price: 6.99,
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
          category: 'Desserts',
          rating: 4.9,
          prepTime: '10-15 min'
        },
        {
          id: '8',
          name: 'Cheesecake',
          description: 'Creamy New York style cheesecake',
          price: 7.99,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
          category: 'Desserts',
          rating: 4.8,
          prepTime: '5-10 min'
        },
        // Beverages
        {
          id: '9',
          name: 'Fresh Orange Juice',
          description: 'Freshly squeezed orange juice',
          price: 3.99,
          image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400',
          category: 'Beverages',
          rating: 4.6,
          prepTime: '2-5 min'
        },
        {
          id: '10',
          name: 'Iced Coffee',
          description: 'Cold brew coffee with ice',
          price: 4.99,
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
          category: 'Beverages',
          rating: 4.5,
          prepTime: '3-7 min'
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setFoodItems(mockItems);
        setFilteredItems(mockItems);
        setLoading(false);
      }, 1000);
    };

    fetchFoodItems();
  }, []);

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