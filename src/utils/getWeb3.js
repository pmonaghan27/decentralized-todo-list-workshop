import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', () => {
    let results
    let web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      results = {
        web3: web3
      }

      console.log('Injected web3 (MetaMask) detected.');

      resolve(results)
    } else {
      // if no web3 instance is injected by metamask, we throw an error
      reject('No web3 injected by MetaMask')
    }
  })
})

export default getWeb3