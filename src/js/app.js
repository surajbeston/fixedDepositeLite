App = {
  loading: false,
  contracts: {},

  id : "",

  load: async() => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render()
  },

  loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }, 
  loadAccount: async () => {
      App.account = web3.eth.accounts[0]
  },

  loadContract: async () => {
      var FixedDeposit = await $.getJSON('FixedDeposit.json');

      App.contracts.FixedDeposit = TruffleContract(FixedDeposit);

      App.contracts.FixedDeposit.setProvider(App.web3Provider)

      App.FixedDeposit = await App.contracts.FixedDeposit.deployed()

      console.log(App.FixedDeposit)
      App.FixedDeposit.AmountRead((data, sdfh) => {
        console.log(sdfh.args._value.toString())
      })
  },

  deposit: async () => {
    App.FixedDeposit.deposit("sdfsdf", {from: "0x172CdCE74e56544df20138Fc721E1932603f9E0f", value: 10**19}).then((result) => {
      console.log(result)
    })
  },

  viewAmount: async () => {
    App.FixedDeposit.viewAmount({from: "0x172CdCE74e56544df20138Fc721E1932603f9E0f"}).then((amount) => {
      console.log(amount)
    })
  },

  withdraw: async() => {
    App.FixedDeposit.withdraw("0x172CdCE74e56544df20138Fc721E1932603f9E0f", {from: "0x9423a7c0632def23714f69906b45d3a0f5bb33ef", value: (10**19)*7}).then(() => {      
    })
  }, 
  render: async () => {
      var user_address = await App.account
      console.log(user_address)
      $("#address").text(user_address)
  }

}

$(() => {
  $(window).load(() => {
    App.load()
  })
})