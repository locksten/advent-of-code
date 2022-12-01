input = open("input.txt", "r").read()

totals = list(map(lambda x: sum(map(int, x.split('\n'))), input.split('\n\n')))

print(max(totals))
