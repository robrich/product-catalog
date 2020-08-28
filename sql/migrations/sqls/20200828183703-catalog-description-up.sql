ALTER TABLE catalog
ADD COLUMN description TEXT after image;

UPDATE catalog
SET description = '<p>This is the initial product in the catalog</p><p>This is the initial product in the catalog</p><p>This is the initial product in the catalog</p><p>This is the initial product in the catalog</p>'
WHERE productCode = 'testprod';
