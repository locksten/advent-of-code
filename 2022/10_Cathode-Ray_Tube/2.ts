const input = await Deno.readTextFile("./input.txt");

const lines = input
  .split("\n")
  .flatMap((c) => (c.startsWith("addx") ? ["noop", c] : [c]))
  .map((s) => s.split(" "));

const screen = [...new Array(6 * 40)].fill(".");

let register = 1;
let cycle = 0;

lines.forEach(([instruction, arg]) => {
  if (Math.abs(register - (cycle % 40)) < 2) screen[cycle] = "#";
  if (instruction === "addx") register += Number(arg);
  cycle += 1;
});

console.log(lines);
[...new Array(6).keys()]
  .map((r) => screen.slice(r * 40, (r + 1) * 40))
  .forEach((r) => console.log(r.join("")));
