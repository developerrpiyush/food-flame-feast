import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Truck, Shield, Heart } from 'lucide-react';
import { FoodCard } from '@/components/FoodCard';
import { FoodItem } from '@/types';

export const Home: React.FC = () => {
  const [featuredItems, setFeaturedItems] = useState<FoodItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mock featured items - in real app, would fetch from API
    const mockFeatured: FoodItem[] = [
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
      },
      {
        id: '3',
        name: 'Chocolate Brownie',
        description: 'Rich, fudgy brownie with chocolate chips',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
        category: 'Desserts',
        rating: 4.9,
        prepTime: '10-15 min'
      }
    ];
    setFeaturedItems(mockFeatured);
    setIsVisible(true);
  }, []);

  const categories = [
    { name: 'Pizza', icon: '🍕', color: 'pizza', count: '25+ items' },
    { name: 'Burgers', icon: '🍔', color: 'burger', count: '18+ items' },
    { name: 'Chinese', icon: '🥡', color: 'chinese', count: '30+ items' },
    { name: 'Desserts', icon: '🍰', color: 'dessert', count: '15+ items' }
  ];

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Quality Food',
      description: 'Fresh ingredients and top-rated restaurants'
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: 'Customer Love',
      description: '99% customer satisfaction rate'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-warning/5 to-chinese/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  🔥 Now delivering in your area
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Delicious Food
                  <span className="block text-primary">Delivered Fast</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Order from your favorite restaurants and get fresh, hot food delivered to your doorstep in minutes.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu">
                  <Button size="lg" className="btn-hero text-lg px-8 py-6">
                    Order Now
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover-glow">
                  View Menu
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-sm">
                        😊
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-semibold">4.8</span>
                    </div>
                    <p className="text-sm text-muted-foreground">5000+ reviews</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative ${isVisible ? 'animate-slide-in' : 'opacity-0'}`}>
              <div className="hero-card p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/20 text-white">30% OFF</Badge>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600" 
                  alt="Delicious Pizza"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl hover-glow"
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold mb-2">Special Pizza Deal</h3>
                  <p className="text-white/90">Get 30% off on all pizzas today!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Browse Categories</h2>
            <p className="text-xl text-muted-foreground">What are you craving today?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} to="/menu" className="group">
                <Card className={`btn-food-category text-center group-hover:scale-105 scroll-reveal ${isVisible ? 'revealed' : ''}`} 
                      style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Dishes</h2>
            <p className="text-xl text-muted-foreground">Our most popular items</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item, index) => (
              <div key={item.id} className={`scroll-reveal ${isVisible ? 'revealed' : ''}`}
                   style={{animationDelay: `${index * 0.2}s`}}>
                <FoodCard item={item} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/menu">
              <Button size="lg" className="btn-hero">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose FoodFlame?</h2>
            <p className="text-xl text-muted-foreground">We're committed to delivering the best experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`text-center p-8 hover-glow scroll-reveal ${isVisible ? 'revealed' : ''}`}
                    style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};