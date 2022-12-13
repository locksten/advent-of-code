const input = await Deno.readTextFile("./input.txt");

const pairs = input
  .split("\n\n")
  .map((pair) => pair.split("\n").map((packet) => JSON.parse(packet)));

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

const results = pairs.map(([a, b]) => compare(a, b));

const result = results.reduce(
  (sum, result, idx) => sum + (result < 0 ? idx + 1 : 0),
  0
);

console.log("result", result);
