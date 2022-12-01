const input = await Deno.readTextFile("./input.txt");

const totals = input
  .split("\n\n")
  .map((elf) => elf.split("\n").reduce((prev, curr) => prev + Number(curr), 0));

const top = totals
  .slice()
  .sort((a, b) => a - b)
  .slice(-3);

const topSum = top.reduce((prev, curr) => prev + curr, 0);

console.log(totals);
console.log(top);
console.log(topSum);
