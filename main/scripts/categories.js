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

function productsByCategory(e) {
    e.preventDefault();

    if (e.target.tagName != "A") {
        return
    }
    let categoryValue = e.target.innerText;

    navigate(`/category/${categoryValue}`)

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
        let currChName = ch.outerText;

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