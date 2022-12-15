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

const isInRangeOfAnySensor = (p: { x: number; y: number }) =>
  sensors.some((sensor) => getDistance(p, sensor) <= sensor.range);

const canBe = (p: { x: number; y: number }) =>
  !(p.x < 0 || p.x > 4000000 || p.y < 0 || p.y > 4000000) &&
  !isInRangeOfAnySensor(p);

const find = () => {
  for (const sensor of sensors) {
    const minY = sensor.y - sensor.range - 1;
    const maxY = sensor.y + sensor.range + 1;
    for (let y = minY; y <= maxY; ++y) {
      const deltaX = sensor.range - Math.abs(y - sensor.y) + 1;
      const left = { x: sensor.x - deltaX, y };
      const right = { x: sensor.x + deltaX, y };
      if (canBe(left)) return left;
      if (canBe(right)) return right;
    }
  }
};

const is = find();

if (is) console.log(is.x * 4000000 + is.y);
