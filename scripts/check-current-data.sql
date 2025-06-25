-- Check what data exists
SELECT 'design_projects' as table_name, COUNT(*) as count FROM design_projects
UNION ALL
SELECT 'customers' as table_name, COUNT(*) as count FROM customers
UNION ALL
SELECT 'estimates' as table_name, COUNT(*) as count FROM estimates;

-- Show actual design projects
SELECT 
  dp.id,
  dp.title,
  dp.status,
  dp.project_type,
  dp.area,
  c.first_name,
  c.last_name,
  dp.created_at
FROM design_projects dp
LEFT JOIN customers c ON dp.customer_id = c.id
ORDER BY dp.created_at DESC
LIMIT 10;
