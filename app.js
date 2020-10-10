const fetchCoinList = async () => {
    const coins = await axios.get('https://api.coinpaprika.com/v1/coins');
    return coins.data;
}

const fetchCoin = async (coinID) => {
    const coin = await axios.get(`https://api.coinpaprika.com/v1/coins/${coinID}`);
    return coin;
}

const input = document.querySelector('.search-input');

const addCoinURL = (url, coinName) => {
    const ul = document.querySelector('ul');
    const newLi = document.createElement('li');
    const anchorTag = document.createElement('a');
    anchorTag.innerText = coinName;
    anchorTag.href = url;
    newLi.append(anchorTag);
    ul.append(newLi);    
}

let timeoutID;
let coinsList;

input.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(async () => {

        //Get coin list
        await fetchCoinList()
            .then((res) => {
                coinsList = res;
            })
            .catch((err) => {
                console.log(err);
            });
        
        //Iterate through coin list and find match to search term
        //If there is a match, then make another API call with coin_id
        for (let coin of coinsList) {
            const coinName = coin.name.toLowerCase();
            const coinSymbol = coin.symbol.toLowerCase();
            if (coinName === searchTerm || coinSymbol === searchTerm) {
                console.log(coin.id);
                
                await fetchCoin(coin.id)
                    .then((res) => {
                        console.log(res);
                        console.log(res.config.url);
                        addCoinURL(res.config.url, res.data.name);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }, 1000);
})