import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Address } from '@/types';
import { toast } from '@/hooks/use-toast';

export const Addresses: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const handleAddAddress = () => {
    if (!user) return;

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: user.addresses.length === 0
    };

    const updatedAddresses = [...user.addresses, address];
    updateProfile({ addresses: updatedAddresses });
    
    setNewAddress({ street: '', city: '', state: '', zipCode: '' });
    setIsAddingAddress(false);
    
    toast({
      title: "Address added",
      description: "New address has been saved to your account",
    });
  };

  const handleEditAddress = () => {
    if (!user || !editingAddress) return;

    const updatedAddresses = user.addresses.map(addr =>
      addr.id === editingAddress.id ? editingAddress : addr
    );
    
    updateProfile({ addresses: updatedAddresses });
    setEditingAddress(null);
    
    toast({
      title: "Address updated",
      description: "Address has been successfully updated",
    });
  };

  const handleDeleteAddress = (id: string) => {
    if (!user) return;

    const addressToDelete = user.addresses.find(addr => addr.id === id);
    const updatedAddresses = user.addresses.filter(addr => addr.id !== id);
    
    // If deleted address was default, make first remaining address default
    if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }
    
    updateProfile({ addresses: updatedAddresses });
    
    toast({
      title: "Address deleted",
      description: "Address has been removed from your account",
    });
  };

  const handleSetDefault = (id: string) => {
    if (!user) return;

    const updatedAddresses = user.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    
    updateProfile({ addresses: updatedAddresses });
    
    toast({
      title: "Default address updated",
      description: "This address is now your default delivery address",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Delivery Addresses</h1>
            <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
              <DialogTrigger asChild>
                <Button className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        placeholder="NY"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                      placeholder="10001"
                    />
                  </div>
                  <Button 
                    onClick={handleAddAddress}
                    disabled={!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode}
                    className="w-full btn-hero"
                  >
                    Add Address
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {user.addresses.length === 0 ? (
            <Card className="food-card text-center py-12">
              <CardContent>
                <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first delivery address to get started
                </p>
                <Button onClick={() => setIsAddingAddress(true)} className="btn-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {user.addresses.map((address) => (
                <Card key={address.id} className="food-card relative">
                  {address.isDefault && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        Default
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div className="flex-1">
                        <p className="font-medium">{address.street}</p>
                        <p className="text-muted-foreground text-sm">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingAddress({ ...address })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Address</DialogTitle>
                          </DialogHeader>
                          {editingAddress && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-street">Street Address</Label>
                                <Input
                                  id="edit-street"
                                  value={editingAddress.street}
                                  onChange={(e) => setEditingAddress({...editingAddress, street: e.target.value})}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="edit-city">City</Label>
                                  <Input
                                    id="edit-city"
                                    value={editingAddress.city}
                                    onChange={(e) => setEditingAddress({...editingAddress, city: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-state">State</Label>
                                  <Input
                                    id="edit-state"
                                    value={editingAddress.state}
                                    onChange={(e) => setEditingAddress({...editingAddress, state: e.target.value})}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="edit-zipCode">ZIP Code</Label>
                                <Input
                                  id="edit-zipCode"
                                  value={editingAddress.zipCode}
                                  onChange={(e) => setEditingAddress({...editingAddress, zipCode: e.target.value})}
                                />
                              </div>
                              <Button onClick={handleEditAddress} className="w-full btn-hero">
                                Update Address
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};