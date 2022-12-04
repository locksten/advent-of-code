const input = await Deno.readTextFile("./input.txt");

const pairs = input
  .split("\n")
  .map((pair) => pair.split(",").map((range) => range.split("-").map(Number)));

const containsCount = pairs.filter(
  ([[a1, a2], [b1, b2]]) => (a1 <= b1 && a2 >= b2) || (b1 <= a1 && b2 >= a2)
).length;

console.log(pairs);
console.log(containsCount);
