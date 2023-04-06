
// Nullable is just a type that can also be null 
type Nullable<G> = (G | null)
type Undefineable<G> = (G | undefined)

export { Nullable, Undefineable };