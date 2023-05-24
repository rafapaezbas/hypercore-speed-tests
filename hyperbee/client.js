const Hypercore = require('hypercore')
const Hyperbee = require('hyperbee')
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')
const { readFile } = require('fs/promises')
const { configurations } = require('../lib/configuration')

const main = async () => {
  const keys = JSON.parse(await readFile('/tmp/keys'))
  const cores = []
  const bees = []

  const swarm = new Hyperswarm()

  for (let i = 0; i < configurations.length; i++) {
    const core = new Hypercore(ram, keys[i])
    await core.ready()
    const bee = new Hyperbee(core, { keyEncoding: 'binary', valueEncoding: 'binary' })
    await bee.ready()

    cores.push(core)
    bees.push(bee)
  }

  swarm.on('connection', (conn) => {
    cores.forEach(core => core.replicate(conn))
  })

  cores.forEach(e => swarm.join(e.discoveryKey))
  await swarm.flush()

  for (let i = 0; i < configurations.length; i++) {
    console.log(configurations[i].entries, '*', configurations[i].blockSize)
    const start = Date.now()
    for (let j = 0; j < configurations[i].entries; j++) {
      const entry = await bees[i].get(Buffer.from(j.toString()))
    }
    // for await (const entry of bees[i].createReadStream({ gte: Buffer.from('0'), lt: Buffer.from(configurations[i].entries.toString()) })) {
    }
    const elapsed = Date.now() - start
    console.log('elapsed', elapsed)
  }
}

main()
