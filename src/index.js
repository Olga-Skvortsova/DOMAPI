const selectBlock = document.querySelector('.select-block');
const input = document.querySelector('.select-block__input');
const autocompete = document.querySelector('.select-block__autocompete');
const selectedBlock = document.querySelector('.selected-block');

let controller = new AbortController();

const debounce = (fn, debounceTime) => {
    let timeout;
    return function () {
        const fnCall = () => {
            fn.apply(this, arguments);
        };
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, debounceTime);
    };
};

getPost = debounce(getPost, 500);

input.addEventListener('input', (userSearch) => {
    controller.abort();
    controller = new AbortController();

    if (autocompete.children.length !== 0) {
        autocompete.innerHTML = '';
    }

    const inputValue = userSearch.target.value.trim();
    if (/^[a-zA-Zа-яА-Я0-9\s\W]+$/.test(inputValue)) {
        getPost(inputValue, controller);
    }
});


function getPost(word, controller) {
    return fetch(`https://api.github.com/search/repositories?q=${word}`, {
        headers: {
            'Accept': 'application/json',
        },
        signal: controller.signal,
    })
        .then((response) => response.json())
        .then((posts) => {
            resultOfSearch(posts);
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                console.log('Request aborted');
            } else {
                console.error('Error:', error);
            }
        });
}

function resultOfSearch(massive) {
    let items = massive.items;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i <= 5; i++) {
        const li = document.createElement('li');
        li.classList.add('select-block__li');

        const title = document.createElement('h5');
        title.textContent = items[i].name;

        li.appendChild(title);
        fragment.appendChild(li);
        
        li.addEventListener('click', () => addToChosenList(items[i]))
    }
    autocompete.appendChild(fragment)
}

function addToChosenList(items) {
    input.value = ''; 
    if (autocompete.children.length !== 0) {
        autocompete.innerHTML = ''
    }

    const divChosen = document.createElement('div');
    divChosen.classList.add('selected-block__item');

    const divCross = document.createElement('div');
    divCross.textContent = '✕';
    divCross.classList.add('selected-block__cross');
    divChosen.appendChild(divCross);

    const divChosenP1 = document.createElement('p');
    divChosenP1.textContent = `Name: ${items.name}`;
    divChosen.appendChild(divChosenP1);

    const divChosenP2 = document.createElement('p');
    divChosenP2.textContent = `Owner: ${items.owner.login}`;
    divChosen.appendChild(divChosenP2);

    const divChosenP3 = document.createElement('p');
    divChosenP3.textContent = `Stars: ${items.stargazers_count}`;
    divChosen.appendChild(divChosenP3);

    selectedBlock.appendChild(divChosen);

    divCross.addEventListener('click', () => divChosen.remove())
}