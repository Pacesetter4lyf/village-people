
export interface respType<T> {
  data: {
    data?: T;
    user?: T;
  };
  status: string;
}
export type DisplayModeType =
  | 'registering'
  | 'self'
  | 'user-creating'
  | 'admin-viewing'
  | 'user-viewing'
  | 'user-created-not-owned'
  | 'lineage-viewing'
  | 'guest';
