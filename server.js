const Hypercore = require('hypercore')
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')
const { writeFile } = require('fs/promises')
const { configurations } = require('./lib/configuration')

const main = async () => {
  const swarm = new Hyperswarm()

  const cores = []

  for (let i = 0; i < configurations.length; i++) {
    const core = new Hypercore(ram)
    await core.ready()
    for (let j = 0; j < configurations[i].entries; j++) await core.append(Buffer.alloc(configurations[i].blockSize))
    swarm.join(core.discoveryKey)
    cores.push(core)
  }

  swarm.on('connection', (conn) => {
    cores.forEach(core => core.replicate(conn))
  })

  await swarm.flush()

  const keys = JSON.stringify(cores.map(core => core.key.toString('hex')))
  await writeFile('/tmp/keys', keys)
  console.log('ready', keys)
}

main()
