const Hypercore = require('hypercore')
const Hyperswarm = require('hyperswarm')
const ram = require('random-access-memory')
const { readFile } = require('fs/promises')
const { configurations } = require('./lib/configuration')

const range = true

const main = async () => {
  const keys = await JSON.parse(await readFile('/tmp/keys'))
  const swarm = new Hyperswarm()
  const cores = []

  for (let i = 0; i < configurations.length; i++) {
    const core = new Hypercore(ram, keys[i])
    await core.ready()
    swarm.join(core.discoveryKey)
    cores.push(core)
  }

  swarm.on('connection', (conn) => {
    cores.forEach(core => core.replicate(conn))
  })

  await swarm.flush()

  for (let i = 0; i < configurations.length; i++) {
    console.log(configurations[i].entries, '*', configurations[i].blockSize)
    await download(cores[i], configurations[i].entries, range)
  }

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
