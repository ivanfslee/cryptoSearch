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
        searchTerm = searchTerm.toLowerCase();
        const coinName = coin.name.toLowerCase();
        const coinSymbol = coin.symbol.toLowerCase();
        return coinName === searchTerm || coinSymbol === searchTerm;
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
        // const coinPrice = await axios.get(`https://api.coinpaprika.com/v1/tickers/${coinID}/historical?start=${currentTime}`);
        // const coinPrice = await axios.get(`https://api.coinpaprika.com/v1/tickers/${coinID}/historical?start=2020-10-24`);
        // console.log(coinPrice);

        // promise.all
            //https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel
            
    summaryElement.innerHTML = coinTemplate(coin.data);
}

const coinTemplate = (coinDetail) => {
    return `    
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
