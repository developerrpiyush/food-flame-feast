import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Users, Clock, Award } from 'lucide-react';

export const About: React.FC = () => {
  const stats = [
    { icon: <Users className="h-8 w-8 text-primary" />, value: '50,000+', label: 'Happy Customers' },
    { icon: <Clock className="h-8 w-8 text-primary" />, value: '25 min', label: 'Average Delivery' },
    { icon: <Award className="h-8 w-8 text-primary" />, value: '4.8★', label: 'Rating' },
    { icon: <Heart className="h-8 w-8 text-primary" />, value: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-primary">FoodFlame</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're passionate about bringing you the best food from your favorite restaurants, 
            delivered fresh and fast to your doorstep.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="food-card text-center hover-glow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024, FoodFlame started with a simple mission: to connect food lovers 
                  with their favorite restaurants through technology and exceptional service.
                </p>
                <p>
                  What began as a small startup has grown into a trusted platform serving thousands 
                  of customers daily. We partner with the best local restaurants to bring you 
                  authentic, delicious meals whenever you crave them.
                </p>
                <p>
                  Our commitment to quality, speed, and customer satisfaction drives everything we do. 
                  From our easy-to-use app to our reliable delivery network, we're constantly 
                  innovating to make your food delivery experience better.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600" 
                alt="Restaurant kitchen"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl hover-glow"
              />
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="text-center bg-accent/50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            To make great food accessible to everyone, everywhere. We believe that good food 
            brings people together and makes life better, one meal at a time.
          </p>
        </section>
      </div>
    </div>
  );
};