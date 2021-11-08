export type ArrayElement<A> = A extends (infer T)[] ? T : never;

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends []
    ? RecursivePartial<ArrayElement<T[P]>>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
