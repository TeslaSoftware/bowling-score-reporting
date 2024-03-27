interface Frame {
    readonly rolls: [number, number];
    readonly frameScore: number;
}

type Tuple<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R['length'] extends N ? R : Tuple<T, N, readonly [T, ...R]>;

export interface IBowlingResult {
    readonly playerName: string;
    readonly frames: Tuple<Frame, 11>;
    readonly totalScore: number;
}

