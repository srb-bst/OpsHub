-- Add missing columns to existing tables safely
DO $$ 
BEGIN
    -- Add city column to customers if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='city') THEN
        ALTER TABLE customers ADD COLUMN city VARCHAR(100);
    END IF;
    
    -- Add state column to customers if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='state') THEN
        ALTER TABLE customers ADD COLUMN state VARCHAR(50);
    END IF;
    
    -- Add zip column to customers if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='zip') THEN
        ALTER TABLE customers ADD COLUMN zip VARCHAR(20);
    END IF;
END $$;

-- Create design_projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS design_projects (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'needs-estimate',
    designer VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create estimates table if it doesn't exist
CREATE TABLE IF NOT EXISTS estimates (
    id SERIAL PRIMARY KEY,
    design_project_id INTEGER REFERENCES design_projects(id),
    estimate_number VARCHAR(50) UNIQUE,
    total_amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
