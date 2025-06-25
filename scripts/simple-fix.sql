-- Just create the tables WITHOUT foreign keys to avoid all issues
DROP TABLE IF EXISTS design_projects CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;

-- Simple design_projects table (no foreign keys)
CREATE TABLE design_projects (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER,
    title VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL DEFAULT 'residential',
    area VARCHAR(100) NOT NULL DEFAULT 'front-yard',
    description TEXT,
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    design_style VARCHAR(100),
    maintenance_level VARCHAR(50),
    plant_preferences TEXT,
    staff_notes TEXT,
    status VARCHAR(50) DEFAULT 'needs-estimate',
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Simple estimates table (no foreign keys)
CREATE TABLE estimates (
    id SERIAL PRIMARY KEY,
    design_project_id INTEGER,
    estimate_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add one test record
INSERT INTO design_projects (title, project_type, area, status, customer_name) 
VALUES ('Test Project', 'residential', 'front-yard', 'needs-estimate', 'Test Customer');
