CREATE DATABASE acme PARTITIONS 2;

USE acme;

CREATE TABLE catalog (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  productCode TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(512),
  properties JSON NOT NULL,
  active bool NOT NULL
);

INSERT INTO catalog (
  productCode, name, description, properties, active
) VALUES (
  'testprod', 'the test product', 'This is a test product',
  '{"has":"values"}', 1
);

SELECT * FROM catalog;
