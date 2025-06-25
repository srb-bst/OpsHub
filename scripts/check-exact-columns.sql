-- Check exactly what columns exist in design_projects table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'design_projects' 
ORDER BY ordinal_position;
