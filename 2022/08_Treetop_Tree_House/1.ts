const input = await Deno.readTextFile("./input.txt");

const trees = input.split("\n").map((r) => r.split("").map((s) => Number(s)));

const visibility = trees.map((row, rowIdx) =>
  row.map((tree, colIdx) => {
    const column = trees.map((_, i) => trees[i][colIdx]);
    if (rowIdx === 0 || colIdx === 0) return "e";
    if (rowIdx === row.length - 1 || colIdx === trees.length - 1) return "e";
    if (row.slice(0, colIdx).every((t) => t < tree)) return "l";
    if (row.slice(colIdx + 1).every((t) => t < tree)) return "r";
    if (column.slice(0, rowIdx).every((t) => t < tree)) return "t";
    if (column.slice(rowIdx + 1).every((t) => t < tree)) return "b";
    else return ".";
  })
);

console.log(input);
console.log(trees);
visibility.forEach((row) => console.log(row.map((t) => t).join("")));
console.log(
  "total visible:",
  visibility
    .map((row) => row.filter((t) => t !== ".").length)
    .reduce((p, c) => p + c, 0)
);
