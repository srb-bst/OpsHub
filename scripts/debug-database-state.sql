-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('design_projects', 'customers', 'estimates');

-- Check what's in design_projects
SELECT COUNT(*) as design_count FROM design_projects;
SELECT * FROM design_projects LIMIT 5;

-- Check what's in customers  
SELECT COUNT(*) as customer_count FROM customers;
SELECT * FROM customers LIMIT 5;

-- Check what's in estimates
SELECT COUNT(*) as estimate_count FROM estimates;
SELECT * FROM estimates LIMIT 5;
