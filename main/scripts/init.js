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

    let dropDownContant = document.getElementsByClassName('dropDownSettings');
    [...dropDownContant].forEach(el => {
        el.style.display = el.style.display == 'none' ?
            'block' : 'none';

    })

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
    let quantity = document.getElementById('quantityEdit').value;
    let category = document.getElementById('selectCategoryEdit').value;
    let subcategory = document.getElementById('selectCategoryEdit').value;

    let brand = document.getElementById('brandEdit').value;


    if (price.includes(',')) {
        price = price.replace(/,/g, '.')
    }

    if (title == '' || description == '' || image == '' || category == '' || price == '') {
        displayErrorMessage('Трябва да попълните всички поленца !', 'editForm');
        return;
    }
    if (title.length > 50) {
        displayErrorMessage('Името не трябва да е повече от 50 букви !', 'editForm');
        return
    }
    let id = getCurrUrlId();
    auth.addSubcategoryToCategory(category, subcategory)
    auth.edit(title, category, subcategory, description, image, price, quantity, brand, id)
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

function addCategory(e) {
    e.preventDefault();
    let newCategoryName = document.querySelector('#addCategoryContainer input');
    if (!newCategoryName.value) {
        return;
    }





    auth.addNewCategory(newCategoryName.value)
        .then(res => {
            navigate('/categories')
            if (res == 'Error') {
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
        let buttonBuy = document.getElementsByClassName('buyCartButton')[0];

        let buyForm = document.getElementById('cartInfoAddressContainer');
        buyForm.style.display = 'block'
        let inputs = buyForm.querySelector('form').getElementsByTagName("input");
        Object.values(inputs).forEach(el => {
            if (!el.value || !el.innerText) {
                el.style.borderColor = '#F0706A'
            }
        })

        buttonBuy.style.color = '#F0706A'
        buttonBuy.style.borderColor = '#F0706A'
        setTimeout(function() {
            buttonBuy.style.color = '#00308F'
            buttonBuy.style.borderColor = '#00308F'
        }, 1000)

        return;
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
                auth.removeAnonymousUserProductsSum();
                localStorage.removeItem('buys');
                let container = document.getElementById('cartContainer');
                container.innerHTML = '<h1 style="color:#0441d5">ГОТОВО</h1>'
                setTimeout(function() {
                    navigate('/kosmosShop')
                }, 3000)

            }, function(error) {
                console.log('FAILED...', error);
            });

    } else {
        navigate('/cart')
    }





}

window.onbeforeunload = function() {
    let uid = JSON.parse(localStorage.getItem('userToken'));

    localStorage.removeItem('userToken')
};


function registerSessionId() {
    auth.registerAnonymousUser()
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

function showRemoveList(e) {
    e.preventDefault();

    let removeList = document.getElementById('removeList');

    removeList.style.display = removeList.style.display == 'block' ? 'none' : 'block'
    e.target.innerText = e.target.innerText == 'Цъкнете категорията която искате да премахнете' ? 'премахни категория' : 'Цъкнете категорията която искате да премахнете';
}

function removeCategoryName(e) {
    e.preventDefault();
    let categoryNameId = e.target.id;


    auth.removeCategoryName(categoryNameId).then(res => {
        navigate('/categories');
    })
}

function searchCategories(e) {
    e.preventDefault();
    let inputElement = '';
    if (e.target.tagName == "IMG") {
        inputElement = e.target.parentNode.parentNode.children[0];
    } else if (e.target.tagName == "BUTTON") {
        inputElement = e.target.parentNode.children[0];
    }
    let searchValue = inputElement.value;



    let table = document.querySelector('#categoryTable table tbody').children;

    [...table].forEach(ch => {
        let currChName = ch.children[0].innerText;
        ch.style.display = 'none';
        if (currChName.toLowerCase().includes(searchValue.toLowerCase())) {
            ch.style.display = 'block';

        }

    })



}

function showCategorieNames(e, option, isEdit) {
    e.preventDefault();
    let category = '';
    let searchValue = e.target.parentNode.children[0].value;

    if (isEdit) {
        if (option == 'category') {
            category = document.querySelectorAll('#selectCategoryEdit option');

        } else if (option == 'subcategory') {
            category = document.querySelectorAll('#selectSubcategoryEdit option');
        }
    } else {
        if (option == 'category') {
            category = document.querySelectorAll('#selectCategory option');

        } else if (option == 'subcategory') {
            category = document.querySelectorAll('#selectSubcategory option');
        }

    }
    [...category].forEach(ch => {
        let currChName = ch.value;

        ch.style.display = 'none';
        if (currChName.toLowerCase().includes(searchValue.toLowerCase())) {
            ch.style.display = 'block';

        }

    })
}

function showSubCategoryContiner(e) {
    e.preventDefault();
    let subcategory = e.target.parentNode.children[1];

    subcategory.style.display = subcategory.style.display == 'block' ? 'none' : 'block';
}




registerSessionId();
registerPartial();