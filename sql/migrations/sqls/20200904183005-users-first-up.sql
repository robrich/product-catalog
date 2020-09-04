-- FRAGILE: passwords committed to source control, change on first use
create user 'website' identified by 'password';
grant group 'catalog-read-only' to 'website'@'%';

create user 'admin' identified by 'password';
grant group 'catalog-editor' to 'admin'@'%';
grant group 'user-editor' to 'admin'@'%';
