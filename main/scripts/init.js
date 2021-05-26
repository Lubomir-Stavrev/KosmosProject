function registerPartial() {

    let header = document.getElementById('headerTemp').innerHTML;
    let footer = document.getElementById('footerTemp').innerHTML;

    Handlebars.registerPartial('header', header);
    Handlebars.registerPartial('footer', footer);
}

function navigateHandler(e) {
    e.preventDefault();


    if (e.target.tagName == 'BUTTON' || e.target.tagName == 'LI' ||
        e.target.tagName == 'SPAN' ||
        e.target.tagName == 'IMG') {
        let url = new URL(e.target.parentNode.href);
        navigate(url.pathname);
    }
    if (e.target.parentNode.parentNode.tagName == 'A') {
        let url = new URL(e.target.parentNode.parentNode.href);
        navigate(url.pathname);
    }
    if (e.target.tagName == 'A') {
        let url = new URL(e.target.href);
        navigate(url.pathname);
    }
    return;
}

function getCurrUrlId() {

    let id = window.location.pathname.split('/')[2];

    return id;
}

function changeColorOnHover(e) {
    e.preventDefault();
    let row = [...document.getElementsByTagName('tr')];

    row.forEach(r => {
        r.addEventListener('mouseover', event => {


        })
    })

}

function activateMenu(x) {
    x.classList.toggle("change");

    let dropDownContant = document.getElementById('dropDownContant');
    dropDownContant.style.display = dropDownContant.style.display == 'none' ?
        'block' : 'none';

}

function activateSettingsMenu(x) {

    let dropDownContant = document.getElementsByClassName('dropDownSettings');
    [...dropDownContant].forEach(el => {
        el.style.display = el.style.display == 'none' ?
            'block' : 'none';

    })

}

function displayErrorMessage(message, formId) {

    let p = document.createElement('p');
    p.setAttribute('id', 'errorBox')
    p.textContent = message;
    let form = document.getElementById(formId);

    form.insertBefore(p, form.firstChild);

    setTimeout(function() {
        form.removeChild(p);
    }, 4000)
}


function showCommentSection(e) {
    if (e) {

        e.preventDefault();
    }

    let commentSection = document.getElementById('comment-Container');

    if (commentSection.style.display == 'block') {
        e.target.textContent = 'See Comments'
        commentSection.style.display = 'none'
    } else {
        e.target.textContent = 'Hide Comments'
        commentSection.style.display = 'block'
        window.scrollTo(0, document.body.scrollHeight);
    }
}


function scrollToEnd(e) {
    e.preventDefault();

    document.getElementById('comment-Section').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function showCategory(e) {
    e.preventDefault();

    let categoryDropDown = document.getElementById('categoryDropDown');
    categoryDropDown.style.display = categoryDropDown.style.display == 'none' ?
        'block' : 'none';

    let categoryIcon = document.getElementsByClassName('category')[0].parentNode;

    categoryIcon.classList.toggle('change');

}


function searchProducts(e) {
    e.preventDefault();
    let inputElement = '';
    if (e.target.tagName == "IMG") {
        inputElement = e.target.parentNode.parentNode.children[0];
    } else if (e.target.tagName == "BUTTON") {
        inputElement = e.target.parentNode.children[0];
    }
    let searchValue = inputElement.value;

    if (!searchValue) {
        navigate(`/kosmosShop`)
        return;
    }
    navigate(`/kosmosShop/${searchValue}`)

}

window.onbeforeunload = function() {
    let uid = JSON.parse(localStorage.getItem('userToken'));

    localStorage.removeItem('userToken')
};


function registerSessionId() {
    auth.registerAnonymousUser()
}


function showRemoveList(e) {
    e.preventDefault();

    let removeList = document.getElementById('removeList');

    removeList.style.display = removeList.style.display == 'block' ? 'none' : 'block'
    e.target.innerText = e.target.innerText == 'Цъкнете категорията която искате да премахнете' ? 'премахни категория' : 'Цъкнете категорията която искате да премахнете';
}


function makeSelected(e) {
    e.preventDefault();
    console.log('asdasd')
}

registerSessionId();
registerPartial();