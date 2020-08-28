CREATE TABLE catalog (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  productCode TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(512),
  properties JSON NOT NULL,
  active bool NOT NULL
);
