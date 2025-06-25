-- Force schema refresh by recreating the table
DROP TABLE IF EXISTS design_projects_backup;

-- Create backup of existing data
CREATE TABLE design_projects_backup AS 
SELECT * FROM design_projects;

-- Drop and recreate the table with all columns
DROP TABLE design_projects;

CREATE TABLE design_projects (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_address TEXT NOT NULL,
    customer_city VARCHAR(100),
    customer_state VARCHAR(50),
    customer_zip VARCHAR(20),
    title VARCHAR(255),
    project_type VARCHAR(50) DEFAULT 'residential',
    area VARCHAR(100),
    description TEXT,
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    design_style VARCHAR(100),
    maintenance_level VARCHAR(50),
    plant_preferences TEXT,
    staff_notes TEXT,
    initial_design_notes TEXT,
    recommended_plants TEXT,
    status VARCHAR(50) DEFAULT 'needs-estimate',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Restore data from backup
INSERT INTO design_projects (
    customer_name, customer_phone, customer_email, customer_address,
    customer_city, customer_state, customer_zip, title, project_type,
    area, description, budget_range, timeline, design_style,
    maintenance_level, plant_preferences, staff_notes,
    initial_design_notes, recommended_plants, status, created_at, updated_at
)
SELECT 
    customer_name, customer_phone, customer_email, customer_address,
    customer_city, customer_state, customer_zip, title, project_type,
    area, description, budget_range, timeline, design_style,
    maintenance_level, plant_preferences, staff_notes,
    initial_design_notes, recommended_plants, status, 
    COALESCE(created_at, NOW()), COALESCE(updated_at, NOW())
FROM design_projects_backup;

-- Clean up backup
DROP TABLE design_projects_backup;

-- Verify the structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'design_projects' 
ORDER BY ordinal_position;
