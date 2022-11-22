//DECLARATION DES FONCTIONS DE BASE POUR RECUPERER ET ECRIRE DANS LE LOCAL STORAGE
//---------------------------------------------------------------------------------

// Fonction qui récupère les données du panier dans le LocalStorage
const getFromBasket = () => {
    let basket = localStorage.getItem("basketItems");

    if (basket == null) {
        return [];

    } else {
        return JSON.parse(basket);
    }
};

// Fonction qui sauvegarde les données du panier dans le LocalStorage
const saveTheBasket = (cartContent) => {
    localStorage.setItem("basketItems", JSON.stringify(cartContent));
};  

// DECLARATION DES FONCTIONS
//-----------------------------------------------------------------------------------

/* Fonction qui calcule la quantité et le prix total des articles. 
A chaque itération de la première boucle on lance une deuxième boucle pour trouver une corresponsance d'ID entre les données de l'API et le panier en localStorage :
Pour la quantité : Si correspondance alors on ajoute la quantité du produit à la valeur TotalQuantity existante.
Pour le prix : On prend la quantité du produit trouvé (dans le panier) et on la multiplie par le prix récupéré dans les données API ! et on remplca ces éléments dans le DOM */
const getTotalQty = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let i = 0; i < basketKanaps.length; i++) {

        for (let j = 0; j < basket.length; j++) {
            
            if (basketKanaps[i].id === basket[j].id) {
                totalQuantity += basket[j].quantity;
                totalPrice += basket[j].quantity * basketKanaps[i].price;
            }   
        }

        document.getElementById("totalQuantity").textContent = totalQuantity;
        document.getElementById("totalPrice").textContent = totalPrice;
    }
}

/* Fonction qui utilise la méthode (.find) pour parcourir le tableau dans le localStorage et rechercher une correspondance avec le produit dont on souhaite modifier la quantité.
Si le produit est trouvé alors on change la quantité dans le localStorage, sinon on ne fait rien */
const quantityProduct = (product) => {
    let findProduct = basket.find((p) => p.id == product.id && p.color == product.color);

    if (findProduct != undefined) {
        findProduct.quantity = product.quantity;
    }
    
    saveTheBasket(basket);
}

/* Fonction qui va créer un eventListener pour écouter les changements sur chaque input "itemQuantity".
Pour savoir sur quel produit on doit changer la quantité on récupère les données "id" et "color" de l'élément parent via (Element.closest) et on appelle "quantityProduct() les infos et la nouvelle quantité en paramètre".
On appelle "getTotalQuantity()" pour afficher les nouveaux totaux Qté Produits et prix */
const changeQuantityProduct = () => {
    let inputItemQuantity = document.querySelectorAll('.itemQuantity');

    inputItemQuantity.forEach(itemQuantity => {

        itemQuantity.addEventListener('change', (e) => {
            e.preventDefault();

            let retrieveParentData = itemQuantity.closest('.cart__item');

            quantityProduct ({
                id: retrieveParentData.dataset.id,
                color: retrieveParentData.dataset.color,
                quantity: Number(e.target.value),
            });
            
            getTotalQty();
        });
    })
}

/* Fonction qui va créer un eventListener pour écouter les clics sur chaque bouton "supprimer".
On récupère de nouveau les infos de l'élément à supprimer via (Element.closest).
Puis on utilise la méthode (.filter) pour parcourir le tableau et ne garder que les éléments demandés.
Ici on demande à ne garder que les éléments du localStorage qui n'ont pas cet "id" et cette "color", on demande la suppression de cet élément.
et on sauvegarde les éléments restant sur le localStorage avec "saveTheBasket()" */
const deleteProduct = () => {
    let deleteButton = document.querySelectorAll(".deleteItem");

    deleteButton.forEach(deleteItem => {
    
        deleteItem.addEventListener("click" , (e) => {
            e.preventDefault();

            let retrieveParentData = deleteItem.closest('.cart__item');

            basket = basket.filter( p => p.id !== retrieveParentData.dataset.id || p.color !== retrieveParentData.dataset.color );
            
            saveTheBasket(basket);

            //Alerte produit supprimé et refresh
            alert("Ce produit a bien été supprimé du panier");
            location.reload();
        })
    })
}

// Fonction qui injecte le contenu du tableau [basketKanaps] dans le code de cart.html
const cartDisplay = () => {

    if (basket === null || basket == 0) {
        const emptyCart = `<h2 style="text-align: center">Désolé mais votre panier est vide... </h2> <p style="text-align: center"><a href="../html/index.html">Continuer mon shopping</a></p>`;
        document.getElementById("cart__items").innerHTML = emptyCart;
        
    } else {

    for (let i in basketKanaps) {
        document.getElementById("cart__items").innerHTML += 
        `
            <article class="cart__item" data-id="${basketKanaps[i].id}" data-color="${basketKanaps[i].color}">
                <div class="cart__item__img">
                    <img src="${basketKanaps[i].img}" alt="${basketKanaps[i].altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${basketKanaps[i].name}</h2>
                        <p>${basketKanaps[i].color}</p>
                        <p>${basketKanaps[i].price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${basketKanaps[i].quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
    
   getTotalQty();

    };
}

// DECLARATION DES VARIABLES GLOBALES, DE LA FONCTION FETCH ET ACTIVATION DES FONCTIONS
//-----------------------------------------------------------------------------------

let basket = getFromBasket();

// Déclaration d'un tableau qui récupèrera les informations via l'API des produits du localStorage 
let basketKanaps = [];


fetch("http://localhost:3000/api/products")
    .then((response) => {
    return response.json();
    })

    .then((value) => {
        kanapListApi = value;
    
        // Boucle les données de l'API, et à chaque itération une 2ème boucle se lance
        for (let i = 0; i < kanapListApi.length; i++) {
            
            // A chaque itération de la première boucle, on recherche une correspondance dans le localStorage
            for (let j = 0; j < basket.length; j++) {

                if (kanapListApi[i]._id === basket[j].id) {

                    // Si une correspondance a été trouvé on ajoute l'objet "basketKanap" dans le tableau "basketKanaps"
                    let basketKanap = {
                        id: basket[j].id,
                        color: basket[j].color,
                        quantity: basket[j].quantity,
                        name: kanapListApi[i].name,
                        price: kanapListApi[i].price,
                        img: kanapListApi[i].imageUrl,
                        altTxt: kanapListApi[i].altTxt,
                    };
                    basketKanaps.push(basketKanap);
                }
            }
        }
        cartDisplay();
        changeQuantityProduct();
        deleteProduct();
    })


// PARTIE FORMULAIRE
//-----------------------------------------------------------------------------------

// Déclaration des ReGex
let nameRegex = /^[a-zA-Zàâäéèêëïîôöùûüç]+[-']*[a-zA-Zàâäéèêëïîôöùûüç]+$/;
let addressRegex = /^[a-zA-Z0-9]+[\-a-zA-Zàâäéèêëïîôöùûüç ]+$/;
let emailRegex = /^[a-zA-Z0-9\.\-_]+[@]{1}[a-zA-Z0-9\-_]+[\.]{1}[a-zA-Zàâäéèêëïîôöùûüç]+$/;

// Déclaration des variables des différents "input" du formaulaire
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');

firstName.addEventListener('change', () => {
    if (nameRegex.test(firstName.value)) {
        document.getElementById('firstNameErrorMsg').innerHTML = '';
    } else {
        document.getElementById('firstNameErrorMsg').innerHTML = 'Merci de renseigner votre prénom';
    }
});

lastName.addEventListener('change', () => {
    if (nameRegex.test(lastName.value)) {
        document.getElementById('lastNameErrorMsg').innerHTML = '';
    } else {
        document.getElementById('lastNameErrorMsg').innerHTML = 'Merci de renseigner votre Nom';
    }
});

address.addEventListener('change', () => {
    if (addressRegex.test(address.value)) {
        document.getElementById('addressErrorMsg').innerHTML = '';
    } else {
        document.getElementById('addressErrorMsg').innerHTML = 'Merci de renseigner votre adresse postale';
    }
});

city.addEventListener('change', () => {
    if (nameRegex.test(city.value)) {
        document.getElementById('cityErrorMsg').innerHTML = '';
    } else {
        document.getElementById('cityErrorMsg').innerHTML = 'Merci de renseigner votre ville';
    }
});

email.addEventListener('change', () => {
    if (emailRegex.test(email.value)) {
        document.getElementById('emailErrorMsg').innerHTML = '';
    } else {
        document.getElementById('emailErrorMsg').innerHTML = 'Merci de saisir une adresse mail correcte (exemple : jean@gmail.com';
    }
});