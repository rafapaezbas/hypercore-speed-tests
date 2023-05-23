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

module.exports = {
  configurations
}
