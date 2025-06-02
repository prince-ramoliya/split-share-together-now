
import React, { useState, useEffect } from 'react';
import { Sun, Moon, History, LogOut, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { Person, ExpenseRecord, calculateExpenseSplit, generateWhatsAppMessage } from '../utils/expenseCalculations';
import { saveExpenseHistory } from '../utils/historyUtils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import AuthPage from './AuthPage';
import HistoryPage from './HistoryPage';
import LandingPage from './LandingPage';
import ExpenseInputForm from './ExpenseInputForm';
import ResultsPage from './ResultsPage';

type AppStep = 'landing' | 'input' | 'results';
type AppView = 'main' | 'history';

const ExpenseSplitter = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading, signOut } = useAuth();
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('main');
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [people, setPeople] = useState<Person[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [expenseName, setExpenseName] = useState<string>('');

  // Load data from localStorage on mount
  useEffect(() => {
    const storageKey = user ? `expense-splitter-data-${user.id}` : 'expense-splitter-data-guest';
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.people?.length > 0) {
          setPeople(parsed.people);
          setNumberOfPeople(parsed.people.length);
          setCurrentStep(parsed.currentStep || 'input');
          setExpenseName(parsed.expenseName || '');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [user, isGuestMode]);

  // Save data to localStorage whenever people data changes
  useEffect(() => {
    if (people.length > 0) {
      const storageKey = user ? `expense-splitter-data-${user.id}` : 'expense-splitter-data-guest';
      localStorage.setItem(storageKey, JSON.stringify({
        people,
        currentStep,
        expenseName
      }));
    }
  }, [people, currentStep, expenseName, user, isGuestMode]);

  // Auto-save to history when results are calculated (only for authenticated users)
  useEffect(() => {
    if (currentStep === 'results' && people.length > 0 && user && !isGuestMode) {
      const autoSaveToHistory = async () => {
        const results = calculateExpenseSplit(people);
        const saveResult = await saveExpenseHistory(
          people,
          results.totalExpense,
          results.perPersonShare,
          expenseName || 'Untitled Split'
        );

        if (saveResult.success) {
          console.log('Expense automatically saved to history');
        } else {
          console.error('Failed to auto-save expense:', saveResult.error);
        }
      };

      autoSaveToHistory();
    }
  }, [currentStep, people, expenseName, user, isGuestMode]);

  const handleAuthSuccess = () => {
    setIsGuestMode(false);
  };

  const handleSkipAuth = () => {
    setIsGuestMode(true);
  };

  const handleSignOut = async () => {
    try {
      if (!isGuestMode) {
        await signOut();
      }
      setPeople([]);
      setNumberOfPeople(2);
      setCurrentStep('landing');
      setCurrentView('main');
      setExpenseName('');
      setIsGuestMode(false);
      
      const storageKey = user ? `expense-splitter-data-${user.id}` : 'expense-splitter-data-guest';
      localStorage.removeItem(storageKey);
      
      toast({
        title: "Signed out",
        description: "You've been signed out successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLoadExpense = (expenseData: Person[], name: string) => {
    setPeople(expenseData);
    setNumberOfPeople(expenseData.length);
    setExpenseName(name);
    setCurrentStep('input');
    setCurrentView('main');
  };

  const handleSaveExpense = async () => {
    if (isGuestMode) {
      toast({
        title: "Guest Mode",
        description: "Sign in to save expenses to history",
        variant: "destructive"
      });
      return;
    }

    if (people.length === 0) {
      toast({
        title: "Error",
        description: "No expense data to save",
        variant: "destructive"
      });
      return;
    }

    const results = calculateExpenseSplit(people);
    const saveResult = await saveExpenseHistory(
      people,
      results.totalExpense,
      results.perPersonShare,
      expenseName || 'Untitled Split'
    );

    if (saveResult.success) {
      toast({
        title: "Success",
        description: "Expense saved to history"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive"
      });
    }
  };

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
    const calculationResults = calculateExpenseSplit(people);
    const message = generateWhatsAppMessage(calculationResults.balances, calculationResults.totalExpense, calculationResults.perPersonShare, calculationResults.transactions);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetApp = () => {
    setPeople([]);
    setNumberOfPeople(2);
    setCurrentStep('landing');
    setExpenseName('');
    if (user) {
      localStorage.removeItem(`expense-splitter-data-${user.id}`);
    }
    toast({
      title: "Reset Complete",
      description: "All data has been cleared"
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-800 dark:to-purple-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!user && !isGuestMode) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} onSkipAuth={handleSkipAuth} />;
  }

  if (currentView === 'history') {
    if (isGuestMode) {
      toast({
        title: "Guest Mode",
        description: "Sign in to access expense history",
        variant: "destructive"
      });
      setCurrentView('main');
      return null;
    }
    return <HistoryPage onBack={() => setCurrentView('main')} onLoadExpense={handleLoadExpense} />;
  }

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

      {/* Top Navigation */}
      <div className="absolute top-6 right-6 z-10 flex items-center space-x-3">
        {!isGuestMode && (
          <Button
            variant="outline"
            onClick={() => setCurrentView('history')}
            className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-white/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-white/20 hover:scale-110 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-2 border-white/20 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          {isGuestMode ? <User className="h-4 w-4 mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
          {isGuestMode ? 'Sign In' : 'Sign Out'}
        </Button>
      </div>

      {/* Guest Mode Indicator */}
      {isGuestMode && (
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800">
            Guest Mode - History disabled
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {currentStep === 'landing' && (
          <LandingPage
            numberOfPeople={numberOfPeople}
            setNumberOfPeople={setNumberOfPeople}
            onStart={initializePeople}
          />
        )}

        {currentStep === 'input' && (
          <ExpenseInputForm
            people={people}
            expenseName={expenseName}
            setExpenseName={setExpenseName}
            updatePersonName={updatePersonName}
            updateExpense={updateExpense}
            addExpense={addExpense}
            removeExpense={removeExpense}
            addPerson={addPerson}
            removePerson={removePerson}
            onCalculate={validateAndCalculate}
            onSave={handleSaveExpense}
            isCalculating={isCalculating}
            isGuestMode={isGuestMode}
          />
        )}

        {currentStep === 'results' && results && (
          <ResultsPage
            results={results}
            onShareWhatsApp={shareOnWhatsApp}
            onSave={handleSaveExpense}
            onEdit={() => setCurrentStep('input')}
            onReset={resetApp}
            isGuestMode={isGuestMode}
          />
        )}
      </div>
    </div>
  );
};

export default ExpenseSplitter;
