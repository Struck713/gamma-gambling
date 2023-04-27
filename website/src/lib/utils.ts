
export type Undefineable<T> = T | undefined;
export type Nullable<T> = T | null;

export namespace Utils {

    export const format = (val?: number) => (val ?? 0).toLocaleString();

}