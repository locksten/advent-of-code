// deno-lint-ignore-file no-unused-vars
const input = await Deno.readTextFile("./input.txt");

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
}: {
  grid: string[][];
  rock?: { x: number; y: number }[];
}) => {
  console.log();
  //   console.log("\x1Bc");
  grid.forEach((row, rowIdx) => {
    if (rowIdx > 30) return;
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

const stopLimit = 1000000000000;

const run = () => {
  const grid = [...new Array(10).keys()].map((_) => [
    ...new Array(width).fill("."),
  ]);
  let floorY = 0;
  let stoppedCount = 0;
  for (let i = 0; stoppedCount < stopLimit; ) {
    // if (Math.abs(floorY - 2582) < 40) {
    //   console.log(`>>> at ${floorY}, stopped`, stoppedCount);
    // }
    if (stoppedCount && stoppedCount % 50000 === 0) {
      return grid;
    }
    let rock = rocks[stoppedCount % rocks.length].map((r) => ({
      x: r.x + 2,
      y: r.y + floorY + 3,
    }));
    while (true) {
      //   console.log(stoppedCount, floorY);
      grid.unshift(
        ...[...new Array(floorY + 10 - grid.length).keys()].map((_) => [
          ...new Array(width).fill("."),
        ])
      );
      //   await new Promise((r) => setTimeout(r, 0));
      //   render({ grid, rock });

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
    // render({ grid, rock });
  }
  console.log(">>", stoppedCount, floorY);
};

const grid = run()!;

const find = (grid: string[][], ref: string[][]) => {
  const matches: number[][] = [];
  [...new Array(50000).keys()].forEach((i) => {
    const window = grid.slice(i, i + ref.length);
    if (
      window.every((row, rowIdx) =>
        row.every((col, colIdx) => col === ref[rowIdx][colIdx])
      )
    ) {
      //   console.log(">> pattern match", i, i + ref.length);
      matches.push([i, i + ref.length]);
    }
  });
  return matches;
};

const findPattern = () => {
  let res: number[] = [];
  [...new Array(5000).keys()].forEach((i) => {
    const matches = find(grid, grid.slice(10, 10 + i));
    if (matches.length < 4) return;
    const off = matches[3][1] - matches[4][0];
    if (off === 0) res = matches[0];
  });
  return grid.slice(...res);
};

const pattern = findPattern();

// matches
// [ 10, 2584 ],
// [ 2584, 5158 ],
// [ 5158, 7732 ],
// [ 7732, 10306 ],
// [ 10306, 12880 ],
// [ 12880, 15454 ],
// [ 15454, 18028 ],
// [ 18028, 20602 ],
// [ 20602, 23176 ],
// [ 23176, 25750 ],

// 0-2582y, (first 2582y) stopped 1707
// 2582-5156y, (every 2574y) stopped 1715

// stopped = 1000000000000
// first 1707 = 2582y
// next 583090378 1715s each 2574y = 1500874632972y
// last 23 = 33y

console.log(2582 + 1500874632972 + 33);

// >> at 8, stopped 7
// >>> at 11, stopped 8
// >>> at 11, stopped 9
// >>> at 11, stopped 10

// >>> at 2582, stopped 1707
// >>> at 2585, stopped 1708

// >>> at 5156, stopped 3422
// >>> at 5159, stopped 3423

// >>> at 7730, stopped 5137
// >>> at 7733, stopped 5138

// >>>> at 2582, stopped 1707
// >>> at 2585, stopped 1708
// >>> at 2585, stopped 1709
// >>> at 2585, stopped 1710
// >>> at 2586, stopped 1711
// >>> at 2589, stopped 1712
// >>> at 2592, stopped 1713
// >>> at 2592, stopped 1714
// >>> at 2592, stopped 1715
// >>> at 2592, stopped 1716
// >>> at 2594, stopped 1717
// >>> at 2597, stopped 1718
// >>> at 2597, stopped 1719
// >>> at 2599, stopped 1720
// >>> at 2600, stopped 1721
// >>> at 2603, stopped 1722
// >>> at 2605, stopped 1723
// >>> at 2607, stopped 1724
// >>> at 2607, stopped 1725
// >>> at 2608, stopped 1726
// >>> at 2610, stopped 1727
// >>> at 2611, stopped 1728
// >>> at 2613, stopped 1729
// >>>> at 2615, stopped 1730
// >>> at 2616, stopped 1731
// >>> at 2619, stopped 1732
// >>> at 2621, stopped 1733
