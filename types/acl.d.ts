export type AclType = 'read' | 'write' | 'admin';
export type Acl = Record<string, AclType>;
