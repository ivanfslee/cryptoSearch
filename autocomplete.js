// Config is an object that configures the autocomplete for a particular use case
// createAutoComplete takes a 'config' object that contains a bunch of properties
// One of those properties is 'root'
// We will pass in 'Config' into our 'createAutoComplete' function
// We will destructure 'root' from within 'Config'
// That is to say, inside our 'Config' object will be a 'root' property
const createAutoComplete = ({ 
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData,
    filterItems
    }) => {
    root.innerHTML = `
        <label><b> Search </b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;
    
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');
    
    const onInput = async event => {
        const items = await fetchData(event.target.value);
    
        // If there are no items, then clear the dropdown
        if (!items.length) {
            dropdown.classList.remove('is-active');
            return; // We return out of this function and dont run the code below
        }
    
        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');

        // filterindex goes here to iterate through 'items'

        for (let item of items) {
            if (filterItems(item, event.target.value)) {
                console.log(item);
                const option = document.createElement('a');
    
                option.classList.add('dropdown-item');
                option.innerHTML = renderOption(item);
        
                // When a item in the dropdown is clicked, it 
                // will replace the input with the item's exact title
                // and hide the dropdown
                option.addEventListener('click', event => {
                    input.value = inputValue(item);
                    dropdown.classList.remove('is-active');
                    onOptionSelect(item);
                });
                resultsWrapper.appendChild(option);
            }
        }
    };
    
    input.addEventListener('input', debounce(onInput, 500));
    
    //Hides the search dropdown menu is you click anywhere outside of dropdown menu
    document.addEventListener('click', event => {
        if (!root.contains(event.target)) { //if root doesn't contain the element you clicked on
            dropdown.classList.remove('is-active'); //then hide the dropdown by removing 'is-active' class
        }
    })
};