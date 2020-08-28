ALTER TABLE catalog
CHANGE COLUMN description subtitle;
ALTER TABLE catalog
MODIFY subtitle VARCHAR(512) NULL;
