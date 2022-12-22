const input = await Deno.readTextFile("./input.txt");

type Op = (a: number, b: number) => number;

const ops: Record<string, Op> = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => a / b,
};

type Monkey = { name: string; a?: string; op?: Op; b?: string; n?: number };

type MonkeyNode = Omit<Monkey, "a" | "b"> & { a?: MonkeyNode; b?: MonkeyNode };

const monkeys: Monkey[] = input.split("\n").map((monkey) => {
  const tokens = monkey.split(" ");
  return {
    name: tokens[0].slice(0, -1),
    ...(tokens.length === 2 ? { n: Number(tokens[1]) } : undefined),
    ...(tokens.length === 4
      ? { a: tokens[1], op: ops[tokens[2]], b: tokens[3] }
      : undefined),
  };
});

const toTree = ({ a, b, ...monkey }: Monkey): MonkeyNode => {
  return {
    ...monkey,
    ...(a ? { a: toTree(monkeys.find((m) => m.name === a)!) } : undefined),
    ...(b ? { b: toTree(monkeys.find((m) => m.name === b)!) } : undefined),
  };
};

const evalTree = ({ a, b, op, n }: MonkeyNode): number =>
  n ? n : op!(evalTree(a!), evalTree(b!));

const tree = toTree(monkeys.find((m) => m.name === "root")!);

console.log(evalTree(tree) === 49288254556480);
