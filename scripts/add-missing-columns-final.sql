-- Add all the missing columns to the existing design_projects table
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS customer_address TEXT,
ADD COLUMN IF NOT EXISTS customer_city VARCHAR(100),
ADD COLUMN IF NOT EXISTS customer_state VARCHAR(50),
ADD COLUMN IF NOT EXISTS customer_zip VARCHAR(20),
ADD COLUMN IF NOT EXISTS initial_design_notes TEXT,
ADD COLUMN IF NOT EXISTS recommended_plants TEXT;

-- Check what we have now
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'design_projects' 
ORDER BY ordinal_position;
