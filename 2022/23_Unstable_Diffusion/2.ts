// deno-lint-ignore-file no-unused-vars

const input = await Deno.readTextFile("./input.txt");

type Elf = {
  x: number;
  y: number;
  dir: number;
  proposed?: { x: number; y: number };
};

const elves: Elf[] = [];

input
  .split("\n")
  .forEach((col, colIdx) =>
    col
      .split("")
      .forEach(
        (char, rowIdx) =>
          char === "#" && elves.push({ x: rowIdx, y: colIdx, dir: 0 })
      )
  );

const findEmptyDir = (elf: Elf) => {
  const neighbors = elves.filter(
    (e) => Math.abs(elf.x - e.x) < 2 && Math.abs(elf.y - e.y) < 2
  );
  if (neighbors.length - 1 === 0) return "all";
  const isEmptyDir = (dir: number) => {
    switch (dir) {
      case 0:
        return !neighbors.some((e) => e.y < elf.y);
      case 1:
        return !neighbors.some((e) => e.y > elf.y);
      case 2:
        return !neighbors.some((e) => e.x < elf.x);
      case 3:
        return !neighbors.some((e) => e.x > elf.x);
    }
  };
  for (let i = 0; i < 4; i++) {
    const newDir = (elf.dir + i) % 4;
    if (isEmptyDir(newDir)) return newDir;
  }
};

const propose = () => {
  elves.forEach((elf) => {
    elf.proposed = undefined;
    const newDir = findEmptyDir(elf);
    elf.dir = (elf.dir + 1) % 4;
    if (typeof newDir !== "number") return;
    elf.proposed = {
      x: elf.x + (newDir === 3 ? 1 : newDir === 2 ? -1 : 0),
      y: elf.y + (newDir === 0 ? -1 : newDir === 1 ? 1 : 0),
    };
  });
};

const move = () => {
  let moved = false;
  elves.forEach((elf) => {
    if (
      elf.proposed &&
      !elves.some(
        (e) =>
          e !== elf &&
          e.proposed &&
          elf.proposed &&
          e.proposed.x === elf.proposed.x &&
          e.proposed.y === elf.proposed.y
      )
    ) {
      elf.x = elf.proposed.x;
      elf.y = elf.proposed.y;
      moved = true;
    }
  });
  return moved;
};

const write = (s: string) =>
  // deno-lint-ignore no-deprecated-deno-api
  Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(s));

const render = ({ elves }: { elves: Elf[] }) => {
  console.log("\x1Bc");
  console.log();
  [...new Array(80).keys()]
    .map((i) => i - 5)
    .forEach((row) => {
      [...new Array(90).keys()]
        .map((i) => i - 5)
        .forEach((col) => {
          const proposedCount = elves.filter(
            (e) => e.proposed?.x === col && e.proposed.y === row
          ).length;
          if (elves.some((e) => e.x === col && e.y === row)) write("#");
          else if (proposedCount) write(proposedCount.toString());
          else write(".");
        });
      console.log();
    });
  console.log();
  prompt();
};

const round = () => {
  propose();
  // render({ elves });
  const moved = move();
  // render({ elves });
  return moved;
};

let rounds = 0;
while (round()) rounds++;

console.log(rounds + 1);
