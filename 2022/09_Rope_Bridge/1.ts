const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\n").map((l) => l.split(" "));

const moves = lines.flatMap(([dir, count]) => [
  ...new Array(Number(count)).fill(dir),
]);

const headPrev = { x: 0, y: 0 };
const head = { x: 0, y: 0 };
const tail = { x: 0, y: 0 };

const visited = [{ x: 0, y: 0 }];

moves.forEach((move) => {
  headPrev.x = head.x;
  headPrev.y = head.y;

  switch (move) {
    case "R":
      head.x += 1;
      break;
    case "L":
      head.x -= 1;
      break;
    case "U":
      head.y += 1;
      break;
    case "D":
      head.y -= 1;
      break;
  }

  if (Math.abs(head.x - tail.x) > 1 || Math.abs(head.y - tail.y) > 1) {
    tail.x = headPrev.x;
    tail.y = headPrev.y;
    if (!visited.find((n) => n.x === tail.x && n.y === tail.y))
      visited.push({ ...tail });
  }
});

console.log(visited.length);
