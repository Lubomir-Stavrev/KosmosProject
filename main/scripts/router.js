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
        case 'cart':
            const deliveryPrice = 10 //TODO we dont know yet ?!
            tempData.subtotal = JSON.parse(localStorage.getItem('subtotal'));
            tempData.sumWithDelivery = Number(JSON.parse(localStorage.getItem('subtotal'))) + deliveryPrice;

            break;
    }

    if (path.includes('details/')) {
        let id = path.split('/')[1];
        let data = await auth.getDetails(id);
        /* let allComments = await auth.getAllComments(id);
        let allLikes = await auth.getAllLikes(id); */

        /* commentSectionControl(tempData, allComments, condition); */

        /* Object.assign(tempData, allLikes); */
        Object.assign(tempData, data);
        path = 'details';
    } else if (path.includes('edit/')) {
        let id = path.split('/')[1];
        let data = await auth.getDetails(id);

        Object.assign(tempData, data);
        path = 'edit';
    } else if (path.includes('profile')) {
        tempData.users = await auth.getAllRegisteredUsers();
    } else if (path.includes('kosmosShop/')) {
        let name = path.split('/')[1];
        tempData.products = await auth.getProductsWith(name)

        path = 'kosmosShop'
    }

    getTemplate(path)
        .then(res => {

            let template = Handlebars.compile(res);
            let htmlResult = template(tempData);
            appElement.innerHTML = htmlResult;
        })
}

function getTemplate(path) {
    let tempPath = routs[path];

    return fetch(tempPath)
        .then(res => res.text());
}

function navigate(direction, condition) {

    history.pushState('', {}, direction);

    router(direction.slice(1), condition);
}


navigate('/create');