import React, { useState, useEffect } from 'react';
import { Sun, Moon, Users, Calculator, Share2, RotateCcw, Plus, Minus, Sparkles, TrendingUp, CreditCard, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Person, ExpenseRecord, calculateExpenseSplit, generateWhatsAppMessage } from '../utils/expenseCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

type AppStep = 'landing' | 'input' | 'results';

const ExpenseSplitter = () => {
  const { theme, toggleTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [people, setPeople] = useState<Person[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('expense-splitter-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.people?.length > 0) {
          setPeople(parsed.people);
          setNumberOfPeople(parsed.people.length);
          setCurrentStep(parsed.currentStep || 'input');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever people data changes
  useEffect(() => {
    if (people.length > 0) {
      localStorage.setItem('expense-splitter-data', JSON.stringify({
        people,
        currentStep
      }));
    }
  }, [people, currentStep]);

  const initializePeople = () => {
    const newPeople: Person[] = Array.from({ length: numberOfPeople }, (_, index) => ({
      name: '',
      expenses: [{ amountPaid: 0, description: '' }]
    }));
    setPeople(newPeople);
    setCurrentStep('input');
  };

  const updatePersonName = (personIndex: number, name: string) => {
    const updatedPeople = [...people];
    updatedPeople[personIndex] = { ...updatedPeople[personIndex], name };
    setPeople(updatedPeople);
  };

  const updateExpense = (personIndex: number, expenseIndex: number, field: keyof ExpenseRecord, value: string | number) => {
    const updatedPeople = [...people];
    const updatedExpenses = [...updatedPeople[personIndex].expenses];
    updatedExpenses[expenseIndex] = { ...updatedExpenses[expenseIndex], [field]: value };
    updatedPeople[personIndex] = { ...updatedPeople[personIndex], expenses: updatedExpenses };
    setPeople(updatedPeople);
  };

  const addExpense = (personIndex: number) => {
    const updatedPeople = [...people];
    updatedPeople[personIndex] = {
      ...updatedPeople[personIndex],
      expenses: [...updatedPeople[personIndex].expenses, { amountPaid: 0, description: '' }]
    };
    setPeople(updatedPeople);
  };

  const removeExpense = (personIndex: number, expenseIndex: number) => {
    const updatedPeople = [...people];
    if (updatedPeople[personIndex].expenses.length > 1) {
      updatedPeople[personIndex] = {
        ...updatedPeople[personIndex],
        expenses: updatedPeople[personIndex].expenses.filter((_, i) => i !== expenseIndex)
      };
      setPeople(updatedPeople);
    }
  };

  const addPerson = () => {
    setPeople([...people, { name: '', expenses: [{ amountPaid: 0, description: '' }] }]);
    setNumberOfPeople(prev => prev + 1);
  };

  const removePerson = (index: number) => {
    if (people.length > 2) {
      const updatedPeople = people.filter((_, i) => i !== index);
      setPeople(updatedPeople);
      setNumberOfPeople(prev => prev - 1);
    }
  };

  const validateAndCalculate = () => {
    // Validation
    const errors: string[] = [];
    
    if (people.length < 2) {
      errors.push('At least 2 people are required');
    }

    people.forEach((person, index) => {
      if (!person.name.trim()) {
        errors.push(`Person ${index + 1} name is required`);
      }
      
      const hasValidExpense = person.expenses.some(expense => expense.amountPaid > 0);
      if (!hasValidExpense) {
        errors.push(`${person.name || `Person ${index + 1}`} must have at least one expense with amount greater than 0`);
      }

      person.expenses.forEach((expense, expenseIndex) => {
        if (expense.amountPaid < 0) {
          errors.push(`Amount for ${person.name || `Person ${index + 1}`} expense ${expenseIndex + 1} cannot be negative`);
        }
      });
    });

    const totalExpense = people.reduce((sum, person) => 
      sum + person.expenses.reduce((expenseSum, expense) => expenseSum + expense.amountPaid, 0), 0
    );
    
    if (totalExpense <= 0) {
      errors.push('Total expense must be greater than 0');
    }

    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      setCurrentStep('results');
      setIsCalculating(false);
    }, 500);
  };

  const shareOnWhatsApp = () => {
    const { balances, totalExpense, perPersonShare, transactions } = calculateExpenseSplit(people);
    const message = generateWhatsAppMessage(balances, totalExpense, perPersonShare, transactions);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetApp = () => {
    setPeople([]);
    setNumberOfPeople(2);
    setCurrentStep('landing');
    localStorage.removeItem('expense-splitter-data');
    toast({
      title: "Reset Complete",
      description: "All data has been cleared"
    });
  };

  const results = currentStep === 'results' ? calculateExpenseSplit(people) : null;

  return (
    <div className="min-h-screen font-dm-sans relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-800 dark:to-purple-900 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-800 dark:to-blue-800 rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 bg-gradient-to-r from-green-200 to-teal-200 dark:from-green-800 dark:to-teal-800 rounded-full opacity-35 animate-float" style={{animationDelay: '0.5s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-white/20 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Landing Page */}
        {currentStep === 'landing' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-fade-in">
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
                    onClick={initializePeople}
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
        )}

        {/* Input Form Page */}
        {currentStep === 'input' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Enter Expense Details
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Add names and multiple expense records for each person
              </p>
            </div>

            <div className="grid gap-4 md:gap-6">
              {people.map((person, personIndex) => (
                <Card key={personIndex} className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 hover:shadow-lg transition-all">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">Person {personIndex + 1}</span>
                      {people.length > 2 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePerson(personIndex)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remove
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Name *
                      </label>
                      <Input
                        placeholder="Enter name"
                        value={person.name}
                        onChange={(e) => updatePersonName(personIndex, e.target.value)}
                        className="text-lg"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Expenses
                        </label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addExpense(personIndex)}
                          className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Expense
                        </Button>
                      </div>
                      
                      {person.expenses.map((expense, expenseIndex) => (
                        <div key={expenseIndex} className="flex gap-2 items-start p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Amount (₹)"
                              value={expense.amountPaid || ''}
                              onChange={(e) => updateExpense(personIndex, expenseIndex, 'amountPaid', parseFloat(e.target.value) || 0)}
                              className="mb-2"
                              min="0"
                              step="0.01"
                            />
                            <Input
                              placeholder="Description (e.g., Hotel, Food)"
                              value={expense.description}
                              onChange={(e) => updateExpense(personIndex, expenseIndex, 'description', e.target.value)}
                            />
                          </div>
                          {person.expenses.length > 1 && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeExpense(personIndex, expenseIndex)}
                              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                onClick={addPerson}
                disabled={people.length >= 20}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Person
              </Button>

              <Button
                onClick={validateAndCalculate}
                disabled={isCalculating}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Split
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Results Page */}
        {currentStep === 'results' && results && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                💰 Final Split Results
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Here's how the expenses should be settled
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">Total Expense</h3>
                  <p className="text-3xl font-bold">₹{results.totalExpense}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-medium mb-2">Per Person Share</h3>
                  <p className="text-3xl font-bold">₹{results.perPersonShare}</p>
                </CardContent>
              </Card>
            </div>

            {/* Individual Contributions */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2">
              <CardHeader>
                <CardTitle>💳 Individual Contributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.balances.map((person, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-lg">{person.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Total Paid: ₹{person.totalPaid}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${person.balance > 0.01 ? 'text-green-600' : person.balance < -0.01 ? 'text-red-600' : 'text-gray-600'}`}>
                            {person.balance > 0.01 ? `+₹${Math.abs(person.balance).toFixed(2)}` : 
                             person.balance < -0.01 ? `-₹${Math.abs(person.balance).toFixed(2)}` : 
                             '₹0.00'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {person.balance > 0.01 ? 'Should receive' : 
                             person.balance < -0.01 ? 'Should pay' : 
                             'Balanced'}
                          </p>
                        </div>
                      </div>
                      
                      {person.expenses.length > 0 && (
                        <div className="space-y-1 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Expense Details:</p>
                          {person.expenses.map((expense, expenseIndex) => (
                            <div key={expenseIndex} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                              <span>{expense.description || `Expense ${expenseIndex + 1}`}</span>
                              <span>₹{expense.amountPaid}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Settlement Instructions */}
            {results.transactions.length > 0 && (
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2">
                <CardHeader>
                  <CardTitle>🔄 Settlement Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.transactions.map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400">
                        <p className="text-gray-900 dark:text-white">
                          <span className="font-medium">{transaction.from}</span> should pay{' '}
                          <span className="font-bold text-yellow-700 dark:text-yellow-400">₹{transaction.amount}</span> to{' '}
                          <span className="font-medium">{transaction.to}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {results.transactions.length === 0 && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6 text-center">
                  <p className="text-green-800 dark:text-green-200 font-medium text-lg">
                    ✅ All expenses are perfectly balanced! No settlements needed.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={shareOnWhatsApp}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Share2 className="mr-2 h-5 w-5" />
                Share on WhatsApp
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setCurrentStep('input')}
                className="px-8 py-3 text-lg rounded-full"
              >
                Edit Details
              </Button>
              
              <Button
                variant="outline"
                onClick={resetApp}
                className="px-8 py-3 text-lg rounded-full text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSplitter;
