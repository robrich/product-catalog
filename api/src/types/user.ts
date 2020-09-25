export type User = {
  username: string;
  secret?: string | undefined;
  roles: UserRole[];
}

export const usernameRegex = /^[a-z0-9]{6,32}$/;

export enum UserRole {
  UserEditor = 'user-editor',
  CatalogEditor = 'catalog-editor',
  CatalogReadOnly = 'catalog-read-only'
}

export const USER_EDITOR = 'user-editor';
export const CATALOG_EDITOR = 'catalog-editor';
export const CATALOG_READ_ONLY = 'catalog-read-only';

