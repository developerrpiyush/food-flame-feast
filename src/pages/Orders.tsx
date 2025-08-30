import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Orders: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.orders.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-8xl mb-6">📋</div>
            <h1 className="text-3xl font-bold mb-4">No orders yet</h1>
            <p className="text-muted-foreground mb-8">
              You haven't placed any orders yet. Start exploring our delicious menu!
            </p>
            <Link to="/menu">
              <Button className="btn-hero">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'confirmed': return 'bg-info text-info-foreground';
      case 'preparing': return 'bg-primary text-primary-foreground';
      case 'out-for-delivery': return 'bg-chinese text-white';
      case 'delivered': return 'bg-success text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

          <div className="space-y-6">
            {user.orders.map((order) => (
              <Card key={order.id} className="food-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="h-5 w-5 text-primary" />
                      Order #{order.id}
                    </CardTitle>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {order.address.city}, {order.address.state}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-lg font-bold">
                      Total: <span className="text-primary">${order.total.toFixed(2)}</span>
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                      <Link to="/menu">
                        <Button size="sm" className="btn-hero">
                          Reorder
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};