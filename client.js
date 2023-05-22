const Hypercore = require('hypercore')
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')

const keys = JSON.parse(process.argv[2])
const range = false

const main = async () => {
  const swarm = new Hyperswarm()

  const coreA = new Hypercore(ram, keys[0])
  const coreB = new Hypercore(ram, keys[1])
  const coreC = new Hypercore(ram, keys[2])

  const coreE = new Hypercore(ram, keys[3])
  const coreF = new Hypercore(ram, keys[4])
  const coreG = new Hypercore(ram, keys[5])

  await coreA.ready()
  await coreB.ready()
  await coreC.ready()

  await coreE.ready()
  await coreF.ready()
  await coreG.ready()

  swarm.join(coreA.discoveryKey)
  swarm.join(coreB.discoveryKey)
  swarm.join(coreC.discoveryKey)

  swarm.join(coreE.discoveryKey)
  swarm.join(coreF.discoveryKey)
  swarm.join(coreG.discoveryKey)

  swarm.on('connection', (conn, peer) => {
    coreA.replicate(conn)
    coreB.replicate(conn)
    coreC.replicate(conn)
    coreE.replicate(conn)
    coreF.replicate(conn)
    coreG.replicate(conn)
  })

  await swarm.flush()

  console.log('Range', range)

  console.log('1000 * 128')
  await download(coreA, 1000, range)
  console.log('1000 * 512')
  await download(coreB, 1000, range)
  console.log('1000 * 4096')
  await download(coreC, 1000, range)

  console.log('2000 * 128')
  await download(coreE, 2000, range)
  console.log('2000 * 512')
  await download(coreF, 2000, range)
  console.log('2000 * 4096')
  await download(coreG, 2000, range)

  process.exit()
}

const download = async (core, length) => {
  const start = Date.now()
  if (!range) {
    for (let i = 0; i < length; i++) {
      await core.get(i)
    }
  } else {
    const range_ = []
    for (let i = 0; i < length; i++) range_.push(i)
    await (core.download(range_)).done()
  }
  const elapsed = Date.now() - start
  console.log('Elapsed', elapsed)
  console.log('Average', elapsed / 1000)
}

main()
