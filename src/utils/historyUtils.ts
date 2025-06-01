
import { supabase } from '@/integrations/supabase/client';
import { Person } from './expenseCalculations';

export const saveExpenseHistory = async (
  people: Person[],
  totalExpense: number,
  perPersonShare: number,
  name: string = 'Untitled Split'
) => {
  try {
    const { error } = await supabase
      .from('expense_history')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        name,
        expense_data: people,
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
