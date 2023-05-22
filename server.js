const Hypercore = require('hypercore')
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')

const main = async () => {
  const swarm = new Hyperswarm()

  // hypercore 1000 * 128
  const coreA = new Hypercore(ram)
  await coreA.ready()
  for (let i = 0; i < 1000; i++) await coreA.append(Buffer.alloc(128))

  // hypercore 1000 * 512
  const coreB = new Hypercore(ram)
  await coreB.ready()
  for (let i = 0; i < 1000; i++) await coreB.append(Buffer.alloc(512))

  // hypercore 1000 * 4096
  const coreC = new Hypercore(ram)
  await coreC.ready()
  for (let i = 0; i < 1000; i++) await coreC.append(Buffer.alloc(4096))

  // hypercore 2000 * 128
  const coreE = new Hypercore(ram)
  await coreE.ready()
  for (let i = 0; i < 2000; i++) await coreE.append(Buffer.alloc(128))

  // hypercore 2000 * 512
  const coreF = new Hypercore(ram)
  await coreF.ready()
  for (let i = 0; i < 2000; i++) await coreF.append(Buffer.alloc(512))

  // hypercore 2000 * 4096
  const coreG = new Hypercore(ram)
  await coreG.ready()
  for (let i = 0; i < 2000; i++) await coreG.append(Buffer.alloc(4096))

  swarm.join(coreA.discoveryKey)
  swarm.join(coreB.discoveryKey)
  swarm.join(coreC.discoveryKey)
  swarm.join(coreE.discoveryKey)
  swarm.join(coreF.discoveryKey)
  swarm.join(coreG.discoveryKey)

  swarm.on('connection', (conn) => {
    coreA.replicate(conn)
    coreB.replicate(conn)
    coreC.replicate(conn)
    coreE.replicate(conn)
    coreF.replicate(conn)
    coreG.replicate(conn)
  })

  await swarm.flush()

  const keys = [
    coreA.key.toString('hex'),
    coreB.key.toString('hex'),
    coreC.key.toString('hex'),
    coreE.key.toString('hex'),
    coreF.key.toString('hex'),
    coreG.key.toString('hex')
  ]

  console.log(JSON.stringify(keys))
}

main()
