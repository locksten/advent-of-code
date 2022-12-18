const input = await Deno.readTextFile("./input.txt");

const cubes = input.split("\n").map((line) => line.split(",").map(Number));

const minBound = cubes.reduce(
  (bs, c) => bs.map((b, i) => Math.min(b, c[i] - 1)),
  cubes[0]
);

const maxBound = cubes.reduce(
  (bs, c) => bs.map((b, i) => Math.max(b, c[i] + 1)),
  cubes[0]
);

const isOutOfBounds = (c: number[]) =>
  c.some((v, i) => v < minBound[i] || v > maxBound[i]);

const eq = (a: number[], b: number[]) => a.every((v, i) => v === b[i]);

const add = (a: number[], b: number[]) => a.map((v, i) => v + b[i]);

const sides = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const flood = (start: number[]) => {
  let cooling = 0;
  const visited = new Set<string>();
  const queue = [start];
  for (let f = queue.pop(); f; f = queue.pop()) {
    if (isOutOfBounds(f)) continue;
    if (visited.has(f.join(","))) continue;
    visited.add(f.join(","));
    sides.forEach((s) => {
      const dir = add(f!, s);
      if (cubes.some((c) => eq(c, dir))) cooling++;
      else queue.push(dir);
    });
  }
  return cooling;
};

console.log(flood(minBound));
