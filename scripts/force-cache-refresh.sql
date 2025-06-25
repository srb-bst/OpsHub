-- Add a temporary column to force schema cache refresh
ALTER TABLE design_projects ADD COLUMN IF NOT EXISTS temp_refresh_column TEXT DEFAULT 'refresh';

-- Remove it immediately
ALTER TABLE design_projects DROP COLUMN IF EXISTS temp_refresh_column;

-- Check our actual columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'design_projects' 
AND column_name IN ('customer_email', 'customer_address', 'customer_city', 'customer_state', 'customer_zip');
