-- Add missing columns to customers table
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(50),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20);

-- Add missing columns to design_projects table
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS customer_address TEXT,
ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_state VARCHAR(50),
ADD COLUMN IF NOT EXISTS customer_zip VARCHAR(20),
ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS timeline VARCHAR(50),
ADD COLUMN IF NOT EXISTS design_style VARCHAR(100),
ADD COLUMN IF NOT EXISTS maintenance_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS plant_preferences TEXT,
ADD COLUMN IF NOT EXISTS staff_notes TEXT,
ADD COLUMN IF NOT EXISTS initial_design_notes TEXT,
ADD COLUMN IF NOT EXISTS recommended_plants TEXT;

-- Check what we have now
SELECT 'customers' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'customers' 
UNION ALL
SELECT 'design_projects' as table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'design_projects'
ORDER BY table_name, column_name;
