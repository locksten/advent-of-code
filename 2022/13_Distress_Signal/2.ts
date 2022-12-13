const input = await Deno.readTextFile("./input.txt");

const packets = [
  ...input
    .split("\n\n")
    .flatMap((pair) => pair.split("\n").map((packet) => JSON.parse(packet))),
  [[2]],
  [[6]],
];

const compare = (a: number | number[], b: number | number[]): number => {
  if (typeof a === "number" && Array.isArray(b)) {
    return compare([a], b);
  } else if (Array.isArray(a) && typeof b === "number") {
    return compare(a, [b]);
  } else if (typeof a === "number" && typeof b === "number") {
    return a - b;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length === 0 && b.length === 0) return 0;
    if (a.length === 0) return -1;
    if (b.length === 0) return 1;
    const cmp = compare(a[0], b[0]);
    return cmp === 0 ? compare(a.slice(1), b.slice(1)) : cmp;
  }
  return 0;
};

const sorted = packets.toSorted((a, b) => compare(a, b));

const findDivider = (divider: number) =>
  sorted.findIndex(
    (packet) =>
      packet?.length === 1 &&
      packet[0]?.length === 1 &&
      packet[0][0] === divider
  ) + 1;

const key = findDivider(2) * findDivider(6);

console.log("decoder key", key);
