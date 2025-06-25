-- Insert sample customers first
INSERT INTO customers (id, first_name, last_name, email, phone, address) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '(555) 123-4567', '123 Oak Street, Springfield'),
('550e8400-e29b-41d4-a716-446655440002', 'Jennifer', 'Martinez', 'jennifer.martinez@email.com', '(555) 345-6789', '789 Pine Road, Springfield'),
('550e8400-e29b-41d4-a716-446655440003', 'Robert', 'Thompson', 'robert.thompson@email.com', '(555) 234-5678', '456 Maple Street, Springfield'),
('550e8400-e29b-41d4-a716-446655440004', 'Mountain View', 'HOA', 'board@mountainviewhoa.com', '(555) 987-6543', '100 Community Drive, Springfield')
ON CONFLICT (id) DO NOTHING;

-- Insert sample design projects
INSERT INTO design_projects (id, customer_id, title, status, project_type, area, description, budget_range, timeline, design_style, maintenance_level, plant_preferences, staff_notes) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Front Yard Redesign', 'needs-estimate', 'residential', 'front-yard', 'Complete front yard makeover with modern landscaping', '$10,000 - $25,000', 'within-3-months', 'modern', 'low', 'Drought-resistant plants, colorful flowers', 'Customer wants low maintenance but visually striking design'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Backyard Renovation', 'pending-approval', 'residential', 'back-yard', 'Full backyard transformation with patio and garden areas', '$25,000 - $50,000', 'within-6-months', 'traditional', 'medium', 'Mix of perennials and annuals, vegetable garden space', 'Large project requiring hardscape and extensive planting'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Garden Design Consultation', 'approved', 'residential', 'back-yard', 'Design consultation for existing garden enhancement', '$5,000 - $10,000', 'flexible', 'natural', 'high', 'Native plants, butterfly garden', 'Customer is experienced gardener, wants professional guidance'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Community Landscaping', 'needs-estimate', 'commercial', 'full-property', 'HOA common area landscaping project', 'over-50k', 'within-6-months', 'traditional', 'low', 'Hardy, established plants suitable for community spaces', 'Large scale project requiring board approval')
ON CONFLICT (id) DO NOTHING;

-- Insert sample estimates
INSERT INTO estimates (id, design_project_id, estimate_number, status, total_amount, subtotal, markup_percentage, markup_amount, tax_percentage, tax_amount, notes, terms, expires_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'EST-2025-001', 'sent-to-customer', 35000.00, 28000.00, 25.0, 7000.00, 8.5, 2380.00, 'Includes all materials and labor for complete backyard renovation', 'Payment due within 30 days of project completion. 50% deposit required.', '2025-07-15 23:59:59'),
('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 'EST-2025-002', 'approved', 8500.00, 6800.00, 25.0, 1700.00, 8.5, 578.00, 'Design consultation and garden enhancement recommendations', 'Payment due within 30 days of project completion.', '2025-07-20 23:59:59')
ON CONFLICT (id) DO NOTHING;

-- Insert sample estimate line items
INSERT INTO estimate_line_items (id, estimate_id, category, description, quantity, unit, unit_price, total) VALUES
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Plants & Materials', 'Japanese Maple Trees (6-8 ft)', 2, 'each', 450.00, 900.00),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Hardscape', 'Flagstone Patio Installation', 400, 'sq ft', 25.00, 10000.00),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 'Labor', 'Site Preparation and Grading', 40, 'hour', 75.00, 3000.00),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 'Design', 'Garden Design Consultation', 8, 'hour', 125.00, 1000.00),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440002', 'Plants & Materials', 'Perennial Plant Package', 1, 'package', 2500.00, 2500.00)
ON CONFLICT (id) DO NOTHING;
