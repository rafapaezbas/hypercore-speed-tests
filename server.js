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

  swarm.join(coreA.discoveryKey)
  swarm.join(coreB.discoveryKey)
  swarm.join(coreC.discoveryKey)

  swarm.on('connection', (conn) => {
    coreA.replicate(conn)
    coreB.replicate(conn)
    coreC.replicate(conn)
  })

  await swarm.flush()

  console.log(JSON.stringify([coreA.key.toString('hex'), coreB.key.toString('hex'), coreC.key.toString('hex')]))
}

main()
