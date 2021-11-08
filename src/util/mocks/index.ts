import { RecursivePartial } from '../types';

export const mockPartial = <T>(obj: RecursivePartial<T>): T => {
  return obj as T;
};
