const appElement = document.getElementById('app');



const routs = {
    'home': '../templates/homePage.hbs',
    'kosmosShop': '../templates/shop/shop.hbs',
    'details': '../templates/detailsPage/details.hbs',
    'login': '../templates/auth/login.hbs',
    'register': '../templates/auth/register.hbs',
    'create': '../templates/auth/createProduct.hbs',
    'edit': '../templates/auth/editProduct.hbs',
    'cart': '../templates/shop/shoppingCart.hbs',
    'edit': '../templates/editPage/edit.hbs',
    'contacts': '../templates/contactPages/contacts.hbs',
    'errorPage': '../templates/errorPage/404.hbs',
    'categories': '../templates/auth/categories.hbs',
}

async function router(path, condition) {
    let tempData = await auth.getUserData();
    globalThis.tempData = tempData;

    switch (path) {
        case 'logout':
            auth.logout();
            navigate('/kosmosShop');
            return;
        case 'kosmosShop':
            let productsData = await auth.getAllProducts();
            let categoryDataHome = await auth.getCategoryNames();
            tempData.categories = categoryDataHome;
            tempData.products = productsData.all;
            break;
        case 'create':
            let categoryData = await auth.getCategoryNames();


            tempData.categories = categoryData;
            break;
        case 'categories':
            let categoriesData = await auth.getCategoryNames();


            tempData.categories = categoriesData;
            break;
        case 'cart':
            const deliveryPrice = 5;
            let prodInCart = JSON.parse(localStorage.getItem('buys'));

            let currSubtotal = 0;
            if (prodInCart) {
                Object.values(prodInCart)
                    .forEach(product => {
                        if (product) {
                            if (product.price) {
                                currSubtotal = parseFloat(currSubtotal) + parseFloat(product.price);
                            }
                        }
                    })

            }
            currSubtotal = currSubtotal.toFixed(2)
            if (parseFloat(currSubtotal) < 0) {
                currSubtotal = 0;
            }
            tempData.subtotal = parseFloat(currSubtotal);
            tempData.sumWithDelivery = parseFloat(currSubtotal) + deliveryPrice;
            auth.addAnonymousUserProductsSum(parseFloat(currSubtotal) + deliveryPrice)
            break;
    }

    if (path.includes('details/')) {
        let id = path.split('/')[1];
        let data = await auth.getDetails(id);

        Object.assign(tempData, data);
        path = 'details';
    } else if (path.includes('edit/')) {
        let categoryData = await auth.getCategoryNames();

        tempData.categories = categoryData;
        let id = path.split('/')[1];
        let data = await auth.getDetails(id);

        Object.assign(tempData, data);
        path = 'edit';
    } else if (path.includes('profile')) {
        tempData.users = await auth.getAllRegisteredUsers();
    } else if (path.includes('kosmosShop/')) {
        let name = path.split('/')[1];
        let categoryDataHome = await auth.getCategoryNames();

        tempData.categories = categoryDataHome;
        tempData.products = await auth.getProductsWith(name)

        path = 'kosmosShop'
    } else if (path.includes('category')) {
        let name = path.split('/')[1];
        let categoryDataHome = await auth.getCategoryNames();

        tempData.categories = categoryDataHome;
        tempData.products = await auth.getProductsWith(name, 'category')

        path = 'kosmosShop';
    }


    getTemplate(path)
        .then(res => {

            let template = Handlebars.compile(res);
            let htmlResult = template(tempData);
            appElement.innerHTML = htmlResult;
        })
}

function getTemplate(path) {
    if (!routs[path]) {
        path = 'errorPage';
    }
    let tempPath = routs[path];

    return fetch(tempPath)
        .then(res => res.text());
}

function navigate(direction, condition) {

    history.pushState('', {}, direction);

    router(direction.slice(1), condition);
}


navigate('/categories');