const input = await Deno.readTextFile("./input.txt");

const cubes = input.split("\n").map((line) => line.split(",").map(Number));

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

const area = cubes
  .map(
    (cube) =>
      sides.filter((side) => !cubes.some((c) => eq(c, add(cube, side)))).length
  )
  .reduce((a, b) => a + b, 0);

console.log(area);
