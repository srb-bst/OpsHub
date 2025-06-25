-- First, let's add some sample customers if they don't exist
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip) 
VALUES 
    ('Sarah', 'Johnson', 'sarah@email.com', '555-0101', '123 Oak Street', 'Springfield', 'IL', '62701'),
    ('Mike', 'Davis', 'mike@email.com', '555-0102', '456 Pine Avenue', 'Springfield', 'IL', '62702'),
    ('Lisa', 'Wilson', 'lisa@email.com', '555-0103', '789 Maple Drive', 'Springfield', 'IL', '62703')
ON CONFLICT (email) DO NOTHING;

-- Now add sample design projects that need estimates
INSERT INTO design_projects (customer_id, project_name, description, status, designer) 
VALUES 
    (1, 'Front Yard Landscaping', 'Complete front yard redesign with native plants and walkway', 'needs-estimate', 'John Smith'),
    (2, 'Backyard Patio & Garden', 'New patio installation with surrounding garden beds', 'needs-estimate', 'Jane Doe'),
    (3, 'Commercial Entrance', 'Professional landscaping for office building entrance', 'needs-estimate', 'Bob Wilson')
ON CONFLICT DO NOTHING;
