# Hypercore speed tests

## Baseline

Test with Hypercore and Hyperbee:

### Hyperbee

```
  for (let i = 0; i < configurations.length; i++) {
    await download(cores[i], configurations[i].entries, range)
  }
```

Entries * Block Size

```
1000 * 128
9135ms, 5694ms, 7251ms

1000 * 512
8175ms, 8088ms, 6366ms

1000 * 4096
10107ms, 8098ms, 7981ms

2000 * 128
14109ms, 11143ms, 11803ms

2000 * 512
13957ms, 13605ms, 9953ms

2000 * 4096
15962ms, 14082ms, 16091ms

5000 * 128
31203ms, 32387ms, 30536ms

5000 * 512
34950ms, 32360ms, 31860ms

5000 * 4096
37465ms, 35094ms, 42260ms
```

## Hyperbee range

```
for await (const entry of bees[i].createReadStream({ gte: Buffer.from('0'), lt: Buffer.from(configurations[i].entries.toString()) }))
```


```
1000 * 128
103ms, 65ms, 76ms

1000 * 512
70ms, 171ms, 59ms

1000 * 4096
113ms, 126ms, 82ms

2000 * 128
1494ms, 2199ms, 1499ms

2000 * 512
1160ms, 3649ms, 1234ms

2000 * 4096
2042ms, 6301ms, 2047ms

5000 * 128
4188ms, 4150ms, 3771ms

5000 * 512
4514ms, 4415ms, 4065ms

5000 * 4096
9075ms, 7543ms, 8200ms
```

# Hypercore

```
  for (let i = 0; i < length; i++) {
    await core.get(i)
  }
```

```
1000 * 128
8412ms, 8528ms, 6121ms

1000 * 512
6233ms, 8445ms, 6861ms

1000 * 4096
7270ms, 9483ms, 8395ms

2000 * 128
12359ms, 12331ms, 10842ms

2000 * 512
16159ms, 15544ms, 15012ms

2000 * 4096
16413ms, 18175ms, 18613ms

5000 * 128
36637ms, 32452ms, 30608ms

5000 * 512
31012ms, 41252ms, 36147ms

5000 * 4096
39664ms, 39904ms, 45550ms
```

# Hypercore range

```
for (let i = 0; i < length; i++) range.push(i)
await (core.download(range)).done()
```

```
1000 * 128
1273ms, 997ms, 1045ms

1000 * 512
883ms, 1023ms, 802ms

1000 * 4096
1582ms, 2057ms, 2164ms

2000 * 128
2463ms, 1671ms, 1778ms

2000 * 512
1848ms, 1985ms, 2182ms

2000 * 4096
3158ms, 4090ms, 4083ms

5000 * 128
4589ms, 4254ms, 4269ms

5000 * 512
4788ms, 5251ms, 4814ms

5000 * 4096
9281ms, 10329ms, 10408ms
```

### Note

No difference found when using __const DEFAULT_MAX_INFLIGHT = 32__ and __const DEFAULT_MAX_INFLIGHT = 64__
