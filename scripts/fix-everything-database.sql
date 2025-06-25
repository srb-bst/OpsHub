-- Drop and recreate tables to ensure clean state
DROP TABLE IF EXISTS estimate_line_items CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS design_projects CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create design_projects table
CREATE TABLE design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'needs-estimate',
  project_type VARCHAR(100) DEFAULT 'residential',
  area VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create estimates table
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_project_id UUID REFERENCES design_projects(id),
  estimate_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  total_amount DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) DEFAULT 0,
  markup_percentage DECIMAL(5,2) DEFAULT 25,
  markup_amount DECIMAL(10,2) DEFAULT 0,
  tax_percentage DECIMAL(5,2) DEFAULT 8.5,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create estimate_line_items table
CREATE TABLE estimate_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  category VARCHAR(100),
  description TEXT,
  quantity DECIMAL(10,2),
  unit VARCHAR(50),
  unit_price DECIMAL(10,2),
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample customers
INSERT INTO customers (id, first_name, last_name, email, phone, address) VALUES
('11111111-1111-1111-1111-111111111111', 'John', 'Taylor', 'john.taylor@email.com', '(555) 123-4567', '123 Oak Street, Springfield, IL'),
('22222222-2222-2222-2222-222222222222', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '(555) 234-5678', '456 Pine Road, Springfield, IL'),
('33333333-3333-3333-3333-333333333333', 'Mike', 'Johnson', 'mike.johnson@email.com', '(555) 345-6789', '789 Elm Avenue, Springfield, IL'),
('44444444-4444-4444-4444-444444444444', 'Sarah', 'Martinez', 'sarah.martinez@email.com', '(555) 456-7890', '321 Maple Drive, Springfield, IL');

-- Insert sample design projects
INSERT INTO design_projects (customer_id, title, status, project_type, area) VALUES
('11111111-1111-1111-1111-111111111111', 'Taylor Front Yard Redesign', 'needs-estimate', 'residential', 'Front Yard'),
('22222222-2222-2222-2222-222222222222', 'Anderson Backyard Renovation', 'needs-estimate', 'residential', 'Back Yard'),
('33333333-3333-3333-3333-333333333333', 'Johnson Patio Installation', 'needs-estimate', 'residential', 'Patio'),
('44444444-4444-4444-4444-444444444444', 'Martinez Garden Design', 'pending-approval', 'residential', 'Full Property');

-- Insert sample estimate
INSERT INTO estimates (design_project_id, estimate_number, customer_name, project_title, status, total_amount, subtotal, markup_amount, tax_amount) VALUES
('44444444-4444-4444-4444-444444444444', 'EST-2025-001', 'Sarah Martinez', 'Martinez Garden Design', 'draft', 15750.00, 12000.00, 3000.00, 750.00);
