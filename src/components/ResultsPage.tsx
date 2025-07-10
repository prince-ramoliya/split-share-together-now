
import React from 'react';
import { ArrowLeft, Share, Save, Edit3, RotateCcw, DollarSign, TrendingUp, Users, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ExpenseSplitResults {
  balances: Record<string, number>;
  totalExpense: number;
  perPersonShare: number;
  transactions: Array<{
    from: string;
    to: string;
    amount: number;
  }>;
}

interface ResultsPageProps {
  results: ExpenseSplitResults;
  onShareWhatsApp: () => void;
  onSave: () => void;
  onEdit: () => void;
  onReset: () => void;
  isGuestMode?: boolean;
}

const ResultsPage = ({ 
  results, 
  onShareWhatsApp, 
  onSave, 
  onEdit, 
  onReset,
  isGuestMode = false
}: ResultsPageProps) => {
  const { balances, totalExpense, perPersonShare, transactions } = results;
  const { toast } = useToast();

  const copyResults = async () => {
    let copyText = "💰 *Expense Split Summary*\n\n";
    
    copyText += "📋 *Individual Balances:*\n";
    Object.entries(balances).forEach(([person, balance]) => {
      if (balance > 0) {
        copyText += `• ${person}: +₹${balance.toFixed(2)} (should receive)\n`;
      } else if (balance < 0) {
        copyText += `• ${person}: -₹${Math.abs(balance).toFixed(2)} (owes)\n`;
      } else {
        copyText += `• ${person}: ₹0.00 (balanced)\n`;
      }
    });

    copyText += `\n💸 *Total Expense:* ₹${totalExpense.toFixed(2)}\n`;
    copyText += `👥 *Per Person Share:* ₹${perPersonShare.toFixed(2)}\n\n`;

    if (transactions.length > 0) {
      copyText += "💳 *Settlement Required:*\n";
      transactions.forEach(transaction => {
        copyText += `• ${transaction.from} should pay ₹${transaction.amount.toFixed(2)} to ${transaction.to}\n`;
      });
    } else {
      copyText += "✅ All expenses are already balanced!\n";
    }

    try {
      await navigator.clipboard.writeText(copyText);
      toast({
        title: "Results Copied!",
        description: "Expense split results copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Expense Split Results
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Here's how much everyone owes and who should pay whom.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800">
          <CardContent className="py-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">₹{totalExpense.toFixed(2)}</p>
                <p className="text-green-600 dark:text-green-300 text-sm">Total Expense</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="py-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">₹{perPersonShare.toFixed(2)}</p>
                <p className="text-blue-600 dark:text-blue-300 text-sm">Per Person</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="py-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{transactions.length}</p>
                <p className="text-purple-600 dark:text-purple-300 text-sm">Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Balances */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2">
        <CardHeader>
          <CardTitle className="text-xl">Individual Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {Object.entries(balances).map(([person, balance]) => (
              <div
                key={person}
                className={`flex justify-between items-center p-4 rounded-lg ${
                  balance > 0
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : balance < 0
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white">{person}</span>
                <span
                  className={`font-bold ${
                    balance > 0
                      ? 'text-green-700 dark:text-green-400'
                      : balance < 0
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {balance > 0 ? `+₹${balance.toFixed(2)}` : balance < 0 ? `-₹${Math.abs(balance).toFixed(2)}` : '₹0.00'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      {transactions.length > 0 && (
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2">
          <CardHeader>
            <CardTitle className="text-xl">Who Owes Whom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-gray-900 dark:text-white">
                      <strong>{transaction.from}</strong> owes <strong>{transaction.to}</strong>
                    </span>
                  </div>
                  <span className="font-bold text-orange-700 dark:text-orange-400 text-lg">
                    ₹{transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onEdit}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:scale-105 transition-transform duration-200"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Expenses
        </Button>

        {!isGuestMode && (
          <Button
            variant="outline"
            onClick={onSave}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:scale-105 transition-transform duration-200"
          >
            <Save className="w-4 h-4 mr-2" />
            Save to History
          </Button>
        )}

        <Button
          onClick={copyResults}
          variant="outline"
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:scale-105 transition-transform duration-200"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Results
        </Button>

        <Button
          onClick={onShareWhatsApp}
          className="bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-transform duration-200"
        >
          <Share className="w-4 h-4 mr-2" />
          Share on WhatsApp
        </Button>

        <Button
          variant="outline"
          onClick={onReset}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-transform duration-200"
        >
          <RotateCcw className="w-4 w-4 mr-2" />
          Start Over
        </Button>
      </div>

      {isGuestMode && (
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
          <CardContent className="py-4">
            <p className="text-amber-800 dark:text-amber-200 text-sm text-center">
              <strong>Guest Mode:</strong> Sign in to save this expense split to your history and access it later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultsPage;
