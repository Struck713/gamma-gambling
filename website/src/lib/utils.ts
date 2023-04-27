
export type Undefineable<T> = T | undefined;
export type Nullable<T> = T | null;

export namespace Utils {

    export const DATE_FORMAT: string = "MM/DD/YYYY hh:mm A";
    export const format = (val?: number) => (val ?? 0).toLocaleString();

}