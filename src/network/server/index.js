import axios from 'axios'
const etherscanAPIKey = "X9ITJBMCCS6RDC96RB4AKV37KBEWBWSYWW"
const etherscanAPIURL = "https://api-kovan.etherscan.io/api"

const getTransactions = async (wallet, account, offset=0) => {
  if (account.currency === "ETH") {
    const module = "account"
    const action = "txlist"
    const address = wallet.address
    const startblock = 0
    const endblock = 99999999
    const page = 1
    const count = 10
    const sort = "desc"
    const url = etherscanAPIURL + "?module=" + module +
      "&action=" + action +
      "&address=" + address +
      "&startblock=" + startblock +
      "&endblock=" + endblock +
      "&page=" + page +
      "&offset=" + offset +
      "&count=" + count +
      "&sort=" + sort +
      "&apiKey=" + etherscanAPIKey;
    try {
      const result = await axios({
        method: "GET",
        url: url
      })
      return result
    } catch(e) {
      console.error("Error in getTransactions ", e);
      console.log(e)
      return e
    }
  } else {
    const module = "account"
    const action = "tokentx"
    const contractAddress = account.address
    const address = wallet.address
    const startblock = 0
    const endblock = 99999999
    const page = 1
    const count = 10
    const sort = "desc"
    const url = etherscanAPIURL + "?module=" + module +
      "&action=" + action +
      "&contractaddress=" + contractAddress +
      "&address=" + address +
      "&startblock=" + startblock +
      "&endblock=" + endblock +
      "&page=" + page +
      "&offset=" + offset +
      "&count=" + count +
      "&sort=" + sort +
      "&apiKey=" + etherscanAPIKey;
    try {
      const result = await axios({
        method: "GET",
        url: url
      })
      return result
    } catch(e) {
      console.error("Error in getTransactions ", e);
      console.log(e)
      return e
    }
  }
}


export {
  getTransactions,
}
