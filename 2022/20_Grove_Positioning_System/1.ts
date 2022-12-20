const input = await Deno.readTextFile("./input.txt");

const moves = input.split("\n").map((n) => ({ n: Number(n) }));
const ns = moves.slice();

moves.forEach((move) => {
  const idx = ns.indexOf(move);
  const [n] = ns.splice(idx, 1);
  const newIdx = (move.n + idx) % ns.length;
  ns.splice(newIdx, 0, n);
});

const zeroIdx = ns.findIndex((n) => n.n === 0);
const values = [1000, 2000, 3000].map((n) => ns[(zeroIdx + n) % ns.length].n);
console.log(values.reduce((a, b) => a + b, 0));
