const appElement = document.getElementById('app');


const routs = {
    'home': '../templates/homePage.hbs',
    'kosmosShop': '../templates/shop/shop.hbs',
    'details': '../templates/detailsPage/details.hbs',
}

async function router(path, condition) {
    let tempData = await auth.getUserData();
    globalThis.tempData = tempData;

    switch (path) {
        case 'logout':
            auth.logout();
            navigate('/home');
            return;
    }

    if (path.includes('details/')) {
        /* let id = path.split('/')[1];
        let data = await auth.getDetails(id);
        let allComments = await auth.getAllComments(id);
        let allLikes = await auth.getAllLikes(id);

        commentSectionControl(tempData, allComments, condition);

        Object.assign(tempData, allLikes);
        Object.assign(tempData, data); */
        path = 'details';
    } else if (path.includes('edit/')) {
        let id = path.split('/')[1];
        let data = await auth.getDetails(id);

        Object.assign(tempData, data);
        path = 'edit';
    } else if (path.includes('profile')) {
        tempData.users = await auth.getAllRegisteredUsers();
    }

    getTemplate(path)
        .then(res => {

            let template = Handlebars.compile(res);
            let htmlResult = template(tempData);
            appElement.innerHTML = htmlResult;
        })
}

function commentSectionControl(tempData, allComments, condition) {
    tempData.comments = allComments;
    if (condition == 'block') {
        tempData.sectionCondition = 'Hide';
    } else {
        tempData.sectionCondition = 'See';
    }
    tempData.displayStyle = condition;
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


navigate('/details');