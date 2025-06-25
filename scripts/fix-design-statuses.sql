-- Update all design projects to need estimates
UPDATE design_projects 
SET status = 'needs-estimate' 
WHERE status != 'needs-estimate';

-- Check the results
SELECT id, title, status, project_type 
FROM design_projects 
ORDER BY created_at DESC;
