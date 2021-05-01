const deliveryPrice = 5; //TODO we dont know yet ?!

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

    let dropDownContant = document.getElementById('dropDownSettings');
    dropDownContant.style.display = dropDownContant.style.display == 'none' ?
        'block' : 'none';

}



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
                displayErrorMessage('The email is already taken!', 'registerForm');
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
                displayErrorMessage('The email or password is invalid !', 'loginForm');
                return;
            }
            navigate('/home');
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

function createForm(e) {
    e.preventDefault();

    let title = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let image = document.getElementById('imgUrl').value;
    let price = document.getElementById('price').value;
    let quantity = document.getElementById('quantity').value;
    let category = document.getElementById('selectCategory').value;
    let brand = document.getElementById('brand').value;



    /* if (title == '' || type == '' || quantity == '' || category == '' || description == '' || image == '' || price == '') {
        displayErrorMessage('You should fill all the fields !', 'createForm');
        return;
    }
    if (title.length > 20) {
        displayErrorMessage('The title SHOULD be no more than 20 letters!', 'createForm');
        return
    } */

    auth.create(title, category, description, image, price, quantity, brand)
        .then(res => {

            navigate('/home');
        })


}

function editForm(e) {
    e.preventDefault();

    let title = document.getElementById('nameEdit').value;
    let description = document.getElementById('descriptionEdit').value;
    let image = document.getElementById('imgUrlEdit').value;
    let price = document.getElementById('priceEdit').value;
    let quantity = document.getElementById('quantityEdit').value;
    let category = document.getElementById('selectCategoryEdit').value;
    let brand = document.getElementById('brandEdit').value;


    /*  if (title == '' || type == '' || quantity == '' || category == '' || description == '' || image == '' || price == '') {
         displayErrorMessage('You should fill all the fields !', 'editForm');
         return;
     }
     if (title.length > 20) {
         displayErrorMessage('The title SHOULD be no more than 20 letters!', 'editForm');
         return
     } */
    let id = getCurrUrlId();
    auth.edit(title, category, description, image, price, quantity, brand, id)
        .then(res => {

            navigate(`/details/${id}`);
        })


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

function addToCart(e) {
    e.preventDefault();


    let cart = document.getElementById('shoppingCartNav');
    cart.classList.toggle('toggleShake');

    let data = {

        description: tempData.description,
        image: tempData.image,
        price: tempData.price,
        productId: tempData.productId,
        title: tempData.title,
        productPath: window.location.href
    }
    var prod = [];
    prod = JSON.parse(localStorage.getItem('buys')) || [];

    let isAlreadyAdded = false;
    if (prod.length > 0 && prod) {
        Object.values(prod).forEach(el => {
            if (el.productId == data.productId) {
                isAlreadyAdded = true;
                return;

            }
        })
        if (!isAlreadyAdded) {
            prod.push(data);
            localStorage.setItem('buys', JSON.stringify(prod));
        }


    } else {
        prod.push(data);
        localStorage.setItem('buys', JSON.stringify(prod));
    }
    localStorage.setItem('subtotal', getTheSubtotal())
    auth.addAnonymousUserProductsSum(Number(getTheSubtotal()) + deliveryPrice);
    setTimeout(function() {
        navigate('/kosmosShop')
    }, 2000)




}

function requestDelete(e) {
    e.preventDefault();

    let postId = e.target.parentNode.href.split('/')[4];

    auth.deleteProduct(postId).then(res => {
        navigate('/kosmosShop');
    })
}

function removeProductFromCart(e) {
    e.preventDefault();

    let productIdToRemove = e.target.href.split('/')[4];

    let localeStorageBuys = [...JSON.parse(localStorage.getItem('buys'))];


    let index = -1;
    Object.entries(localeStorageBuys).forEach(el => {
        index++;
        if (el[1].productId == productIdToRemove) {

            localeStorageBuys.splice(index, 1);
            localStorage.setItem('buys', JSON.stringify(localeStorageBuys));
            navigate('/cart')
        }
    })


    auth.addAnonymousUserProductsSum(Number(getTheSubtotal()) + deliveryPrice);
}




function giveAdmin(e) {

    e.preventDefault();
    let email = e.target.parentNode.href.split('/')[4];
    let id = e.target.parentNode.href.split('/')[5];

    auth.giveAdminRights(email, id).then(res => {
        navigate('/profile');
    })
}

function removeAdmin(e) {

    e.preventDefault();
    let email = e.target.parentNode.href.split('/')[4];
    let id = e.target.parentNode.href.split('/')[5];

    auth.removeAdminRights(email, id).then(res => {
        navigate('/profile');
    })
}



function showCategory(e) {
    e.preventDefault();

    let categoryDropDown = document.getElementById('categoryDropDown');
    categoryDropDown.style.display = categoryDropDown.style.display == 'none' ?
        'block' : 'none';

    let categoryIcon = document.getElementsByClassName('category')[0].parentNode;

    categoryIcon.classList.toggle('change');

}

function showCartAdressInfo(e) {
    e.preventDefault();
    e.target.textContent = e.target.textContent == '- скрий' ? '+ добави' : '- скрий';

    let categoryDropDown = document.getElementById('cartInfoAddressContainer');
    categoryDropDown.style.display = categoryDropDown.style.display == 'none' ?
        'block' : 'none';


}

function showAddCategory(e) {
    e.preventDefault();

    let containerToShow = document.getElementById("addCategoryContainer");
    containerToShow.style.display = containerToShow.style.display == "block" ? 'none' : 'block';

}

function addCategory(e) {
    e.preventDefault();
    let newCategoryName = document.getElementById('newCategoryName');
    if (!newCategoryName.value) {
        return;
    }
    let containerToShow = document.getElementById("addCategoryContainer");
    containerToShow.style.display = containerToShow.style.display == "block" ? 'none' : 'block';

    let categoryList = document.getElementById('selectCategory');
    let newCategory = document.createElement('option');
    newCategory.textContent = `${newCategoryName.value}`;
    newCategory.setAttribute("value", newCategoryName.value);

    categoryList.appendChild(newCategory);


    auth.addNewCategory(newCategoryName.value)
        .then(res => {
            if (res == 'Error') {
                displayErrorMessage('The email is already taken!', 'registerForm');

                return;
            }

        })
}


function getTheSubtotal() {
    let prodInCart = JSON.parse(localStorage.getItem('buys'));

    let subtotal = 0;
    if (prodInCart || prodInCart.length > 0) {
        Object.values(prodInCart)
            .forEach(product => {
                if (product) {
                    if (product.price) {
                        subtotal = subtotal + Number(product.price);
                    }
                }
            })

    }
    subtotal = subtotal.toFixed(2)
    if (Number(subtotal) < 0) {
        subtotal = 0;
    }




    return subtotal;

}

function changeProductQuantity(e, productPriceForOneQuantity) {
    e.preventDefault();
    if (e.target.tagName != 'BUTTON') {
        return;
    }
    let quantityContainer = e.target.parentNode;
    let quantityInput = quantityContainer.children[1].value;


    if (e.target.innerText == '+') {
        if (Number(quantityInput) < 100) {
            quantityContainer.children[1].value = Number(quantityInput) + 1;
            quantityInput = Number(quantityInput) + 1;

        }
    } else if (e.target.innerText == '-') {
        if (Number(quantityInput) > 1) {
            quantityContainer.children[1].value = Number(quantityInput) - 1;
            quantityInput = Number(quantityInput) - 1;
        }
    }
    var event = new Event('input');
    quantityContainer.children[1].dispatchEvent(event);

}

function addToPrice(e, productPriceForOneQuantity) {
    e.preventDefault();
    let productPriceElement = e.target.parentNode.parentNode.children[3];
    let quantityInput = e.target.value;
    let newProductPrice = 0;

    newProductPrice = Number(productPriceForOneQuantity) * Number(quantityInput);
    productPriceElement.innerText = newProductPrice + 'лв';

    let subtotalElement = document.getElementsByClassName('cartInfoRight')[0];
    let sumElement = document.getElementsByClassName('cartInfoRight')[2];

    let newSubtotal = 0;

    let allPricesElements = document.getElementsByClassName('productPrice');

    [...allPricesElements].forEach(priceElement => {
        let price = priceElement.innerText.split('лв')[0];
        newSubtotal = Number(newSubtotal) + Number(price);
    })
    subtotalElement.innerText = newSubtotal + 'лв';
    sumElement.innerText = newSubtotal + deliveryPrice + 'лв';

    auth.addAnonymousUserProductsSum(Number(newSubtotal) + deliveryPrice);

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


function productsByCategory(e) {
    e.preventDefault();

    if (e.target.tagName != "A") {
        return
    }
    let categoryValue = e.target.innerText;

    navigate(`/category/${categoryValue}`)

}

async function buyTheCart(e) {
    e.preventDefault();

    let addressForm = document.getElementById('cartInfoAddressContainer').children[0];

    const addressData = new FormData(addressForm);

    const personName = addressData.get('personName');
    const province = addressData.get('province');
    const address = addressData.get('address');
    const phoneNumber = addressData.get('phoneNumber');

    if (!personName || !province || !address || !phoneNumber) {
        console.log('you should field all!');
        /*  return; */
    }

    let cartProductsTable = document.getElementById('cartProductsContainer').children[0].children[0].children;

    let products = [];

    Object.values(cartProductsTable).forEach(el => {
        let productName = el.getElementsByClassName('textInfo')[0].children[0].innerText;
        let productQuantity = el.getElementsByClassName('quantityInput')[0].value;
        let productPrice = el.getElementsByClassName('productPrice')[0].innerText;

        products.push(`Име на продукт: ${productName} Количество: ${productQuantity} Цена: ${productPrice}`);
    });

    let subtotal = document.getElementsByClassName('cartInfoRight')[0].innerText.split('лв')[0];
    let sumWithDelivery = document.getElementsByClassName('cartInfoRight')[2].innerText.split('лв')[0];

    let productsAsString = products.join('\n');
    console.log(productsAsString);
    console.log(products);
    let allInfo = {
        names: personName,
        province,
        address,
        phoneNumber,
        productsAsString,
        subtotal,
        sumWithDelivery
    }
    let realPrice = await auth.getAnonymousUserProductsSum()

    if (realPrice.sum == sumWithDelivery && realPrice.sum == Number(subtotal) + 5) {


        emailjs.send('service_kvtqhbs', 'template_b3v0wxs', allInfo)
            .then(function(response) {
                let container = document.getElementById('cartContainer');

                container.innerHTML = '<h1 style="color:#0441d5">ГОТОВО</h1>'

            }, function(error) {
                console.log('FAILED...', error);
            });

    } else {
        navigate('/cart')
    }
    console.log(allInfo);




}

window.onbeforeunload = function() {
    let uid = JSON.parse(localStorage.getItem('userToken'));

    localStorage.removeItem('userToken')
};


function registerSessionId() {
    auth.registerAnonymousUser()
}

registerSessionId();
registerPartial();