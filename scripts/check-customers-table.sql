-- Check what columns exist in customers table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- Also check design_projects table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'design_projects' 
ORDER BY ordinal_position;
