const input = await Deno.readTextFile("./input.txt");

const sacks = input.split("\n");
const compartments = sacks.map((sack) => [
  sack.slice(0, sack.length / 2),
  sack.slice(sack.length / 2, sack.length),
]);
const commonSackItems = compartments.map(
  ([a, b]) => [...a].filter((item) => b.includes(item))[0]
);
const commonItems = commonSackItems.flatMap((i) => [...i]);
const priorities = commonItems.map((item) => {
  const int = item.charCodeAt(0);
  return int <= "Z".charCodeAt(0)
    ? 27 + (int - "A".charCodeAt(0))
    : 1 + (int - "a".charCodeAt(0));
});

const sum = priorities.reduce((prev, curr) => prev + curr, 0);

console.log(sacks);
console.log(compartments);
console.log(commonSackItems);
console.log(commonItems);
console.log(priorities);
console.log(sum, sum === 7821);
