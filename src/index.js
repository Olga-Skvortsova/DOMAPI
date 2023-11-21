const selectBlock = document.querySelector('.select-block');
const input = document.querySelector('.select-block__input');
const autocompete = document.querySelector('.select-block__autocompete');
const selectedBlock = document.querySelector('.selected-block');

const debounce = (fn, debounceTime) => {
    let timeot
    return function () {
        const fnCall = () => {
            fn.apply(this, arguments)
        }
        clearTimeout(timeot)
        timeot = setTimeout(fnCall, debounceTime)
    }
};

getPost = debounce(getPost, 500)

input.onkeyup = (userSearch) => {
    if (autocompete.children.length !== 0) {
        autocompete.innerHTML = ''
    }
    if (userSearch.target.value != '' && userSearch.target.value.trim() != '') {
        getPost(userSearch.target.value)
    }
}

function getPost (word) {
    return fetch(`https://api.github.com/search/repositories?q=${word}`, {
        headers: {
            "Accept": "application/json",
        }
    })
    .then(responce => responce.json())
    .then(posts => {
        resultOfSearch(posts)
    })
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