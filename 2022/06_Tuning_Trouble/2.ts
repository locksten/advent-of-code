const input = await Deno.readTextFile("./input.txt");

const unique = ([s, ...rest]: string[]): boolean =>
  s ? !rest.includes(s) && unique(rest) : true;

const first = [...input].findIndex((_, i, list) =>
  i < 14 ? false : unique(list.slice(i - 14, i))
);

console.log(input);
console.log(first);
