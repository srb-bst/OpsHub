-- Drop and recreate design_projects with ALL needed columns
DROP TABLE IF EXISTS estimate_line_items CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS design_projects CASCADE;

-- Create complete design_projects table
CREATE TABLE design_projects (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_address TEXT NOT NULL,
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
    markup_percentage DECIMAL(5,2) DEFAULT 20,
    markup_amount DECIMAL(10,2) DEFAULT 0,
    tax_percentage DECIMAL(5,2) DEFAULT 8.5,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    terms TEXT DEFAULT 'Payment due within 30 days of acceptance.',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days'),
    sent_at TIMESTAMP,
    approved_at TIMESTAMP
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

-- Add some sample data
INSERT INTO design_projects (customer_name, customer_phone, customer_email, customer_address, title, project_type, area, description, budget_range, timeline, status) VALUES
('John Smith', '(555) 123-4567', 'john@email.com', '123 Main St, Anytown, ST 12345', 'Front Yard Landscaping', 'residential', 'front-yard', 'Complete front yard redesign with native plants', '10k-25k', '3-months', 'needs-estimate'),
('Sarah Johnson', '(555) 987-6543', 'sarah@email.com', '456 Oak Ave, Somewhere, ST 67890', 'Backyard Oasis', 'residential', 'back-yard', 'Create a relaxing backyard space with water feature', '25k-50k', '6-months', 'needs-estimate'),
('ABC Company', '(555) 555-5555', 'contact@abc.com', '789 Business Blvd, Corporate, ST 11111', 'Office Landscaping', 'commercial', 'full-property', 'Professional landscaping for office complex', 'over-50k', 'flexible', 'needs-estimate');
