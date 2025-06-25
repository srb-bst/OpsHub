-- Create the tables we need (simple version)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'needs-estimate',
  project_type VARCHAR(100) DEFAULT 'residential',
  area VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_project_id UUID,
  estimate_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  total_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO customers (first_name, last_name, email, phone, address) VALUES
('John', 'Taylor', 'john.taylor@email.com', '555-0101', '123 Oak St, Springfield'),
('Lisa', 'Anderson', 'lisa.anderson@email.com', '555-0102', '666 Forest Rd, Springfield'),
('Miguel', 'Martinez', 'miguel.martinez@email.com', '555-0103', '555 Sunset Blvd, Springfield');

INSERT INTO design_projects (customer_id, title, status, project_type, area) VALUES
((SELECT id FROM customers WHERE first_name = 'John' AND last_name = 'Taylor'), 'Taylor Residence Front Yard', 'needs-estimate', 'residential', 'Front Yard'),
((SELECT id FROM customers WHERE first_name = 'Lisa' AND last_name = 'Anderson'), 'Anderson Backyard Design', 'needs-estimate', 'residential', 'Back Yard'),
((SELECT id FROM customers WHERE first_name = 'Miguel' AND last_name = 'Martinez'), 'Martinez Patio Design', 'approved', 'residential', 'Patio');
