const Hypercore = require('hypercore')
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')

const keys = JSON.parse(process.argv[2])
console.log(keys)

const main = async () => {
  const swarm = new Hyperswarm()

  const coreA = new Hypercore(ram, keys[0])
  const coreB = new Hypercore(ram, keys[1])
  const coreC = new Hypercore(ram, keys[2])

  await coreA.ready()
  await coreB.ready()
  await coreC.ready()

  swarm.join(coreA.discoveryKey)
  swarm.join(coreB.discoveryKey)
  swarm.join(coreC.discoveryKey)

  swarm.on('connection', (conn) => {
    coreA.replicate(conn)
    coreB.replicate(conn)
    coreC.replicate(conn)
  })

  await swarm.flush()

  console.log('1000 * 128')
  await download(coreA, 1000)
  console.log('1000 * 512')
  await download(coreB, 1000)
  console.log('1000 * 4096')
  await download(coreC, 1000)
}

const download = async (core, length) => {
  const start = Date.now()
  for (let i = 0; i < length; i++) {
    await core.get(i)
  }
  const elapsed = Date.now() - start
  console.log('Elapsed', elapsed)
  console.log('Average', elapsed / 1000)
}

main()
