-- Check what tables exist in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if specific tables exist
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'design_projects') 
    THEN 'design_projects EXISTS' 
    ELSE 'design_projects MISSING' 
  END as design_projects_status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') 
    THEN 'customers EXISTS' 
    ELSE 'customers MISSING' 
  END as customers_status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'estimates') 
    THEN 'estimates EXISTS' 
    ELSE 'estimates MISSING' 
  END as estimates_status;
