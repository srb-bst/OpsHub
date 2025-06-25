-- Add PDF storage columns to estimates table
ALTER TABLE estimates 
ADD COLUMN IF NOT EXISTS pdf_filename TEXT,
ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Update existing estimates to have proper structure
UPDATE estimates 
SET 
  markup_percentage = COALESCE(markup_percentage, 0),
  markup_amount = COALESCE(markup_amount, 0),
  tax_percentage = COALESCE(tax_percentage, 0),
  tax_amount = COALESCE(tax_amount, 0)
WHERE markup_percentage IS NULL OR markup_amount IS NULL OR tax_percentage IS NULL OR tax_amount IS NULL;
