
import React from 'react';
import { Users, Calculator, Plus, Minus, Sparkles, TrendingUp, CreditCard, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LandingPageProps {
  numberOfPeople: number;
  setNumberOfPeople: (count: number) => void;
  onStart: () => void;
}

const LandingPage = ({ numberOfPeople, setNumberOfPeople, onStart }: LandingPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-fade-in">
      {/* Hero Icon */}
      <div className="space-y-8">
        {/* Hero Icon */}
        <div className="relative mx-auto">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
            <Calculator className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Split Expenses
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300">
            Effortlessly & Fairly
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
          Turn complicated trip expenses into simple, fair splits. 
          <br className="hidden md:block" />
          Calculate, share, and settle up with friends instantly.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Smart Calculations</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <CreditCard className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Multiple Records</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <Share2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Easy Sharing</span>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-8 w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
          <div className="space-y-6">
            <div className="text-center">
              <label className="text-lg font-semibold text-gray-700 dark:text-gray-300 block mb-4">
                How many people are splitting?
              </label>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumberOfPeople(Math.max(2, numberOfPeople - 1))}
                  disabled={numberOfPeople <= 2}
                  className="rounded-full hover:scale-105 transition-transform duration-200"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-20 text-center text-xl font-bold rounded-xl border-2"
                  min="2"
                  max="20"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNumberOfPeople(Math.min(20, numberOfPeople + 1))}
                  disabled={numberOfPeople >= 20}
                  className="rounded-full hover:scale-105 transition-transform duration-200"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={onStart}
              size="lg"
              className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] transform relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Users className="mr-3 h-5 w-5" />
              Start Splitting Expenses
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
