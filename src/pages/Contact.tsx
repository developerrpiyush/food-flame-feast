import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">We're here to help! Reach out to us anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="food-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Our Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>123 Food Street<br />Delivery City, DC 12345</p>
              </CardContent>
            </Card>

            <Card className="food-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>+1 (555) 123-FOOD</p>
              </CardContent>
            </Card>

            <Card className="food-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>hello@foodflame.com</p>
              </CardContent>
            </Card>

            <Card className="food-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>24/7 Customer Support</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};