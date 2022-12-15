const input = await Deno.readTextFile("./input.txt");

const getDistance = (
  a: { x: number; y: number },
  b: { x: number; y: number }
) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

const sensors = input.split("\n").map((l) => {
  const tokens = l.split(" ").map((t) => t.split("=")[1]);
  const sensor = {
    x: Number(tokens[2].slice(0, -1)),
    y: Number(tokens[3].slice(0, -1)),
  };
  const beacon = { x: Number(tokens[8].slice(0, -1)), y: Number(tokens[9]) };
  return { ...sensor, range: getDistance(sensor, beacon) };
});

const minX = Math.min(...sensors.map((s) => s.x - s.range));
const maxX = Math.max(...sensors.map((s) => s.x + s.range));

const isInRangeOfAnySensor = (p: { x: number; y: number }) =>
  sensors.some((sensor) => getDistance(p, sensor) <= sensor.range);

let count = 0;
for (let x = minX; x <= maxX; x++)
  if (isInRangeOfAnySensor({ x, y: 2000000 })) count++;

console.log(count - 1);
