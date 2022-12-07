const input = await Deno.readTextFile("./input.txt");

const commands = input
  .split(/^\$\ |\n\$\ /)
  .map((s) => s.split("\n"))
  .slice(1);

type File = { type: "file"; size: number; name: string };

type Directory = {
  name: string;
  type: "dir";
  size?: number;
  parent?: Directory;
  children: { [name: string]: File | Directory };
};

const tree: Directory = { type: "dir", children: {}, name: "/" };
let cwd = tree;

commands.forEach(([commandWithArg, ...outputs]) => {
  const [command, arg] = commandWithArg.split(" ");
  switch (command) {
    case "cd":
      switch (arg) {
        case "/":
          cwd = tree;
          break;
        case "..":
          if (cwd.parent) cwd = cwd.parent;
          break;
        default: {
          const child = cwd.children[arg];
          if (child && child.type === "dir") cwd = child;
        }
      }
      break;
    case "ls":
      outputs.forEach((output) => {
        const tokens = output.split(" ");
        if (tokens[0] === "dir") {
          cwd.children[tokens[1]] = {
            type: "dir",
            children: {},
            parent: cwd,
            name: tokens[1],
          };
        } else {
          cwd.children[tokens[1]] = {
            type: "file",
            size: Number(tokens[0]),
            name: tokens[1],
          };
        }
      });
      break;
  }
});

const calculateDirSizes = (tree: File | Directory): number | undefined => {
  if (tree.type === "dir") {
    tree.size =
      tree.size ??
      Object.values(tree.children)
        .map((tree) => calculateDirSizes(tree))
        .reduce((c, p) => (c ?? 0) + (p ?? 0), 0);
  }
  return tree.size;
};

const sumSmallDirs = (tree: File | Directory): number =>
  tree.type === "dir"
    ? (tree.size && tree.size < 100000 ? tree.size : 0) +
      (Object.values(tree.children)
        .map((tree) => sumSmallDirs(tree))
        .reduce((c, p) => (c ?? 0) + (p ?? 0), 0) ?? 0)
    : 0;

const findSmallestAbove = (
  tree: File | Directory,
  above: number,
  smallest = Number.MAX_VALUE
): number =>
  tree.type === "dir"
    ? Math.min(
        tree.size && tree.size < smallest && tree.size >= above
          ? tree.size
          : Number.MAX_VALUE,
        ...Object.values(tree.children).map((tree) =>
          findSmallestAbove(tree, above, smallest)
        )
      )
    : Number.MAX_VALUE;

const print = (tree: File | Directory, depth = 0) => {
  const padding = " ".repeat(depth * 2);
  if (tree.type === "dir") {
    console.log(`${padding}> ${tree.name} (${tree.size})`);
    Object.values(tree.children).map((tree) => print(tree, depth + 1));
  } else {
    console.log(`${padding}- ${tree.name} (${tree.size})`);
  }
};

calculateDirSizes(tree);
const freeSpace = 70000000 - (tree.size ?? 0);
const neededSpace = 30000000 - freeSpace;
print(tree);
console.log("sum of small directories", sumSmallDirs(tree));
console.log(
  "size of directory to delete",
  findSmallestAbove(tree, neededSpace) === 12390492
);
