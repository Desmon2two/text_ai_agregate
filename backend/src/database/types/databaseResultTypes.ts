export type PostgreSQLResponse<T> = {
  command: string;
  rowCount: number;
  oid: null | number;
  rows: [{ T: T }, ...[]];
  fields: [Field: { name: string }, ...[]];
};
