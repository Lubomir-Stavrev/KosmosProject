function registerForm(e) {
    e.preventDefault();

    let email = document.getElementById('register-Email');
    let password = document.getElementById('register-Password');
    let rePassword = document.getElementById('register-RePassword');

    if (password.value != rePassword.value) {
        displayErrorMessage('The passwords must be the same!', 'registerForm');
        password.value = '';
        rePassword.value = '';
        return;
    }
    if (password.value.length < 6) {
        displayErrorMessage('The password must be at least 6 symbols!', 'registerForm');
        return;
    }
    auth.register(email.value, password.value)
        .then(res => {
            if (res == 'Error') {
                displayErrorMessage('Имейлът вече е зает!', 'registerForm');
                return;
            }
            navigate('/login');
        })
}

function loginForm(e) {
    e.preventDefault();

    let email = document.getElementById('login-Email');
    let password = document.getElementById('login-Password');



    auth.login(email.value, password.value)
        .then(res => {
            if (res == 'Error') {
                console.log(res)
                displayErrorMessage('Имейлът или паролата са невалидни !', 'loginForm');
                return;
            }
            navigate('/home');
        })


}

function createForm(e) {
    e.preventDefault();

    let title = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let image = document.getElementById('imgUrl').value;
    let price = document.getElementById('price').value;
    let quantity = document.getElementById('quantity').value;
    let category = document.getElementById('selectCategory').value;
    let subcategory = document.getElementById('selectSubcategory').value;
    let brand = document.getElementById('brand').value;


    if (price.includes(',')) {
        price = price.replace(/,/g, '.')

    }

    if (title == '' || description == '' || image == '' || price == '' || quantity == '' ||
        category == '' ||
        brand == '') {
        displayErrorMessage('Трябва да попълните всияки поленца !', 'createForm');
        return;
    }
    if (title.length > 50) {
        displayErrorMessage('Името не трябва да е повече от 50 букви!', 'createForm');
        return
    }
    auth.addSubcategoryToCategory(category, subcategory)
    auth.create(title, category, subcategory, description, image, price, quantity, brand)
        .then(res => {
            let productId = res.name
            navigate(`/details/${productId}`);
        })


}

function editForm(e) {
    e.preventDefault();

    let title = document.getElementById('nameEdit').value;
    let description = document.getElementById('descriptionEdit').value;
    let image = document.getElementById('imgUrlEdit').value;
    let price = document.getElementById('priceEdit').value;
    let quantity = document.getElementById('quantityEdit');
    let category = document.getElementById('selectCategoryEdit');
    let subcategory = document.getElementById('selectSubcategoryEdit');
    console.log(subcategory.options[subcategory.selectedIndex].text)
    console.log(category.options[category.selectedIndex].text)
    console.log(document.getElementById('selectCategoryEdit'))
    let brand = document.getElementById('brandEdit').value;


    if (price.includes(',')) {
        price = price.replace(/,/g, '.')
    }

    if (title == '' || description == '' || image == '' || category.value == '' || price == '') {
        displayErrorMessage('Трябва да попълните всички поленца !', 'editForm');
        return;
    }
    if (title.length > 50) {
        displayErrorMessage('Името не трябва да е повече от 50 букви !', 'editForm');
        return
    }
    let id = getCurrUrlId();
    auth.addSubcategoryToCategory(category.value, subcategory.value)
    auth.edit(title, category.value, subcategory.value, description, image, price, quantity, brand, id)
        .then(res => {

            navigate(`/details/${id}`);
        })


}

function postComment(e) {
    e.preventDefault();

    let comment = document.getElementById('comment-Area');
    let postId = e.target.parentNode.href.split('/')[4];

    if (comment.value == '' || comment.value == null || !comment.value.trim()) {
        return;
    }
    auth.sendComment(postId, comment.value)
        .then(res => {

            comment.value = '';
            navigate(`/details/${postId}`, 'block');

        })
}

function sendLike(e) {
    e.preventDefault();

    let likeId = e.target.parentNode.parentNode.href.split('/')[4];

    auth.postLike(likeId)
        .then(res => {

            navigate(`/details/${likeId}`)
        })
}

function sendUnlike(e) {
    e.preventDefault();

    let postId = e.target.parentNode.parentNode.href.split('/')[4];

    auth.postUnlike(postId)
        .then(res => {

            navigate(`/details/${postId}`)
        })
}

function sendContact(e) {
    e.preventDefault();

    const data = new FormData(e.target);

    const names = data.get('name');
    const email = data.get('email');
    const comment = document.getElementById('message').value;

    if (!names || !email || !comment) {
        return;
    }

    let allInfo = {
        names,
        email,
        comment
    }
    emailjs.send('service_kvtqhbs', 'template_tpywy1d', allInfo)
        .then(function(response) {
            navigate('/kosmosShop');

        }, function(error) {
            console.log('FAILED...', error);
            return;
        });

}

function requestDelete(e) {
    e.preventDefault();

    let postId = e.target.parentNode.href.split('/')[4];

    auth.deleteProduct(postId).then(res => {
        navigate('/kosmosShop');
    })
}