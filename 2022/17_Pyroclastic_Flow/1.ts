const input = await Deno.readTextFile("./inputt.txt");

const width = 7;

const jets = input.split("").map((c) => (c === ">" ? 1 : -1));

const rocks = `####

.#.
###
.#.

..#
..#
###

#
#
#
#

##
##`
  .split("\n\n")
  .map((str) =>
    str
      .split("\n")
      .flatMap((row, rowIdx, rows) =>
        [...row].flatMap((col, colIdx) =>
          col === "." ? [] : [{ x: colIdx, y: rows.length - rowIdx - 1 }]
        )
      )
  );

const write = (s: string) =>
  // deno-lint-ignore no-deprecated-deno-api
  Deno.writeAllSync(Deno.stdout, new TextEncoder().encode(s));

const render = ({
  grid,
  rock,
  floorY,
  stoppedCount,
}: {
  grid: string[][];
  rock?: { x: number; y: number }[];
  floorY: number;
  stoppedCount: number;
}) => {
  console.log();
  console.log("\x1Bc");
  console.log(`floor ${floorY}, stopped ${stoppedCount}`);
  grid.slice(0, 20).forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      const inverseRowIdx = grid.length - rowIdx - 1;
      if (rock?.some(({ x, y }) => y === inverseRowIdx && x === colIdx)) {
        write("@");
      } else {
        write(col);
      }
    });
    console.log();
  });
  console.log();
};

const run = async () => {
  const grid = [...new Array(10).keys()].map((_) => [
    ...new Array(width).fill("."),
  ]);
  let floorY = 0;
  let stoppedCount = 0;
  for (let i = 0; stoppedCount < 2022; ) {
    let rock = rocks[stoppedCount % rocks.length].map((r) => ({
      x: r.x + 2,
      y: r.y + floorY + 3,
    }));
    while (true) {
      grid.unshift(
        ...[...new Array(floorY + 10 - grid.length).keys()].map((_) => [
          ...new Array(width).fill("."),
        ])
      );
      await new Promise((r) => setTimeout(r, 0));
      render({ grid, rock, floorY, stoppedCount });

      const pushedRock = rock.map((p) => ({
        x: p.x + jets[i % jets.length],
        y: p.y,
      }));
      if (
        !pushedRock.some(
          (p) =>
            p.x < 0 ||
            p.x > width - 1 ||
            grid[grid.length - 1 - p.y][p.x] === "#"
        )
      ) {
        rock = pushedRock;
      }

      const fallenRock = rock.map((p) => ({ x: p.x, y: p.y - 1 }));
      if (
        !fallenRock.some(
          (p) => p.y < 0 || grid[grid.length - 1 - p.y][p.x] === "#"
        )
      ) {
        rock = fallenRock;
      } else {
        rock.forEach((p) => {
          floorY = Math.max(floorY, p.y + 1);
          const gridY = grid.length - 1 - p.y;
          grid[gridY][p.x] = "#";
        });
        stoppedCount++;
        i++;
        break;
      }
      i++;
    }
    render({ grid, rock, floorY, stoppedCount });
  }
};

run();
