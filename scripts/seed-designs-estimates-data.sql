-- Insert sample customers
INSERT INTO customers (id, first_name, last_name, email, phone, address, city, state, zip_code) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '(555) 123-4567', '123 Oak Street', 'Springfield', 'IL', '62701'),
('550e8400-e29b-41d4-a716-446655440002', 'Jennifer', 'Martinez', 'jennifer.martinez@email.com', '(555) 345-6789', '789 Pine Road', 'Springfield', 'IL', '62702'),
('550e8400-e29b-41d4-a716-446655440003', 'Robert', 'Thompson', 'robert.thompson@email.com', '(555) 234-5678', '456 Maple Street', 'Springfield', 'IL', '62703'),
('550e8400-e29b-41d4-a716-446655440004', 'Lisa', 'Anderson', 'lisa.anderson@email.com', '(555) 456-7890', '666 Forest Road', 'Springfield', 'IL', '62704'),
('550e8400-e29b-41d4-a716-446655440005', 'Miguel', 'Martinez', 'miguel.martinez@email.com', '(555) 567-8901', '555 Sunset Boulevard', 'Springfield', 'IL', '62705');

-- Insert sample design projects
INSERT INTO design_projects (id, customer_id, title, status, project_type, area, budget_range, timeline, goals, design_style, maintenance_preference, services, priority) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Front Yard Redesign', 'needs-estimate', 'residential', 'Front Yard', '10k-25k', '3-months', 'Create modern curb appeal with low-maintenance plants', 'modern', 'low', ARRAY['Design', 'Installation'], 'high'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Backyard Renovation', 'pending-approval', 'residential', 'Back Yard', '25k-50k', '6-months', 'Complete backyard transformation with entertainment area', 'traditional', 'medium', ARRAY['Design', 'Hardscape', 'Installation'], 'high'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Garden Design Consultation', 'needs-estimate', 'residential', 'Full Property', '5k-10k', '1-month', 'Professional garden design consultation and planning', 'natural', 'medium', ARRAY['Design', 'Consultation'], 'medium'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Backyard Design', 'needs-estimate', 'residential', 'Back Yard', '10k-25k', '3-months', 'Family-friendly backyard with play area and gardens', 'traditional', 'medium', ARRAY['Design', 'Installation'], 'medium'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Patio Design', 'approved', 'residential', 'Patio', 'under-5k', 'asap', 'Small patio renovation with container gardens', 'modern', 'low', ARRAY['Design', 'Hardscape'], 'low');

-- Insert sample estimates
INSERT INTO estimates (id, design_project_id, estimate_number, customer_name, project_title, status, subtotal, markup_percentage, markup_amount, tax_percentage, tax_amount, total_amount, estimator, priority, services, project_type, notes, terms, expiry_date, sent_date) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'EST-2025-001', 'Sarah Johnson', 'Front Yard Redesign', 'sent-to-customer', 3470.00, 25.00, 867.50, 8.5, 369.69, 4707.19, 'Emma Thompson', 'high', ARRAY['Design', 'Installation'], 'Residential', 'Customer prefers drought-resistant plants and modern aesthetic.', 'Payment due within 30 days of project completion. 50% deposit required.', '2025-07-16', '2025-06-16'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 'EST-2025-002', 'Jennifer Martinez', 'Backyard Renovation', 'under-negotiation', 28000.00, 25.00, 7000.00, 8.5, 2975.00, 37975.00, 'Emma Thompson', 'high', ARRAY['Design', 'Hardscape', 'Installation'], 'Residential', 'Large project with multiple phases possible.', 'Payment schedule: 30% deposit, 40% at midpoint, 30% completion.', '2025-07-13', '2025-06-13'),
('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 'EST-2025-003', 'Robert Thompson', 'Garden Design Consultation', 'draft', 6800.00, 25.00, 1700.00, 8.5, 722.50, 9222.50, 'Emma Thompson', 'medium', ARRAY['Design', 'Consultation'], 'Residential', 'Consultation includes detailed planting plan.', 'Payment due within 30 days of project completion.', '2025-07-17', NULL);

-- Insert sample line items for estimates
INSERT INTO estimate_line_items (estimate_id, category, description, quantity, unit, unit_price, total, sort_order) VALUES
-- EST-2025-001 line items
('750e8400-e29b-41d4-a716-446655440001', 'Plants & Materials', 'Japanese Maple Trees (6-8 ft)', 2, 'each', 450.00, 900.00, 1),
('750e8400-e29b-41d4-a716-446655440001', 'Plants & Materials', 'Boxwood Hedge Plants (18-24 in)', 15, 'each', 35.00, 525.00, 2),
('750e8400-e29b-41d4-a716-446655440001', 'Labor', 'Site Preparation and Planting', 16, 'hour', 65.00, 1040.00, 3),
('750e8400-e29b-41d4-a716-446655440001', 'Hardscape', 'Decorative Stone Mulch', 3, 'yard', 85.00, 255.00, 4),
('750e8400-e29b-41d4-a716-446655440001', 'Design', 'Landscape Design and Planning', 1, 'each', 750.00, 750.00, 5),

-- EST-2025-002 line items
('750e8400-e29b-41d4-a716-446655440002', 'Hardscape', 'Patio Installation (Flagstone)', 400, 'sq ft', 25.00, 10000.00, 1),
('750e8400-e29b-41d4-a716-446655440002', 'Plants & Materials', 'Privacy Trees (8-10 ft)', 8, 'each', 350.00, 2800.00, 2),
('750e8400-e29b-41d4-a716-446655440002', 'Labor', 'Excavation and Site Prep', 40, 'hour', 75.00, 3000.00, 3),
('750e8400-e29b-41d4-a716-446655440002', 'Plants & Materials', 'Perennial Garden Plants', 50, 'each', 25.00, 1250.00, 4),
('750e8400-e29b-41d4-a716-446655440002', 'Design', 'Comprehensive Landscape Design', 1, 'each', 1500.00, 1500.00, 5),
('750e8400-e29b-41d4-a716-446655440002', 'Equipment', 'Irrigation System Installation', 1, 'each', 2500.00, 2500.00, 6),
('750e8400-e29b-41d4-a716-446655440002', 'Labor', 'Planting and Installation', 60, 'hour', 65.00, 3900.00, 7),
('750e8400-e29b-41d4-a716-446655440002', 'Hardscape', 'Retaining Wall (Natural Stone)', 80, 'linear ft', 45.00, 3600.00, 8);

-- Insert sample activity logs
INSERT INTO estimate_activity (estimate_id, action, details, user_name) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Estimate sent to customer', 'Sent via email with PDF attachment', 'Emma Thompson'),
('750e8400-e29b-41d4-a716-446655440001', 'Estimate created', 'Generated from Blue Sheet BS-001', 'Emma Thompson'),
('750e8400-e29b-41d4-a716-446655440002', 'Customer requested changes', 'Customer wants to reduce patio size by 20%', 'Emma Thompson'),
('750e8400-e29b-41d4-a716-446655440002', 'Estimate sent to customer', 'Initial estimate sent for review', 'Emma Thompson'),
('750e8400-e29b-41d4-a716-446655440002', 'Estimate created', 'Generated from Blue Sheet BS-002', 'Emma Thompson');
