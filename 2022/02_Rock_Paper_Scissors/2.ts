const input = await Deno.readTextFile("./input.txt");

const rounds = input.split("\n") as unknown as [
  "A" | "B" | "C",
  " ",
  "X" | "Y" | "Z"
][];

const shapes = { A: 0, C: 1, B: 2 };
const scores = [1, 3, 2];

const roundScores = rounds.map(([opponent, _, plan]) => {
  switch (plan) {
    case "X": // lose
      return scores[(shapes[opponent] + 1) % 3] + 0;
    case "Y": // draw
      return scores[shapes[opponent]] + 3;
    case "Z": // win
      return scores[(shapes[opponent] - 1 + 3) % 3] + 6;
  }
});

const sum = roundScores.reduce((prev, curr) => prev + curr, 0);

console.log(sum);
