-- Fix history by aligning user_id to Clerk IDs (text)
-- 1) Drop FK to profiles (Supabase auth) since we use Clerk
ALTER TABLE public.expense_history
  DROP CONSTRAINT IF EXISTS expense_history_user_id_fkey;

-- 2) Change user_id column type from UUID to TEXT to accept Clerk user IDs like 'user_xxx'
ALTER TABLE public.expense_history
  ALTER COLUMN user_id TYPE text USING user_id::text;

-- 3) Ensure an index for performant lookups
CREATE INDEX IF NOT EXISTS idx_expense_history_user_id ON public.expense_history(user_id);
