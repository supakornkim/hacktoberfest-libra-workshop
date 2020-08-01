const { LibraWallet, LibraClient, LibraNetwork } = require("kulap-libra");
const BigNumber = require('bignumber.js')
const axios = require('axios')
const client = new LibraClient({network: LibraNetwork.Testnet});

// create wallet
const createWallet = async() => {
  const wallet = new LibraWallet()
  const account = wallet.newAccount()
  return {
    account : account,
    address : account.getAddress().toHex(),
    mnemonic : wallet.config.mnemonic
  }
}

// query balance
const getBalance = async(address) => {
  const accountState = await client.getAccountState(address)
  return {
    balance: accountState.balance.div(1e6).toString(),
    balanceWithMacro : accountState.balance.toString()
  }
}

// mint
const mint = async(address, amount) => {
  const newAmount = BigNumber(amount).times(1e6)
  await client.mintWithFaucetService(address, newAmount)
}

// transfer
const transfer = async(account, recipient, amount) => {
  const newAmount = BigNumber(amount).times(1e6)
  const response = await client.transferCoins(account, recipient, newAmount)
  return response
}

// get transaction (extra)
const getTransactions = async(address) => {
  try{
    const response = axios.get('https://api-test.libexplorer.com/api?module=account&action=txlist&address='+address)
    console.log(response.data.result)
    return response.data.result
  }catch (err){
    console.log(err)
  }
}

(async () => {
    // do something here
    console.log('hello hacktoberfest')
    // create wallet
    //const wallet = new LibraWallet()
    const wallet = await createWallet()
    console.log('account created: '+wallet.address)

    //const account = wallet.newAccount()
    //console.log(wallet)
    //console.log(account)

  //  for(let i=0; i<100; i++){
    //  const account = wallet.newAccount(i)
    //  console.log('account ' + i +': '+ account.getAddress().toHex())
  //  }

  //console.log(wallet.config.mnemonic)
  //console.log('account1 ' + i +': '+ account.getAddress().toHex())

    // get initial balance
    //const accountState = await client.getAccountState(wallet.address)
    const balance = await getBalance(wallet.address)
    console.log('balance: '+balance.balance)
    //console.log(accountState)
    // mint some coin
    await mint(wallet.address, 1)
    //await client.mintWithFaucetService(wallet.address, 1000)

    const mint_balance = await getBalance(wallet.address)
    console.log('mint balance: '+mint_balance.balance)

    // transfer
    let response = await transfer(wallet.account, 'a7149260300dc8601ed4d454799dffd1c3411d374c4580c3dab242c959809bab', 1)
    //console.log(response)

    // get transaction history
    let transactions = await getTransactions(wallet.address)
    console.log('transactions: '+transactions)
    

})()
