ALTER TABLE catalog
ADD COLUMN image VARCHAR(512) after price;

UPDATE catalog
SET image = 'https://placekitten.com/650/300'
WHERE productCode = 'testprod';
