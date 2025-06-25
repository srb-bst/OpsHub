-- Safely add tables and columns that don't exist

-- Add customers table if it doesn't exist
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

-- Add design_projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS design_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'needs-estimate',
  project_type VARCHAR(100) DEFAULT 'residential',
  area VARCHAR(100),
  budget_range VARCHAR(50),
  timeline VARCHAR(50),
  goals TEXT,
  design_style VARCHAR(100),
  maintenance_preference VARCHAR(50),
  plant_preferences TEXT,
  design_notes TEXT,
  recommended_plants TEXT,
  services TEXT[],
  priority VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add estimates table if it doesn't exist
CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_project_id UUID REFERENCES design_projects(id),
  estimate_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  subtotal DECIMAL(10,2) DEFAULT 0,
  markup_percentage DECIMAL(5,2) DEFAULT 25,
  markup_amount DECIMAL(10,2) DEFAULT 0,
  tax_percentage DECIMAL(5,2) DEFAULT 8.5,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) DEFAULT 0,
  estimator VARCHAR(255),
  priority VARCHAR(20) DEFAULT 'medium',
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

-- Add estimate_line_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS estimate_line_items (
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

-- Add estimate_activity table if it doesn't exist
CREATE TABLE IF NOT EXISTS estimate_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES estimates(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  user_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add missing columns to existing tables (these will fail silently if columns exist)
DO $$ 
BEGIN
    -- Add columns to customers if they don't exist
    BEGIN
        ALTER TABLE customers ADD COLUMN city VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE customers ADD COLUMN state VARCHAR(50);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE customers ADD COLUMN zip_code VARCHAR(20);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    -- Add columns to design_projects if they don't exist
    BEGIN
        ALTER TABLE design_projects ADD COLUMN budget_range VARCHAR(50);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN timeline VARCHAR(50);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN goals TEXT;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN design_style VARCHAR(100);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN maintenance_preference VARCHAR(50);
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN plant_preferences TEXT;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN design_notes TEXT;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN recommended_plants TEXT;
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN services TEXT[];
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
    
    BEGIN
        ALTER TABLE design_projects ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
    EXCEPTION
        WHEN duplicate_column THEN NULL;
    END;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_design_projects_customer_id ON design_projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_design_projects_status ON design_projects(status);
CREATE INDEX IF NOT EXISTS idx_estimates_design_project_id ON estimates(design_project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimate_line_items_estimate_id ON estimate_line_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_estimate_activity_estimate_id ON estimate_activity(estimate_id);
