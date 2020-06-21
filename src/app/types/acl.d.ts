export interface Acl {
  [uid: string]: 'read' | 'write' | 'admin';
}
