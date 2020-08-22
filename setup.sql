CREATE DATABASE acme PARTITIONS 2;

USE acme;

CREATE TABLE catalog (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  productCode TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  subtitle VARCHAR(512),
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(512),
  description TEXT,
  properties JSON NOT NULL,
  active bool NOT NULL
);

INSERT INTO catalog (
  productCode, name, subtitle, price, image, description, properties, active
) VALUES (
  'testprod', 'the test product', 'This is a test product', 12.34,
  'https://placekitten.com/650/300',
  '<p>This is the initial product in the catalog</p><p>This is the initial product in the catalog</p><p>This is the initial product in the catalog</p><p>This is the initial product in the catalog</p>',
  '{"has":"values"}', 1
);

SELECT * FROM catalog;
