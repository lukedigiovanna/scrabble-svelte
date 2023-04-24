with open('dictionary.txt', 'r') as f:
    words = f.read().split('\n')
    for w in words:
        print(f'"{w}"',end=',')