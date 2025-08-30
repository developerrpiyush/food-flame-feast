import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, MapPin, Truck } from 'lucide-react';
import { Order } from '@/types';

export const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order as Order;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <Card className="food-card max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Order not found</h2>
            <Link to="/">
              <Button className="btn-hero">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-br from-success/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className={`text-center mb-8 ${isVisible ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-success mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground">Your delicious food is being prepared</p>
          </div>

          {/* Order Details */}
          <Card className={`food-card mb-6 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`} 
                style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <p className="text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Cash on Delivery</p>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="flex items-start gap-3 mb-6 p-4 bg-accent/50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Delivery Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {order.address.street}<br />
                    {order.address.city}, {order.address.state} {order.address.zipCode}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                <h3 className="font-medium">Order Items</h3>
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Estimated Delivery Time */}
          <Card className={`food-card mb-6 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
                style={{animationDelay: '0.4s'}}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Estimated Delivery Time</h3>
                  <p className="text-muted-foreground">25-35 minutes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Your order is being prepared and will be on its way soon!</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}
               style={{animationDelay: '0.6s'}}>
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </Link>
            <Link to="/menu" className="flex-1">
              <Button className="w-full btn-hero">
                Order Again
              </Button>
            </Link>
          </div>

          {/* Fun Animation */}
          <div className={`text-center mt-8 ${isVisible ? 'animate-pulse-soft' : 'opacity-0'}`}
               style={{animationDelay: '0.8s'}}>
            <div className="text-4xl mb-2">🍕🚚💨</div>
            <p className="text-sm text-muted-foreground">
              Your food is on its way to make your day amazing!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};