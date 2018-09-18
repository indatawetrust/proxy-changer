#!/usr/bin/env node

const ProxyList = require('proxy-sources')
const { spawn } = require('child_process')
const chalk = require('chalk')
const ora = require('ora')
const argv = require('yargs').argv

let names = [
  'ftp', 'web', 'secureweb', 'streaming', 'gopher', 'socksfirewall'
]

if (argv.name) {
  names = (Array.isArray(argv.name) ? argv.name : [argv.name]).filter(name => names.indexOf(name) != -1)
}

const setProxy = (name, host, port) => new Promise((resolve, reject) => {
  
  const child = spawn('networksetup', [`-set${name}proxy`, 'Wi-fi', host, port]);

  child.stderr.on('data', () => {
    reject()
  }) 

  child.on('close', (code) => {
    resolve()
  })

})

const onProxy = (name) => new Promise((resolve, reject) => {
  
  const child = spawn('networksetup', [`-set${name}proxystate`, 'Wi-fi', 'on']);

  child.stderr.on('data', () => {
    reject()
  }) 

  child.on('close', (code) => {
    resolve()
  })

})

const offProxy = (name) => new Promise((resolve, reject) => {
  
  const child = spawn('networksetup', [`-set${name}proxystate`, 'Wi-fi', 'off']);

  child.stderr.on('data', () => {
    reject()
  }) 

  child.on('close', (code) => {
    resolve()
  })

})

const set = () => {
  
  const spinner = ora('🕵  changing proxy..').start()

  ProxyList({ checker: true, timeout: argv.timeout || 1e3 })
  .then(proxies => {

    const [host, port] = proxies.random().split(':')

    Promise
    .all(
      names
      .map(
        name => setProxy(name, host, port)
      )
    )
    .then(() => {
      
      spinner.stop()

      console.log(chalk.cyan(`proxy changed!\n\ncurrent proxy: ${host}:${port}`))

    })

  })
  .catch(err => { 
    console.log(chalk.red(err))
  })

}

if (argv.set) {
  
  set()

} else if (argv.on) {

  const spinner = ora('🕵  opening proxy..').start()

  Promise
  .all(
    names
    .map(
      name => onProxy(name)
    )
  )
  .then(() => {
    
    spinner.stop()

    console.log(chalk.cyan('proxy opened!'))

  })

} else if (argv.off) {

  const spinner = ora('🕵  closing proxy..').start()

  Promise
  .all(
    names
    .map(
      name => offProxy(name)
    )
  )
  .then(() => {
    
    spinner.stop()

    console.log(chalk.cyan('proxy closed!'))

  })

} else {
  
  set()

}
