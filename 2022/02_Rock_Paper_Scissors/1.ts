const input = await Deno.readTextFile("./input.txt");

const winning = ["C X", "B Z", "A Y"];
const drawing = ["A X", "B Y", "C Z"];
const shapeScores: { [k: string]: number } = { X: 1, Y: 2, Z: 3 };

const roundScores = input
  .split("\n")
  .map(
    (round) =>
      shapeScores[round[2]] +
      (winning.includes(round) ? 6 : drawing.includes(round) ? 3 : 0)
  );

const sum = roundScores.reduce((prev, curr) => prev + curr, 0);

console.log(sum);
