-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create design_projects table
CREATE TABLE design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'needs-estimate' CHECK (status IN ('needs-estimate', 'pending-approval', 'approved', 'rejected')),
  project_type VARCHAR(100) DEFAULT 'residential' CHECK (project_type IN ('residential', 'commercial', 'municipal')),
  area VARCHAR(100),
  budget_range VARCHAR(50),
  timeline VARCHAR(50),
  goals TEXT,
  design_style VARCHAR(100),
  maintenance_preference VARCHAR(50),
  plant_preferences TEXT,
  design_notes TEXT,
  recommended_plants TEXT,
  services TEXT[], -- Array of services
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create estimates table
CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_project_id UUID REFERENCES design_projects(id),
  estimate_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'internal-review', 'sent-to-customer', 'under-negotiation', 'approved', 'rejected', 'expired')),
  subtotal DECIMAL(10,2) DEFAULT 0,
  markup_percentage DECIMAL(5,2) DEFAULT 25,
  markup_amount DECIMAL(10,2) DEFAULT 0,
  tax_percentage DECIMAL(5,2) DEFAULT 8.5,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  estimator VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  services TEXT[],
  project_type VARCHAR(100),
  notes TEXT,
  terms TEXT,
  expiry_date DATE,
  sent_date DATE,
  response_date DATE,
  revision_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create estimate_line_items table
CREATE TABLE estimate_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create estimate_activity table for tracking changes
CREATE TABLE estimate_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  user_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_design_projects_customer_id ON design_projects(customer_id);
CREATE INDEX idx_design_projects_status ON design_projects(status);
CREATE INDEX idx_estimates_design_project_id ON estimates(design_project_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimate_line_items_estimate_id ON estimate_line_items(estimate_id);
CREATE INDEX idx_estimate_activity_estimate_id ON estimate_activity(estimate_id);
