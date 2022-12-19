const input = await Deno.readTextFile("./input.txt");

type Bot = { cost: number[]; prod: number[] };

const blueprints = input
  .split("\n")
  .slice(0, 3)
  .map((l) => {
    const n = [...l.matchAll(/\d+/g)].map(Number);
    return [
      {
        cost: [n[1], 0, 0, 0],
        prod: [1, 0, 0, 0],
      },
      {
        cost: [n[2], 0, 0, 0],
        prod: [0, 1, 0, 0],
      },
      {
        cost: [n[3], n[4], 0, 0],
        prod: [0, 0, 1, 0],
      },
      {
        cost: [n[5], 0, n[6], 0],
        prod: [0, 0, 0, 1],
      },
    ] as Bot[];
  });

let soFar = 0;
const go = ({
  bots,
  production,
  stock,
  time,
}: {
  bots: Bot[];
  production: number[];
  stock: number[];
  time: number;
}): number => {
  if (stock[3] + production[3] * time + (time * (time + 1)) / 2 <= soFar) soFar;
  const options = bots
    .filter(
      (_, i) =>
        i === 3 ||
        (production[i + 1] <= 4 &&
          !bots.every((b) => stock[i] > b.cost[i] && production[i] > b.cost[i]))
    )
    .map((bot) => {
      let timeNeeded = 1;
      const stockMinusNew = stock.map((resource, i) => {
        const newResource = resource - bot.cost[i];
        if (newResource >= 0) {
          return newResource;
        } else {
          const tNeeded = Math.ceil(-newResource / production[i]) + 1;
          timeNeeded = Math.max(timeNeeded, tNeeded);
          return newResource;
        }
      });
      const newTime = time - timeNeeded;
      if (newTime <= 0 || !isFinite(newTime))
        return stock[3] + production[3] * time;
      const stockAfterAfford = stockMinusNew.map(
        (resource, i) => resource + production[i] * timeNeeded
      );
      return go({
        bots,
        production: production.map((p, i) => p + bot.prod[i]),
        stock: stockAfterAfford,
        time: newTime,
      });
    });
  const max = Math.max(...options);
  soFar = Math.max(soFar, max);
  return max;
};

blueprints.forEach((blueprint) => {
  const geodes = go({
    bots: blueprint,
    production: [1, 0, 0, 0],
    stock: [0, 0, 0, 0],
    time: 32,
  });
  console.log(geodes);
});
