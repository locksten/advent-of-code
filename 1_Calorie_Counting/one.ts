const input = await Deno.readTextFile("./input.txt");

const totals = input
  .split("\n\n")
  .map((elf) => elf.split("\n").reduce((prev, curr) => prev + Number(curr), 0));

const max = Math.max(...totals);

console.log(max);
