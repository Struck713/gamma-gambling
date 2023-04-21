
// Nullable is just a type that can also be null 
type Nullable<G> = (G | null)
type Undefineable<G> = (G | undefined)

type Callback<T, G, D> = (a: T, b: G, c?: D) => void;

export { Nullable, Undefineable, Callback };