-- First, let's see what's currently in the database
SELECT 'Current designs:' as info;
SELECT id, title, status, project_type FROM design_projects;

SELECT 'Current customers:' as info;
SELECT id, first_name, last_name FROM customers;

-- Add some designs that need estimates
INSERT INTO design_projects (id, customer_id, title, status, project_type, area, description, budget_range, timeline, design_style, maintenance_level, plant_preferences, staff_notes) VALUES
('design-001', '550e8400-e29b-41d4-a716-446655440001', 'Johnson Front Yard Redesign', 'needs-estimate', 'residential', 'front-yard', 'Complete front yard makeover with modern landscaping', '$10,000 - $25,000', 'within-3-months', 'modern', 'low', 'Drought-resistant plants, colorful flowers', 'Customer wants low maintenance but visually striking design'),
('design-002', '550e8400-e29b-41d4-a716-446655440002', 'Martinez Backyard Oasis', 'needs-estimate', 'residential', 'back-yard', 'Full backyard transformation with patio and garden areas', '$25,000 - $50,000', 'within-6-months', 'traditional', 'medium', 'Mix of perennials and annuals, vegetable garden space', 'Large project requiring hardscape and extensive planting'),
('design-003', '550e8400-e29b-41d4-a716-446655440003', 'Thompson Garden Enhancement', 'needs-estimate', 'residential', 'back-yard', 'Design consultation for existing garden enhancement', '$5,000 - $10,000', 'flexible', 'natural', 'high', 'Native plants, butterfly garden', 'Customer is experienced gardener, wants professional guidance')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  project_type = EXCLUDED.project_type,
  area = EXCLUDED.area,
  description = EXCLUDED.description,
  budget_range = EXCLUDED.budget_range,
  timeline = EXCLUDED.timeline,
  design_style = EXCLUDED.design_style,
  maintenance_level = EXCLUDED.maintenance_level,
  plant_preferences = EXCLUDED.plant_preferences,
  staff_notes = EXCLUDED.staff_notes;

-- Show the results
SELECT 'Updated designs:' as info;
SELECT id, title, status, project_type FROM design_projects WHERE status = 'needs-estimate';
