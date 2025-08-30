import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, CreditCard, Truck } from 'lucide-react';
import { Address, Order } from '@/types';
import { toast } from '@/hooks/use-toast';

export const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id);
      } else {
        setSelectedAddress(user.addresses[0].id);
      }
    } else {
      setUseNewAddress(true);
    }
  }, [user, items, navigate]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      let deliveryAddress: Address;

      if (useNewAddress) {
        // Create new address
        const addressId = Date.now().toString();
        deliveryAddress = {
          id: addressId,
          ...newAddress,
          isDefault: user!.addresses.length === 0 || saveAddress
        };

        if (saveAddress) {
          // Save address to user profile
          const updatedAddresses = user!.addresses.map(addr => ({ ...addr, isDefault: false }));
          updatedAddresses.push(deliveryAddress);
          updateProfile({ addresses: updatedAddresses });
        }
      } else {
        // Use existing address
        deliveryAddress = user!.addresses.find(addr => addr.id === selectedAddress)!;
      }

      // Create order
      const order: Order = {
        id: Date.now().toString(),
        items: [...items],
        total: total + 2.99 + total * 0.08,
        address: deliveryAddress,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save order to user profile
      const updatedOrders = [...user!.orders, order];
      updateProfile({ orders: updatedOrders });

      // Clear cart
      clearCart();

      // Show success and redirect
      setTimeout(() => {
        navigate('/order-success', { state: { order } });
      }, 2000);

      toast({
        title: "Order placed successfully! 🎉",
        description: "Your delicious food is being prepared",
      });

    } catch (error) {
      toast({
        title: "Order failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) return null;

  const finalTotal = total + 2.99 + total * 0.08;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card className="food-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.addresses.length > 0 && (
                    <RadioGroup value={useNewAddress ? 'new' : selectedAddress} onValueChange={(value) => {
                      if (value === 'new') {
                        setUseNewAddress(true);
                      } else {
                        setUseNewAddress(false);
                        setSelectedAddress(value);
                      }
                    }}>
                      {user.addresses.map((address) => (
                        <div key={address.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value={address.id} id={address.id} />
                          <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                            <div>
                              <p className="font-medium">{address.street}</p>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              {address.isDefault && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                          </Label>
                        </div>
                      ))}
                      
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value="new" id="new" />
                        <Label htmlFor="new" className="cursor-pointer">Use new address</Label>
                      </div>
                    </RadioGroup>
                  )}

                  {useNewAddress && (
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            placeholder="123 Main Street"
                            value={newAddress.street}
                            onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              placeholder="New York"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              placeholder="NY"
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="10001"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="save-address" 
                          checked={saveAddress}
                          onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                        />
                        <Label htmlFor="save-address">Save this address for future orders</Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="food-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg bg-accent/50">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="food-card sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
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
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>$2.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(total * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || (useNewAddress && (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode))}
                    className="w-full btn-hero"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};