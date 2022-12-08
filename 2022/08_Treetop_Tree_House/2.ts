const input = await Deno.readTextFile("./input.txt");

const trees = input.split("\n").map((r) => r.split("").map((s) => Number(s)));

const score = (trees: number[], tree: number) => {
  const idx = trees.findIndex((t) => t >= tree);
  return idx === -1 ? trees.length : idx + 1;
};

const scores = trees.map((row, rowIdx) =>
  row.map((tree, colIdx) => {
    const column = trees.map((_, i) => trees[i][colIdx]);
    return (
      score(row.slice(0, colIdx).reverse(), tree) *
      score(row.slice(colIdx + 1), tree) *
      score(column.slice(0, rowIdx).reverse(), tree) *
      score(column.slice(rowIdx + 1), tree)
    );
  })
);

console.log(input);
console.log(trees);
scores.forEach((row) => console.log(row.map((t) => t).join(" ")));
console.log(
  "max score:",
  scores
    .map((row) => row.reduce((p, c) => Math.max(p, c), 0))
    .reduce((p, c) => Math.max(p, c), 0)
);
