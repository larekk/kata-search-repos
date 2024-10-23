const container = document.createElement("div");
const inputWrapper = document.createElement('div');
const inputSearch = document.createElement('input');
const resultsWrapper = document.createElement('div');
container.classList.add("container");
inputWrapper.classList.add("input--wrapper");
inputSearch.classList.add("inputSearch");
inputSearch.setAttribute("type", "text");
inputSearch.setAttribute("placeholder", "Репозиторий");
resultsWrapper.classList.add("results__wrapper");
inputWrapper.appendChild(inputSearch);
container.appendChild(inputWrapper);
container.appendChild(resultsWrapper);
document.body.insertAdjacentElement("afterbegin", container);

async function getRepos(url){
    return await fetch(url)
        .then(res => {
            if (res.ok) return res.json();
        })
        .then(({items}) => items.slice(0, 5))
        .catch(err => console.log(err))
}

function debounce (fn, debounceTime){
    let time;

    return function () {
        clearTimeout(time)
        time = setTimeout(() => fn.apply(this, arguments), debounceTime)
    };
}

function createComplit(arr, menu){
    const fragment = document.createDocumentFragment();
    menu.classList.add('complitMenu');
    arr.forEach(repo => {
        const complitItem = document.createElement('div');
        complitItem.classList.add("complitItem");
        complitItem.textContent = repo.name;
        complitItem.dataset.owner = repo.owner.login;
        complitItem.dataset.stars = repo.stargazers_count;
        fragment.appendChild(complitItem);
    })
    menu.appendChild(fragment);
    inputWrapper.appendChild(menu);
}

function searchRepos(){
    inputSearch.addEventListener('keyup', debounce(
        async () => {
            if (inputSearch.value === '') {
                document.querySelector('.complitMenu').remove();
                return;
            }
            let r = await getRepos(`https://api.github.com/search/repositories?q=${inputSearch.value}`)
            if (document.querySelector('.complitMenu')) document.querySelector('.complitMenu').remove();
            const complitMenu = document.createElement('div');
            complitMenu.addEventListener('click', e => {
                const item = e.target;
                resultsWrapper.innerHTML += `<div class="resultsItem">
                                            <div class="resultsInfo">
                                                <span class="results resultsName">Name: ${item.textContent}</span>
                                                <span class="results resultsOwner">Owner: ${item.dataset.owner}</span>
                                                <span class="results resultsStars">Stars: ${item.dataset.stars}</span>
                                            </div>
                                            <div class="resultsDelete" onclick="parentElement.remove()"></div>
                                        </div>`;
                inputSearch.value = '';
                document.querySelector('.complitMenu').remove();
            })
            createComplit(r, complitMenu);
        }, 500))
}

searchRepos();




