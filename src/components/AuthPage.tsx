import React from 'react';
import { SignIn, SignUp, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Calculator, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onSkipAuth: () => void;
}

const AuthPage = ({ onAuthSuccess, onSkipAuth }: AuthPageProps) => {
  const [isLogin, setIsLogin] = React.useState(true);

  // Component to handle auto-redirect when signed in
  const AutoRedirect = () => {
    React.useEffect(() => {
      onAuthSuccess();
    }, []);
    return null;
  };

  const handleSkipAuth = () => {
    toast({
      title: "Using as Guest",
      description: "You can split expenses but won't be able to save history.",
    });
    onSkipAuth();
  };

  return (
    <div className="min-h-screen font-dm-sans relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-800 dark:to-purple-900 transition-all duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-800 dark:to-blue-800 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-gradient-to-r from-green-200 to-teal-200 dark:from-green-800 dark:to-teal-800 rounded-full opacity-35 animate-float" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <SignedIn>
        <AutoRedirect />
      </SignedIn>

      <SignedOut>
        <div className="container mx-auto px-4 py-8 max-w-md relative z-10 flex items-center justify-center min-h-screen">
          <Card className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-white/20 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Join Split Expenses'}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300">
                {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Skip Authentication Button */}
              <Button
                onClick={handleSkipAuth}
                variant="outline"
                className="w-full py-3 text-lg font-semibold rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 transition-all duration-300"
              >
                <div className="flex items-center">
                  <UserX className="w-5 h-5 mr-3" />
                  Continue as Guest
                </div>
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                    Or sign in to save history
                  </span>
                </div>
              </div>

              {/* Clerk Auth Components */}
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center space-x-2 mb-4">
                  <Button
                    variant={isLogin ? "default" : "outline"}
                    onClick={() => setIsLogin(true)}
                    className="flex-1"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "outline"}
                    onClick={() => setIsLogin(false)}
                    className="flex-1"
                  >
                    Sign Up
                  </Button>
                </div>
                
                <div className="flex justify-center">
                  {isLogin ? (
                    <SignIn 
                      fallbackRedirectUrl="/"
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600',
                          card: 'shadow-none bg-transparent',
                          headerTitle: 'hidden',
                          headerSubtitle: 'hidden'
                        }
                      }}
                    />
                  ) : (
                    <SignUp 
                      fallbackRedirectUrl="/"
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600',
                          card: 'shadow-none bg-transparent',
                          headerTitle: 'hidden',
                          headerSubtitle: 'hidden'
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Guest Mode Notice */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                <strong>Guest Mode:</strong> Split expenses without signing up, but you won't be able to save or access history.
              </div>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
    </div>
  );
};

export default AuthPage;