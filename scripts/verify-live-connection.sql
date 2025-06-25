-- Check if we have real data in the system
SELECT 
  'design_projects' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as latest_record
FROM design_projects
UNION ALL
SELECT 
  'estimates' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as latest_record  
FROM estimates
UNION ALL
SELECT 
  'leads' as table_name,
  COUNT(*) as record_count,
  MAX(created_at) as latest_record
FROM leads;
