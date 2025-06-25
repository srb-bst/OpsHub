-- Add missing columns to design_projects table
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS project_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS area VARCHAR(100),
ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS timeline VARCHAR(50),
ADD COLUMN IF NOT EXISTS design_style VARCHAR(100),
ADD COLUMN IF NOT EXISTS maintenance_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS plant_preferences TEXT,
ADD COLUMN IF NOT EXISTS staff_notes TEXT,
ADD COLUMN IF NOT EXISTS title VARCHAR(255);

-- Update the project_name column to be title if title doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='design_projects' AND column_name='title') THEN
        ALTER TABLE design_projects RENAME COLUMN project_name TO title;
    END IF;
END $$;
