const deliveryPrice = 5; //TODO we dont know yet ?!

function addToCart(e) {
    e.preventDefault();


    let cart = document.getElementById('shoppingCartNav');
    cart.classList.toggle('toggleShake');

    console.log(tempData);
    let data = {

        description: tempData.description,
        image: tempData.image,
        price: tempData.price,
        newPrice: tempData.newPrice ? tempData.newPrice : tempData.price,
        productId: tempData.productId,
        title: tempData.title,
        isOffer: tempData.isOffer,
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

function showCartAdressInfo(e) {
    e.preventDefault();
    e.target.textContent = e.target.textContent == '- скрий' ? '+ добави' : '- скрий';

    let categoryDropDown = document.getElementById('cartInfoAddressContainer');
    categoryDropDown.style.display = categoryDropDown.style.display == 'none' ?
        'block' : 'none';


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
    productPriceElement.innerText = newProductPrice.toFixed(2) + 'лв';

    let subtotalElement = document.getElementsByClassName('cartInfoRight')[0];
    let sumElement = document.getElementsByClassName('cartInfoRight')[2];

    let newSubtotal = 0;

    let allPricesElements = document.getElementsByClassName('productPrice');

    [...allPricesElements].forEach(priceElement => {
        let price = priceElement.innerText.split('лв')[0];
        newSubtotal = Number(newSubtotal) + Number(price);
    })
    subtotalElement.innerText = newSubtotal.toFixed(2) + 'лв';
    if (newSubtotal < 100) {
        sumElement.innerText = (newSubtotal + deliveryPrice).toFixed(2) + 'лв';
        auth.addAnonymousUserProductsSum(Number(newSubtotal) + deliveryPrice);
    } else {
        console.log('asdasdasdasd')
        sumElement.innerText = (newSubtotal).toFixed(2) + 'лв';
        auth.addAnonymousUserProductsSum(Number(newSubtotal));
    }

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