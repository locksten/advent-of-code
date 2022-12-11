const input = await Deno.readTextFile("./input.txt");

type Monkey = {
  inspectionCount: number;
  items: number[];
  divTest: number;
  inspect: (n: number) => number;
  next: (n: number) => number;
};

const monkeys: Monkey[] = input.split("\n\n").map((monkey) => {
  const [_, items, operation, ...test] = monkey.split("\n");
  const [divTest, ifTrue, ifFalse] = test.map((t) =>
    Number(t.split(" ").pop())
  );
  const op = operation.endsWith("old * old")
    ? "square"
    : operation.includes("+")
    ? "add"
    : "mul";
  const arg = Number(operation.split(" ").pop());
  return {
    inspectionCount: 0,
    items: items.split(":")[1].split(",").map(Number),
    divTest,
    inspect: (n) =>
      op === "square" ? n * n : op === "add" ? n + arg! : n * arg!,
    next: (n) => (n % divTest === 0 ? ifTrue : ifFalse),
  };
});

const product = monkeys.reduce((a, b) => a * b.divTest, 1);

[...new Array(10000).keys()].forEach(() => {
  monkeys.forEach((monkey) => {
    for (let item = monkey.items.shift(); item; item = monkey.items.shift()) {
      monkey.inspectionCount++;
      item = monkey.inspect(item);
      item = item % product;
      monkeys[monkey.next(item)].items.push(item);
    }
  });
});

const max = monkeys.map((m) => m.inspectionCount).sort((a, b) => b - a);

console.log(input);
console.log("business:", max[0] * max[1]);
