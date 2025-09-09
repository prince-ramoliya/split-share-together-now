
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
    
    copyText += "💰 *Individual Contributions:*\n";
    Object.entries(balances).forEach(([person, balance]) => {
      const amountPaid = balance + perPersonShare;
      copyText += `• ${person}: ₹${amountPaid.toFixed(2)}\n`;
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Expense Split Results
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Summary of expense distribution and settlement requirements.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border">
            <CardContent className="py-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{totalExpense.toFixed(2)}</p>
                  <p className="text-muted-foreground text-sm">Total Expense</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border">
            <CardContent className="py-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{perPersonShare.toFixed(2)}</p>
                  <p className="text-muted-foreground text-sm">Per Person</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border">
            <CardContent className="py-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
                  <p className="text-muted-foreground text-sm">Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Individual Contributions */}
      <Card className="bg-card border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Individual Contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {Object.entries(balances).map(([person, balance]) => {
              // Calculate how much this person paid
              const amountPaid = balance + perPersonShare;
              
              return (
                <div
                  key={person}
                  className="flex justify-between items-center p-4 rounded-lg bg-muted/50 border border-border"
                >
                  <span className="font-medium text-foreground">{person}</span>
                  <span className="font-semibold text-foreground text-lg">
                    ₹{amountPaid.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

        {/* Transactions */}
        {transactions.length > 0 && (
          <Card className="bg-card border mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">Settlement Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-foreground">
                        <strong>{transaction.from}</strong> owes <strong>{transaction.to}</strong>
                      </span>
                    </div>
                    <span className="font-bold text-foreground text-lg">
                      ₹{transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onEdit}
              className="min-h-[48px] w-full sm:w-auto"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Expenses
            </Button>

            {!isGuestMode && (
              <Button
                variant="outline"
                onClick={onSave}
                className="min-h-[48px] w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to History
              </Button>
            )}

            <Button
              onClick={copyResults}
              variant="outline"
              className="min-h-[48px] w-full sm:w-auto"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Results
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              onClick={onShareWhatsApp}
              className="bg-green-600 hover:bg-green-700 text-white min-h-[48px] w-full sm:w-auto"
            >
              <Share className="w-4 h-4 mr-2" />
              Share on WhatsApp
            </Button>

            <Button
              variant="destructive"
              onClick={onReset}
              className="min-h-[48px] w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>

        {isGuestMode && (
          <Card className="bg-muted/50 border border-border">
            <CardContent className="py-4">
              <p className="text-muted-foreground text-sm text-center">
                <strong>Guest Mode:</strong> Sign in to save this expense split to your history and access it later.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
