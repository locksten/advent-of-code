const input = await Deno.readTextFile("./input.txt");

const lines = input
  .split("\n")
  .flatMap((c) => (c.startsWith("addx") ? ["noop", c] : [c]));

let register = 1;
let cycle = 1;
let signalStrengths = 0;

lines.forEach((line) => {
  cycle += 1;
  const [instruction, arg] = line.split(" ");
  if (instruction === "addx") register += Number(arg);
  if ((cycle - 20) % 40 === 0) signalStrengths += register * cycle;
});

console.log(lines);
console.log(register);
console.log(signalStrengths);
