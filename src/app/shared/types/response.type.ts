export interface respType<T> {
  data: {
    data?: T;
    user?: T;
  };
  status: string;
}
