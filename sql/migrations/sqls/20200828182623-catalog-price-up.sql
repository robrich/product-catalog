ALTER TABLE catalog
ADD COLUMN price DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER subtitle;

UPDATE catalog
SET price = 12.34
WHERE productCode = 'testprod';
