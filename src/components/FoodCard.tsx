import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Plus } from 'lucide-react';
import { FoodItem } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface FoodCardProps {
  item: FoodItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  return (
    <Card className="food-card group cursor-pointer">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-primary text-primary-foreground">
              {item.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span>{item.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span>{item.prepTime}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${item.price.toFixed(2)}
            </span>
            
            <Button 
              onClick={handleAddToCart}
              className="btn-hero rounded-full w-10 h-10 p-0 hover:scale-110"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};