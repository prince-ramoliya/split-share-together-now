
import React from 'react';
import { Share2, Save, RotateCcw } from 'lucide-react';
import { Balance } from '../utils/expenseCalculations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultsPageProps {
  results: {
    balances: Balance[];
    totalExpense: number;
    perPersonShare: number;
    transactions: Array<{ from: string; to: string; amount: number }>;
  };
  onShareWhatsApp: () => void;
  onSave: () => void;
  onEdit: () => void;
  onReset: () => void;
}

const ResultsPage = ({ results, onShareWhatsApp, onSave, onEdit, onReset }: ResultsPageProps) => {
  return (
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
          onClick={onShareWhatsApp}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share on WhatsApp
        </Button>
        
        <Button
          variant="outline"
          onClick={onSave}
          className="px-8 py-3 text-lg rounded-full"
        >
          <Save className="mr-2 h-4 w-4" />
          Save to History
        </Button>
        
        <Button
          variant="outline"
          onClick={onEdit}
          className="px-8 py-3 text-lg rounded-full"
        >
          Edit Details
        </Button>
        
        <Button
          variant="outline"
          onClick={onReset}
          className="px-8 py-3 text-lg rounded-full text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
