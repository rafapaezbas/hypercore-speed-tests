const Hypercore = require('hypercore')
const Hyperbee = require('hyperbee')
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')
const { writeFile } = require('fs/promises')

class Configuration {
  constructor (entries, blockSize) {
    this.entries = entries
    this.blockSize = blockSize
  }
}

const configurations = [
  new Configuration(1000, 128),
  new Configuration(1000, 512),
  new Configuration(1000, 4096),
  new Configuration(2000, 128),
  new Configuration(2000, 512),
  new Configuration(2000, 4096),
  new Configuration(5000, 128),
  new Configuration(5000, 512),
  new Configuration(5000, 4096)
]

const main = async () => {
  const cores = []
  const bees = []

  const swarm = new Hyperswarm()

  for (let i = 0; i < configurations.length; i++) {
    const core = new Hypercore(ram)
    await core.ready()
    const bee = new Hyperbee(core, { keyEncoding: 'binary', valueEncoding: 'binary' })
    await bee.ready()

    for (let j = 0; j < configurations[i].entries; j++) {
      await bee.put(Buffer.from(i.toString()), Buffer.alloc(configurations[i].blockSize))
    }

    cores.push(core)
    bees.push(bee)
  }

  swarm.on('connection', (conn) => {
    cores.forEach(core => core.replicate(conn))
  })

  cores.forEach(e => swarm.join(e.discoveryKey))
  await swarm.flush()

  const keys = JSON.stringify(cores.map(e => e.key.toString('hex')))
  await writeFile('/tmp/keys', keys)
}

main()
