-- Re-enable RLS with proper Clerk-based policies
ALTER TABLE public.expense_history ENABLE ROW LEVEL SECURITY;

-- Since we're using Clerk, we need to implement a custom approach
-- We'll use the user_id field directly and rely on application-level security
-- This policy allows users to only see their own records based on the stored user_id
CREATE POLICY "Allow user access to own records" 
ON public.expense_history 
FOR ALL 
USING (user_id = current_setting('app.current_user_id', true))
WITH CHECK (user_id = current_setting('app.current_user_id', true));