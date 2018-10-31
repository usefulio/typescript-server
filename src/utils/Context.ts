export interface ContextUser {
  id: number;
  roles: string[];
}

export interface Context {
  user?: ContextUser;
}
