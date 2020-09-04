create role 'catalog-read-only';
create group 'catalog-read-only';
grant role 'catalog-read-only' to 'catalog-read-only';
grant select on acme.catalog to role 'catalog-read-only';

create role 'catalog-editor';
create group 'catalog-editor';
grant role 'catalog-editor' to 'catalog-editor';
grant select, insert, update, delete on acme.catalog to role 'catalog-editor';

create role 'user-editor';
create group 'user-editor';
grant role 'user-editor' to 'user-editor';
grant create user on *.* to role 'user-editor' with grant option;
