SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'design_projects' 
ORDER BY ordinal_position;
