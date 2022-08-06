export const arrayChunk = <T>(array: Array<T>, length: number): Array<T>[] => {
  const arr = [];
  for (let i = 0; i < array.length; i += length) {
    arr.push([...array.slice(i, i + length)]);
  }
  return arr;
};
