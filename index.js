const autocompleteConfig = {
    renderOption(coin) {
        return `
            ${coin.name} (${coin.rank})
        `;
    },
    inputValue(coin) {
        return coin.name;
    },
    async fetchData(searchTerm) {
        const response = await axios.get('https://api.coinpaprika.com/v1/coins', {
            params: {
                // apikey: apikey,
                // s: searchTerm
                // i: 'tt0118661'
            }
        })

        // if the response from API is an error
        // then return an empty array 
        if (!response.data) {
            return [];
        }
        return response.data;
    },
    onOptionSelect(coin) {
        document.querySelector('.tutorial').classList.add('is-hidden'); //'is-hidden' class is from bulma CSS framework - it is a class that hides element
        // onMovieSelect(movie, document.querySelector('#left-summary'), 'left'); // This function call makes another request to omdb API
        onCoinSelect(coin.id, document.querySelector('#coin-summary'));
    },
    filterItems(coin, searchTerm) {
        // Coin object from coinpaprika API has a 'is_active' property - we will filter inactive coins out.
        if (coin.is_active) {
            searchTerm = searchTerm.toLowerCase();
            const coinName = coin.name.toLowerCase();
            const coinSymbol = coin.symbol.toLowerCase();
            // return coinName === searchTerm || coinSymbol === searchTerm;
            return coinName === searchTerm || coinSymbol === searchTerm || coinName.startsWith(searchTerm) || coinSymbol.startsWith(searchTerm);    
        }
    }
}

// We call 'createAutoComplete' and pass in a different 'config' object
createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('.autocomplete'),
});

const onCoinSelect = async (coinID, summaryElement) => {
    const coin = await axios.get(`https://api.coinpaprika.com/v1/coins/${coinID}`);
    console.log(coin);

    // TODO: Get price data
        // const currentTime = new Date().toISOString();

        // new Date().getTime() returns UNIX time in milliseconds
        // We divide by 1000 because coinPaprika API takes UNIX time in seconds
        // We subtract 300 (milliseconds) which is 5 minutes because the coinPaprika API only
        // has price data in 5 minute increments
        const fiveMinutes = 300;
        const currentTime = parseInt(new Date().getTime() / 1000) - fiveMinutes;
        console.log(currentTime);
        const coinPrice = await axios.get(`https://api.coinpaprika.com/v1/tickers/${coinID}/historical?start=${currentTime}`);
        // const coinPrice = await axios.get(`https://api.coinpaprika.com/v1/tickers/${coinID}/historical?start=2020-10-24`);
        console.log('coinPrice data object: ', coinPrice.data);
        console.log(coinPrice.data[0].price);

        // promise.all
            //https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
            
    summaryElement.innerHTML = coinTemplate(coin.data, coinPrice.data[0]);
}

const coinTemplate = (coinDetail, coinPriceData) => {
    return `    
    <article class ="notification is-primary">
        <p class="title">$${coinPriceData.price} USD</p>
        <p class="subtitle">Current Price</p>
    </article>
    <article class ="media">
        <div class="media-content">
            <div class="content">
                <h1>${coinDetail.name}</h1>
                <h4>Ticker Symbol: ${coinDetail.symbol}</h4>
                <p>${coinDetail.description}</p>
            </div>
        </div>
    </article>
        <article class ="notification is-primary">
        <p class="title">${coinDetail.development_status}</p>
        <p class="subtitle">Development Status</p>
    </article>

    `
}

async function fetchCoinList() {
    const response = await axios.get('https://api.coinpaprika.com/v1/coins', {
        params: {
            // apikey: apikey,
            // s: searchTerm
            // i: 'tt0118661'
        }
    })
    console.log('running');
    // if the response from API is an error
    // then return an empty array 
    if (!response.data) {
        return [];
    }
    console.log(response.data);
    return response.data;
}

async function fetchTopXCoins(coinIdx, topX) {
    const coinsList = await coinIdx();

    console.log('coinsList is: ', coinsList);
    for (let i = 0; i < topX; i++) {
        renderToUl(coinsList[i], i + 1);
    }    
}

function renderToUl(coinData, rank) {
    const parentUl = document.getElementById('top-10-cryptos');
    const newCoin = document.createElement('li');
    newCoin.innerHTML = `
    </article>
        <article class ="notification is-primary">
        <span>${rank}</span>
        <p class="title coin-container">${coinData.name}</p>
    </article>
    `
    parentUl.append(newCoin);
}

fetchTopXCoins(fetchCoinList, 10);