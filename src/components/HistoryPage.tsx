import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Trash2, Calendar, Users, DollarSign, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
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
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('expense_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the Json data to our expected format
      const typedData = (data || []).map(item => ({
        ...item,
        expense_data: item.expense_data as unknown as Person[]
      }));
      
      setHistory(typedData);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Expense History
            </h1>
          </div>
        </div>

        {history.length === 0 ? (
          <Card className="bg-card border text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  No expense history yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start splitting expenses to see your history here. All your saved splits will appear in this section.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {history.map((item) => (
              <Card key={item.id} className="bg-card border hover:shadow-md transition-shadow">
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
                        <span className="text-lg font-semibold text-foreground">
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
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Total: ₹{item.total_expense}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {item.people_count} people
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Per person: ₹{item.per_person_share}
                    </span>
                    <Button
                      onClick={() => handleLoadExpense(item)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
