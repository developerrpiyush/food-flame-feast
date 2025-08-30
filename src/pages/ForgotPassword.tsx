import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'security' | 'success'>('email');
  const [userSecurityQuestion, setUserSecurityQuestion] = useState('');
  const [recoveredPassword, setRecoveredPassword] = useState('');
  const { resetPassword } = useAuth();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check if user exists and get security question
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (user) {
        setUserSecurityQuestion(user.securityQuestion);
        setStep('security');
      } else {
        // Show error toast here if needed
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
    
    setIsLoading(false);
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = resetPassword(email, securityAnswer);
    if (result.success && result.password) {
      setRecoveredPassword(result.password);
      setStep('success');
    }
    
    setIsLoading(false);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-warning/5 px-4 pt-20">
        <div className="w-full max-w-md">
          <Card className="food-card shadow-2xl animate-bounce-in">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-success flex items-center justify-center text-3xl mb-4">
                ✅
              </div>
              <CardTitle className="text-2xl font-bold">Password Recovered</CardTitle>
              <CardDescription>Your password has been retrieved successfully</CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your password is:</p>
                <p className="text-lg font-mono font-bold">{recoveredPassword}</p>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Please save this password and consider changing it after logging in.
              </p>
              
              <Link to="/login">
                <Button className="w-full btn-hero">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'security') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-warning/5 px-4 pt-20">
        <div className="w-full max-w-md">
          <Card className="food-card shadow-2xl animate-bounce-in">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl mb-4">
                🔐
              </div>
              <CardTitle className="text-2xl font-bold">Security Question</CardTitle>
              <CardDescription>Answer your security question to recover password</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Security Question</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{userSecurityQuestion}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityAnswer">Your Answer</Label>
                  <Input
                    id="securityAnswer"
                    type="text"
                    placeholder="Enter your answer"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-hero" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying...' : 'Verify Answer'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setStep('email')}
                  className="inline-flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-warning/5 px-4 pt-20">
      <div className="w-full max-w-md">
        <Card className="food-card shadow-2xl animate-bounce-in">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center text-3xl mb-4">
              🔐
            </div>
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>Enter your email to reset your password</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-hero" 
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Continue'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};