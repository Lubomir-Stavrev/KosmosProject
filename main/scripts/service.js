const userModel = firebase.auth();

const apiKey = 'AIzaSyAVdYTu_l1PS2PFmh4P3_TNhyoS_Exiyfg';
const productsURL = `https://kosmosdb-44938-default-rtdb.europe-west1.firebasedatabase.app`;
const usersURL = 'https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/users.json';


const auth = {

    login(email, password) {

        return userModel.signInWithEmailAndPassword(email, password)
            .then(function(data) {
                localStorage.removeItem('buys');
                localStorage.setItem('auth', JSON.stringify({ uid: data.user.uid, email }));
            }).catch(err => {
                return 'Error';
            })
    },
    async register(email, password) {

        return await userModel.createUserWithEmailAndPassword(email, password)
            .then(async function(data) {
                await fetch(usersURL, {
                    method: 'POST',
                    body: JSON.stringify({
                        admin: false,
                        email,
                    })
                })
            }).catch(err => {

                return 'Error';
            })
    },
    create(title, category, subcategory, description, image, price, quantity, brand) {

        return fetch(productsURL + '/products/.json', {
            method: 'POST',
            body: JSON.stringify({
                title,
                category,
                subcategory,
                description,
                image,
                price,
                quantity,
                brand,
                uid: JSON.parse(localStorage.getItem("auth")).uid
            })
        }).then(res => res.json());
    },

    edit(title, category, subcategory, description, image, price, quantity, brand, id) {

        return fetch(productsURL + `/products//${id}/.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                title,
                category,
                subcategory,
                description,
                image,
                price,
                quantity,
                brand,
                uid: JSON.parse(localStorage.getItem("auth")).uid
            })
        }).then(res => res.json());
    },

    async getAllProducts() {

        let allData = [];
        let allProducts = [];



        await fetch(productsURL + '/products//.json')
            .then(res => res.json())
            .then(data => {
                if (data) {

                    Object.entries(data).forEach(el => {
                        if (el[0] != 'categoryNames' && el[0] != 'users') {
                            allData.push({
                                uid: el[1].uid,
                                productId: el[0],
                                title: el[1].title,
                                description: el[1].description,
                                image: el[1].image,
                                price: el[1].price,
                                category: el[1].category,
                                subcategory: el[1].subcategory,
                                type: el[1].type,
                                quantity: el[1].quantity,
                                brand: el[1].brand
                            })
                        }
                    })
                }
            })
        allProducts.all = allData
        return await allProducts
    },

    async getDetails(id) {

        let data = await fetch(`https://kosmosdb-44938-default-rtdb.europe-west1.firebasedatabase.app/products/${id}.json`)
            .then(res => res.json())
            .then(data => {

                let isCreator = false;
                if (JSON.parse(localStorage.getItem('auth'))) {
                    if (data.uid == JSON.parse(localStorage.getItem('auth')).uid) {
                        isCreator = true;
                    }
                }
                return {
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    quantity: data.quantity,
                    type: data.type,
                    category: data.category,
                    subcategory: data.subcategory,
                    image: data.image,
                    brand: data.brand,
                    uid: data.uid,
                    productId: id,
                    isCreator
                }
            })

        return await data;
    },

    async getUserData() {

        let data;

        if (localStorage.getItem('auth')) {
            if (localStorage.getItem('buys')) {
                data = {
                    uid: JSON.parse(localStorage.getItem('auth')).uid,
                    email: JSON.parse(localStorage.getItem('auth')).email,
                    isLogged: true,
                    buys: [],
                }
                if (JSON.parse(localStorage.getItem('buys'))) {

                    Object.entries(JSON.parse(localStorage.getItem('buys')))
                        .forEach(el => {

                            if (!data.buys.includes(el[1])) {
                                data.buys.push(el[1]);
                            }
                        })
                }

            } else {
                data = {
                    uid: JSON.parse(localStorage.getItem('auth')).uid,
                    email: JSON.parse(localStorage.getItem('auth')).email,
                    isLogged: true
                }
            }
        } else {
            data = {
                isLogged: false,
                buys: []
            }
            if (JSON.parse(localStorage.getItem('buys'))) {

                Object.entries(JSON.parse(localStorage.getItem('buys')))
                    .forEach(el => {

                        if (!data.buys.includes(el[1])) {
                            data.buys.push(el[1]);
                        }
                    })
            }

        }
        if (data.email) {

            await fetch(productsURL + `/users/.json`)
                .then(res => res.json())
                .then(userData => {
                    if (userData) {
                        Object.entries(userData)
                            .forEach(el => {

                                if (el[1].email == data.email) {

                                    data.isAdmin = true;



                                }
                            })
                    }
                })
        }
        return data;
    },

    logout() {
        localStorage.removeItem('auth');
        localStorage.removeItem('buys');
        return;
    },

    sendComment(idPost, comment) {

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${idPost}/commentSection.json`, {
            method: 'POST',
            body: JSON.stringify({

                comment,
                profile: JSON.parse(localStorage.getItem('auth')).email

            })
        }).then(res => res.json())

    },
    async getAllComments(idPost) {
        let comments = [];
        await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${idPost}/commentSection.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {
                        comments.push({
                            comment: el[1].comment,
                            profile: el[1].profile
                        })
                    })
                }
            })
        return await comments;
    },

    postLike(postId) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${postId}/likeSection.json`, {
            method: 'POST',
            body: JSON.stringify({
                profile: JSON.parse(localStorage.getItem('auth')).email
            })
        }).then(res => res.json());
    },

    async getAllLikes(postId) {

        let likesCounterInfo = {
            likes: 0,
            isLiked: false
        }
        await fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${postId}/likeSection.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {
                        likesCounterInfo.likes = likesCounterInfo.likes + 1;
                        let currEmail = '';
                        if (JSON.parse(localStorage.getItem('auth'))) {
                            currEmail = JSON.parse(localStorage.getItem('auth')).email;

                        }
                        if (currEmail == el[1].profile) {
                            likesCounterInfo.isLiked = true;
                        }
                    })
                }
            })

        return await likesCounterInfo;
    },

    postUnlike(postId) {

        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/products/${postId}/likeSection.json`, {
            method: 'DELETE',
            body: JSON.stringify({
                profile: JSON.parse(localStorage.getItem('auth')).email
            })
        }).then(res => res.json())
    },

    deleteProduct(id) {
        return fetch(productsURL + `/products//${id}/.json`, {
            method: 'DELETE',
        }).then(res => res.json());
    },

    async getAllRegisteredUsers() {

        let users = [];
        let currEmail = JSON.parse(localStorage.getItem('auth')).email;

        await fetch(usersURL)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {

                        if (el[1].email != currEmail) {

                            users.push({
                                userEmail: el[1].email,
                                admin: el[1].admin,
                                userId: el[0],
                            })
                        }
                    })

                }
            })

        return await users;
    },
    giveAdminRights(email, id) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/users/${id}/.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                email,
                admin: true
            })
        })
    },
    removeAdminRights(email, id) {
        return fetch(`https://myownspa-default-rtdb.europe-west1.firebasedatabase.app/users/${id}/.json`, {
            method: 'PATCH',
            body: JSON.stringify({
                email,
                admin: false
            })
        })
    },

    addNewCategory(name) {

        return fetch("https://kosmosdb-44938-default-rtdb.europe-west1.firebasedatabase.app/categoryNames/.json", {
            method: 'POST',
            body: JSON.stringify({
                name
            })
        }).then(res => res.json())
    },

    async getCategoryNames() {
        return await fetch("https://kosmosdb-44938-default-rtdb.europe-west1.firebasedatabase.app/categoryNames/.json")
            .then(res => res.json())
            .then(data => {
                let names = []
                if (data) {
                    Object.entries(data).forEach(el => {

                        if (el[1].name) {
                            names.push({ name: el[1].name, categoryId: el[0] });

                        }
                    })

                }

                return names;
            })
    },

    async getProductsWith(name, by) {
        let productsWithName = [];

        let allProducts = await this.getAllProducts();
        if (allProducts) {
            if (allProducts.all) {

                Object.entries(allProducts.all).forEach(product => {
                    if (product[1]) {
                        if (by == 'category') {

                            if (product[1].category) {

                                if (product[1].category.toLowerCase().includes(name.toLowerCase())) {

                                    productsWithName.push(product[1]);
                                }

                            }
                        } else {
                            if (product[1].title) {
                                if (product[1].title.toLowerCase().includes(name.toLowerCase())) {

                                    productsWithName.push(product[1]);
                                }

                            }

                        }
                    }

                })
            }
        }

        return await productsWithName;
    },

    async registerAnonymousUser() {
        let uid = '';
        firebase.auth().signInAnonymously()
            .then(() => {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        // User is signed in, see docs for a list of available properties
                        // https://firebase.google.com/docs/reference/js/firebase.User
                        localStorage.setItem('userToken', user.uid)
                            // ...
                    } else {
                        localStorage.removeItem('userToken')
                    }
                });
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });

        return await uid
    },

    addAnonymousUserProductsSum(sum) {
        let id = localStorage.getItem('userToken');

        return fetch(productsURL + `/${id}/.json`, {
                method: 'PUT',
                body: JSON.stringify({
                    sum
                })
            })
            .then(res => res.json())
            .then(data => data)
    },

    removeAnonymousUserProductsSum() {
        let id = localStorage.getItem('userToken');

        return fetch(productsURL + `/${id}/.json`, {
                method: 'DELETE',
            })
            .then(res => res.json())
            .then(data => data)
    },

    getAnonymousUserProductsSum() {
        let id = localStorage.getItem('userToken');
        return fetch(productsURL + `/${id}/.json`)
            .then(res => res.json())
            .then(data => data)
    },

    removeCategoryName(id) {

        return fetch(productsURL + `/categoryNames/${id}/.json`, {
                method: 'DELETE'
            }).then(res => res.json())
            .then(data => { return data })
    },
    async addSubcategoryToCategory(categoryName, subcategoryName) {

        let isAdded = await this.doesCategoryExist(categoryName, subcategoryName);
        console.log(isAdded);
        if (!isAdded) {

            return fetch(productsURL + `/categoriesAndSubCategories/${categoryName}/.json`, {
                method: "POST",
                body: JSON.stringify({
                    subcategoryName
                })

            })
        }
    },
    async doesCategoryExist(categoryName, subcategoryName) {
        let isAdded = false;
        await fetch(productsURL + `/categoriesAndSubCategories/${categoryName}/.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {
                        if (el[1].subcategoryName) {
                            if (el[1].subcategoryName.toLowerCase() == subcategoryName.toLowerCase()) {
                                isAdded = true
                            }
                        }
                    })
                }
            })
        return await isAdded;

    },
    async getCategoriesAndSubcategories() {
        let obj = [];
        await fetch(productsURL + `/categoriesAndSubCategories/.json`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    Object.entries(data).forEach(el => {
                        obj.push({
                            categoryName: el[0],
                            subcategories: el[1]
                        })
                    })
                }
            })

        return await obj;
    }



}