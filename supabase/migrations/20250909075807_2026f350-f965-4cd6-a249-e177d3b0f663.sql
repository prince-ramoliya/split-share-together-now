-- Step 1: Drop all RLS policies that depend on user_id column
DROP POLICY IF EXISTS "Users can create their own expense history" ON public.expense_history;
DROP POLICY IF EXISTS "Users can view their own expense history" ON public.expense_history;
DROP POLICY IF EXISTS "Users can update their own expense history" ON public.expense_history;
DROP POLICY IF EXISTS "Users can delete their own expense history" ON public.expense_history;

-- Step 2: Change user_id column type from UUID to TEXT for Clerk compatibility
ALTER TABLE public.expense_history
  ALTER COLUMN user_id TYPE text USING user_id::text;

-- Step 3: Recreate RLS policies with text-based user_id comparison
-- Note: Since we're using Clerk, we'll compare against the stored Clerk user ID directly
CREATE POLICY "Users can view their own expense history" 
ON public.expense_history 
FOR SELECT 
USING (user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

CREATE POLICY "Users can create their own expense history" 
ON public.expense_history 
FOR INSERT 
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

CREATE POLICY "Users can update their own expense history" 
ON public.expense_history 
FOR UPDATE 
USING (user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

CREATE POLICY "Users can delete their own expense history" 
ON public.expense_history 
FOR DELETE 
USING (user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

-- Step 4: Add index for performance
CREATE INDEX IF NOT EXISTS idx_expense_history_user_id ON public.expense_history(user_id);