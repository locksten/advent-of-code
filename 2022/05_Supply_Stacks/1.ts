const input = await Deno.readTextFile("./input.txt");

const [stacksInput, movesInput] = input.split("\n\n");

const rows = stacksInput.split("\n").slice(0, -1);

const stacks: string[][] = [...Array((rows[0].length + 1) / 4).keys()].map(
  (_) => []
);

rows.forEach((row) =>
  stacks.forEach((_, i) => {
    const item = row[i * 4 + 1];
    if (item !== " ") stacks[i].unshift(item);
  })
);

const moves = movesInput.split("\n").map((move) => {
  const m = move.split(" ");
  return [Number(m[1]), Number(m[3]) - 1, Number(m[5]) - 1];
});

moves.forEach(([count, from, to]) =>
  [...Array(count).keys()].forEach((_) => stacks[to].push(stacks[from].pop()!))
);

const tops = stacks.map((s) => s[s.length - 1]).join("");

console.log(stacksInput);
console.log(stacks);
console.log(movesInput);
console.log(moves);
console.log(tops);
