// --v8-flags=--max-old-space-size=8192

const input = await Deno.readTextFile("./input.txt");

type Valve = {
  name: string;
  rate: number;
  valves: Valves;
  memo: Map<string, number>;
};

type Valves = Record<string, Valve>;

const graph = input
  .split("\n")
  .map((line) => {
    const tokens = line.split(" ");
    const name = tokens[1];
    const rate = Number(tokens[4].split("=")[1].slice(0, -1));
    const valves = tokens.slice(9).join("").split(",");
    return { name, rate, valves, memo: new Map() };
  })
  .reduce((obj, v, _, array) => {
    // @ts-ignore parsing
    v.valves = v.valves.reduce((obj, n) => {
      // @ts-ignore parsing
      obj[n] = array.find((v) => v.name === n);
      return obj;
    }, {});
    // @ts-ignore parsing
    obj[v.name] = v;
    return obj;
  }, {}) as Valves;

const getValue = ({
  valve,
  openValves,
  value,
  time,
}: {
  valve: Valve;
  openValves: Set<string>;
  value: number;
  time: number;
}): number => {
  if (time === 0) return value;
  const openKey = `${time}-${[...openValves].join(",")}-open`;
  const openMemo = valve.memo.get(openKey);
  const opening = openMemo
    ? openMemo
    : valve.rate === 0 || openValves.has(valve.name)
    ? value
    : getValue({
        valve,
        openValves: new Set([...openValves, valve.name]),
        time: time - 1,
        value: value + valve.rate * (time - 1),
      });
  if (!openMemo) valve.memo.set(openKey, opening);
  const paths = Object.values(valve.valves).map((next) => {
    const pathKey = `${time}-${[...openValves].join(",")}-${next.name}`;
    const pathMemo = valve.memo.get(pathKey);
    const pathValue = pathMemo
      ? pathMemo
      : getValue({
          valve: next,
          openValves,
          time: time - 1,
          value,
        });
    if (!pathMemo) valve.memo.set(pathKey, pathValue);
    return pathValue;
  });
  return Math.max(...paths, opening);
};

console.log(
  getValue({
    valve: graph["AA"],
    openValves: new Set(),
    time: 30,
    value: 0,
  })
);
