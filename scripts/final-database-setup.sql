-- Drop existing tables to start fresh
DROP TABLE IF EXISTS estimate_line_items CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS design_projects CASCADE;

-- Ensure customers table has all needed columns
ALTER TABLE customers 
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(50),
ADD COLUMN IF NOT EXISTS zip VARCHAR(20);

-- Create design_projects table with ALL needed columns
CREATE TABLE design_projects (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    title VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL,
    area VARCHAR(100) NOT NULL,
    description TEXT,
    budget_range VARCHAR(50),
    timeline VARCHAR(50),
    design_style VARCHAR(100),
    maintenance_level VARCHAR(50),
    plant_preferences TEXT,
    staff_notes TEXT,
    status VARCHAR(50) DEFAULT 'needs-estimate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create estimates table
CREATE TABLE estimates (
    id SERIAL PRIMARY KEY,
    design_project_id INTEGER REFERENCES design_projects(id),
    estimate_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    project_title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    total_amount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) DEFAULT 0,
    markup_percentage DECIMAL(5,2) DEFAULT 0,
    markup_amount DECIMAL(10,2) DEFAULT 0,
    tax_percentage DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    terms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create estimate line items table
CREATE TABLE estimate_line_items (
    id SERIAL PRIMARY KEY,
    estimate_id INTEGER REFERENCES estimates(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
