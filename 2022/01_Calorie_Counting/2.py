input = open("input.txt", "r").read()

totals = list(map(lambda x: sum(map(int, x.split('\n'))), input.split('\n\n')))

top = sorted(totals)[-3:]

print(totals)
print(top)
print(sum(top))
