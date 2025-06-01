
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, Calendar, Users, DollarSign, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Person } from '@/utils/expenseCalculations';

interface HistoryItem {
  id: string;
  name: string;
  expense_data: Person[];
  total_expense: number;
  per_person_share: number;
  people_count: number;
  created_at: string;
}

interface HistoryPageProps {
  onBack: () => void;
  onLoadExpense: (data: Person[], name: string) => void;
}

const HistoryPage = ({ onBack, onLoadExpense }: HistoryPageProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('expense_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load expense history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('expense_history')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.map(item => 
        item.id === id ? { ...item, name: newName } : item
      ));
      setEditingId(null);
      toast({
        title: "Success",
        description: "History name updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update history name",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expense_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "History item deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete history item",
        variant: "destructive"
      });
    }
  };

  const handleLoadExpense = (item: HistoryItem) => {
    onLoadExpense(item.expense_data, item.name);
    onBack();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen font-dm-sans relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-800 dark:to-purple-900 transition-all duration-500">
        <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="rounded-full hover:scale-105 transition-transform duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Expense History
            </h1>
          </div>
        </div>

        {history.length === 0 ? (
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  No expense history yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                  Start splitting expenses to see your history here. All your saved splits will appear in this section.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <Card key={item.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-2 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {editingId === item.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-lg font-semibold"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditName(item.id, editName);
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleEditName(item.id, editName)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditName(item.name);
                        }}
                        className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Total: ₹{item.total_expense}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.people_count} people
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Per person: ₹{item.per_person_share}
                    </span>
                    <Button
                      onClick={() => handleLoadExpense(item)}
                      className="bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white"
                    >
                      Load Split
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
