-- Merge Blue Sheets functionality into Design Projects
-- Add all blue sheet columns to design_projects table

-- Add blue sheet specific columns to design_projects
ALTER TABLE design_projects 
ADD COLUMN IF NOT EXISTS designer_id INTEGER,
ADD COLUMN IF NOT EXISTS designer_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS designer_initials VARCHAR(10),
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS consultation_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS consultation_status VARCHAR(50) DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS photos_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS design_status VARCHAR(50) DEFAULT 'waiting',
ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS estimated_value VARCHAR(50),
ADD COLUMN IF NOT EXISTS services TEXT[], -- Array of services
ADD COLUMN IF NOT EXISTS lead_source VARCHAR(100),
ADD COLUMN IF NOT EXISTS project_phase VARCHAR(50) DEFAULT 'design',
ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255),
ADD COLUMN IF NOT EXISTS site_photos TEXT[], -- Array of photo URLs
ADD COLUMN IF NOT EXISTS design_notes TEXT,
ADD COLUMN IF NOT EXISTS consultation_notes TEXT,
ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMP;

-- Update status values to include blue sheet statuses
-- Current: needs-estimate, pending-approval, approved, on-hold
-- Adding: draft, in-progress, ready-for-estimate, consultation-scheduled, consultation-complete

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_design_projects_designer_id ON design_projects(designer_id);
CREATE INDEX IF NOT EXISTS idx_design_projects_status ON design_projects(status);
CREATE INDEX IF NOT EXISTS idx_design_projects_priority ON design_projects(priority);
CREATE INDEX IF NOT EXISTS idx_design_projects_consultation_date ON design_projects(consultation_date);
CREATE INDEX IF NOT EXISTS idx_design_projects_assigned_to ON design_projects(assigned_to);

-- Create a view for backward compatibility if needed
CREATE OR REPLACE VIEW blue_sheets AS
SELECT 
  id,
  customer_name,
  customer_address,
  designer_name as designer,
  designer_initials,
  status,
  priority,
  services,
  updated_at as last_updated,
  estimated_value,
  consultation_date,
  photos_count as photos,
  notes_count as notes,
  completion_percentage,
  design_status
FROM design_projects
WHERE project_phase = 'design' OR project_phase IS NULL;

-- Sample data migration (if you had existing blue sheet data)
-- This would migrate any existing blue sheet records into design_projects
-- UPDATE design_projects SET project_phase = 'design' WHERE project_phase IS NULL;
