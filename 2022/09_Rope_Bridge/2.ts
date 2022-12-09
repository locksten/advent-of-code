const input = await Deno.readTextFile("./input.txt");

const lines = input.split("\n").map((l) => l.split(" "));

const moves = lines.flatMap(([dir, count]) => [
  ...new Array(Number(count)).fill(dir),
]);

const knots = [...new Array(10)].map(() => ({ x: 0, y: 0 }));

const visited = [{ x: 0, y: 0 }];

moves.forEach((move) => {
  const head = knots[0];
  switch (move) {
    case "R":
      head.x += 1;
      break;
    case "L":
      head.x -= 1;
      break;
    case "U":
      head.y -= 1;
      break;
    case "D":
      head.y += 1;
      break;
  }

  knots.slice(0, -1).forEach((head, idx) => {
    const knot = knots[idx + 1];
    const isTail = idx + 1 === knots.length - 1;
    const delta = { x: head.x - knot.x, y: head.y - knot.y };
    if (Math.abs(delta.x) > 1 || Math.abs(delta.y) > 1) {
      knot.x += Math.sign(delta.x);
      knot.y += Math.sign(delta.y);
      if (isTail && !visited.find((n) => n.x === knot.x && n.y === knot.y))
        visited.push({ ...knot });
    }
  });
});

console.log("visited count:", visited.length);
