// deno-lint-ignore-file no-unused-vars
const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\n").slice(0, -2);
const maxWidth = lines.reduce((a, b) => Math.max(a, b.length), 0);
const map = lines.map((line) => line.padEnd(maxWidth, " ").split(""));
const moves = [
  ...input
    .split("\n")
    .slice(-1)[0]
    .matchAll(/\d+[A-Z]?/g),
].map((m) => {
  const str = m[0];
  const dir = str.match(/[A-Z]/)?.[0];
  return {
    n: Number(str.match(/\d+/)?.[0]),
    dir: dir === "R" ? 1 : dir === "L" ? -1 : undefined,
  };
});

const dirs = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

let pos = { y: 0, x: [...map[0]].indexOf(".") };
let dir = 0;

const mod = (n: number, m: number) => ((n % m) + m) % m;

const add = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
  x: mod(a.x + b.x, map[0].length),
  y: mod(a.y + b.y, map.length),
});

const write = (s: string) =>
  // deno-lint-ignore no-deprecated-deno-api
  Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(s));

const render = ({
  map,
  pos,
  dir,
}: {
  map: string[][];
  pos?: { x: number; y: number };
  dir?: number;
}) => {
  console.log("\x1Bc");
  console.log();
  map.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      if (pos?.x === colIdx && pos.y === rowIdx)
        write(dir === 0 ? ">" : dir === 1 ? "v" : dir === 2 ? "<" : "^");
      else write(col);
    });
    console.log();
  });
  console.log();
  prompt();
};

const moveInDir = (pos: { x: number; y: number }, dir: number, n: number) => {
  let newPos = pos;
  let nextPos = add(newPos, dirs[dir]);
  for (let i = 0; map[nextPos.y][nextPos.x] !== "#" && i < n; ) {
    if (map[nextPos.y][nextPos.x] === ".") newPos = nextPos;
    if (map[nextPos.y][nextPos.x] !== " ") i++;
    nextPos = add(nextPos, dirs[dir]);
  }
  // await render({ map, pos: newPos, dir });
  return newPos;
};

moves.forEach((move) => {
  pos = moveInDir(pos, dir, move.n);
  if (typeof move.dir === "number") dir = mod(dir + move.dir, dirs.length);
});
// render({ map, pos, dir });

const row = pos.y + 1;
const col = pos.x + 1;
console.log(row, col, dir, "=", 1000 * row + 4 * col + dir);
