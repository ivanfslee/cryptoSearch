const fetchCoinList = async () => {
    const coins = await axios.get('https://api.coinpaprika.com/v1/coins');
    return coins.data;
}

const fetchCoin = async (coinID) => {
    const coin = await axios.get(`https://api.coinpaprika.com/v1/coins/${coinID}`);
    return coin;
}

const addCoinURL = (url, coinName, coinID) => {
    const ul = document.querySelector('ul');
    const newLi = document.createElement('li');
    const anchorTag = document.createElement('a');
    anchorTag.innerHTML = 
        `<a href="${url}">${coinName}</a>
        <a target="_blank" href="https://coinpaprika.com/coin/${coinID}">Coin Paprika Link</a>`
    newLi.append(anchorTag);
    ul.append(newLi);
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <input class="search-input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

const input = document.querySelector('.search-input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

let timeoutID;
let coinsList;

input.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(async () => {

        //Get coin list, if coinsList not defined (saves us an additional HTML request)
        if (!coinsList) {
            coinsList = await fetchCoinList()
            // TODO - error handling of fetchCoinList() call
                // .then((res) => {
                //     coinsList = res;
                // })
                // .catch((err) => {
                //     console.log(err);
                // });
        }
        
        dropdown.classList.remove('is-active');
        resultsWrapper.innerHTML = '';
        //Iterate through coin list and find match to search term
        //If there is a match, then make another API call with coin_id
        for (let coin of coinsList) {
            const coinName = coin.name.toLowerCase();
            const coinSymbol = coin.symbol.toLowerCase();
            if (coinName === searchTerm || coinSymbol === searchTerm) {
                dropdown.classList.add('is-active');

                console.log(coin.id);

                let singleCoin = await fetchCoin(coin.id);
                // TODO - error handling of fetchCoin() call
                    // .then((res) => {
                    //     console.log(res);
                    //     console.log(res.config.url);
                    //     addCoinURL(res.config.url, res.data.name);
                    // })
                    // .catch((err) => {
                    //     console.log(err);
                    // });

                const option = document.createElement('a');
                option.href = `https://coinpaprika.com/coin/${coin.id}`
                option.target = '_blank';
                option.classList.add('dropdown-item');
                option.innerHTML = `
                    ${singleCoin.data.name}
                    (${singleCoin.data.rank});
                `;

                console.log('Single Coin data: ', singleCoin.data);
                // When coin in dropdown is clicked, it will
                // replace the input string with the coin name
                // and hide the dropdown
                option.addEventListener('click', () => {
                    input.value = singleCoin.data.name;
                    dropdown.classList.remove('is-active');
                })

                resultsWrapper.appendChild(option);
                // addCoinURL(singleCoin.config.url, singleCoin.data.name, coin.id);
            }
        }
    }, 1000);
})

// Hides dropdown if user clicks anywhere not part of the dropdown
document.addEventListener('click', event => {
    console.log(event.target);
    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

//Documentation for bulma dropdown 
    //https://bulma.io/documentation/components/dropdown/