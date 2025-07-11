
import { supabase } from '@/integrations/supabase/client';
import { Person } from './expenseCalculations';

export const saveExpenseHistory = async (
  people: Person[],
  totalExpense: number,
  perPersonShare: number,
  name: string = 'Untitled Split',
  userId?: string
) => {
  try {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('expense_history')
      .insert({
        user_id: userId,
        name,
        expense_data: people as any, // Type cast to satisfy Json requirement
        total_expense: totalExpense,
        per_person_share: perPersonShare,
        people_count: people.length
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving expense history:', error);
    return { success: false, error };
  }
};
