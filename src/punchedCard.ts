type Tuple<Type, Length extends number> = ComputeTuple<Type, Length, []>;
type ComputeTuple<
  Type,
  Length extends number,
  Tail extends Type[]
> = Tail["length"] extends Length
  ? Tail
  : ComputeTuple<Type, Length, [Type, ...Tail]>;

type AsciiCode = Tuple<boolean, 7>; // [1bit, 2bit, ...]
export type PunchedCard = AsciiCode[];

const charToAsciiCode = (char: string): AsciiCode | undefined => {
  if (char.length !== 1) {
    return undefined;
  }

  const num = char.codePointAt(0)!;
  if (num < 0 || 127 < num) {
    return undefined;
  }

  const binStr = num.toString(2);
  return [...Array(7).keys()]
    .map((i) => i - (7 - binStr.length)) // NOTE: For example, ',' becomes '101100', so adjust the range
    .map((i) => binStr.charAt(i) === "1")
    .reverse() as AsciiCode;
};

const asciiCodeToChar = (asciiCode: AsciiCode): string => {
  return String.fromCharCode(
    asciiCode.reduce((acc, b, i) => acc + (b ? 1 << i : 0), 0)
  );
};

// NOTE: Return a 40-column punched card
export const fromText = (text: string): PunchedCard | undefined => {
  if (text.length > 40) {
    return undefined;
  }

  const asciiCodes = Array.from(text).map((c) => charToAsciiCode(c));
  if (asciiCodes.includes(undefined)) {
    return undefined;
  }

  for (; asciiCodes.length < 40; ) {
    asciiCodes.push(Array(7).fill(false) as AsciiCode);
  }
  return asciiCodes as PunchedCard;
};

export const toText = (punchedCard: PunchedCard): string => {
  const newPunchedCard = punchedCard.map((code) => [...code]) as PunchedCard;
  // NOTE: Remove trailing null character
  for (let i = newPunchedCard.length - 1; i >= 0; i--) {
    if (newPunchedCard[i].every((v) => !v)) {
      newPunchedCard.pop();
    } else {
      break;
    }
  }
  return newPunchedCard.map((code) => asciiCodeToChar(code)).join("");
};
