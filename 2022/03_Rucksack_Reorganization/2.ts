const input = await Deno.readTextFile("./input.txt");

const sacks = input.split("\n");
const groups = [...Array(sacks.length / 3).keys()].map((i) =>
  sacks.slice(i * 3, i * 3 + 3)
);
const commonGroupItems = groups.map(
  ([first, ...rest]) =>
    [...first].filter((item) => rest.every((sack) => sack.includes(item)))[0]
);

const priorities = commonGroupItems.map((item) => {
  const int = item.charCodeAt(0);
  return int <= "Z".charCodeAt(0)
    ? 27 + (int - "A".charCodeAt(0))
    : 1 + (int - "a".charCodeAt(0));
});

const sum = priorities.reduce((prev, curr) => prev + curr, 0);

console.log(sacks);
console.log(groups);
console.log(commonGroupItems);
console.log(priorities);
console.log(sum);
