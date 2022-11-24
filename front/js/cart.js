//DECLARATION DES FONCTIONS DE BASE POUR RECUPERER ET ECRIRE DANS LE LOCAL STORAGE
//---------------------------------------------------------------------------------

// Fonction qui récupère les données du panier dans le LocalStorage.
const getFromBasket = () => {
    let basket = localStorage.getItem("basketItems");

    if (basket == null) {
        return [];

    } else {
        return JSON.parse(basket);
    }
};

// Fonction qui sauvegarde les données du panier dans le LocalStorage.
const saveTheBasket = (cartContent) => {
    localStorage.setItem("basketItems", JSON.stringify(cartContent));
};  

// DECLARATION DES FONCTIONS
//-----------------------------------------------------------------------------------

// Fonction qui calcule la quantité et le prix total des articles. 
const getTotalQty = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

    // A chaque itération de la première boucle on lance une deuxième boucle pour trouver une corresponsance d'ID entre les données de l'API et le panier en localStorage :
    for (let i = 0; i < basketKanaps.length; i++) {

        for (let j = 0; j < basket.length; j++) {
            
            if (basketKanaps[i].id === basket[j].id) {
                // Pour la quantité : Si une correspodance est trouvée alors on ajoute la quantité du produit à la valeur TotalQuantity existante.
                totalQuantity += basket[j].quantity;

                // Pour le prix : On prend la quantité du produit trouvé (dans le panier) et on la multiplie par le prix récupéré dans les données API !
                totalPrice += basket[j].quantity * basketKanaps[i].price;
            }   
        }
        // On affiche les éléments de quantité totale d'articles et le prix total dans le DOM.
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

// Fonction qui va créer un eventListener avec la boucle "forEach" pour écouter les changements sur chaque input "itemQuantity".
const changeQuantityProduct = () => {
    let inputItemQuantity = document.querySelectorAll('.itemQuantity');

    inputItemQuantity.forEach(itemQuantity => {

        itemQuantity.addEventListener('change', (e) => {
            e.preventDefault();

            // Pour savoir sur quel produit on doit changer la quantité on récupère les données "id" et "color" de l'élément parent via (Element.closest)
            let retrieveParentData = itemQuantity.closest('.cart__item');

             // On appelle "quantityProduct()"" les infos et la nouvelle quantité en paramètre".
            quantityProduct ({
                id: retrieveParentData.dataset.id,
                color: retrieveParentData.dataset.color,
                quantity: Number(e.target.value),
            });
            
            // On appelle "getTotalQty()" pour recalculer et afficher le total des produits ainsi que le prix total.
            getTotalQty();
        });
    })
}

// Fonction qui va créer un eventListener avec la boucle "forEach" pour écouter les clics sur chaque bouton "supprimer".
const deleteProduct = () => {
    let deleteButton = document.querySelectorAll(".deleteItem");

    deleteButton.forEach(deleteItem => {
    
        deleteItem.addEventListener("click" , (e) => {
            e.preventDefault();

            // On récupère de nouveau les infos de l'élément à supprimer via (Element.closest).
            let retrieveParentData = deleteItem.closest('.cart__item');

            /* Puis on utilise la méthode (.filter) pour parcourir le tableau et ne garder que les éléments demandés.
            Ici on demande à ne garder que les éléments du localStorage qui n'ont pas cet "id" et cette "color", on demande la suppression de cet élément.*/
            basket = basket.filter( p => p.id !== retrieveParentData.dataset.id || p.color !== retrieveParentData.dataset.color );
            
            // On sauvegarde les éléments restant sur le localStorage avec "saveTheBasket()"
            saveTheBasket(basket);

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
        // Appel des fonctions d'affichage
        cartDisplay();
        changeQuantityProduct();
        deleteProduct();
    })

    .catch((error) => {
        console.log(error.message);
    });


// PARTIE SAISIE DU FORMULAIRE
//-----------------------------------------------------------------------------------

// Déclaration des ReGex
let nameRegex = /^[a-zA-Zàâäéèêëïîôöùûüç][-/a-zA-Zàâäéèêëïîôöùûüç ]+[a-zA-Zàâäéèêëïîôöùûüç]+$/;
let addressRegex = /^[a-zA-Z0-9]+[-a-zA-Zàâäéèêëïîôöùûüç ]+[a-zA-Z]$/;
let emailRegex = /^[a-zA-Z0-9][-_a-zA-Z0-9àâäéèêëïîôöùûüç ]+[@]{1}[a-zA-Z0-9\-_]+[\.]{1}[a-z]{2,5}$/;

// Déclaration des variables des différents "input" du formaulaire
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');

let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
let addressErrorMsg = document.getElementById('addressErrorMsg');
let cityErrorMsg = document.getElementById('cityErrorMsg');
let emailErrorMsg = document.getElementById('emailErrorMsg');


/*AddEventListener pour écouter chaque changement sur les différents "input" du formulaire.
Si changement détecté.*/

firstName.addEventListener('change', () => {

    // On vérifie si la saisie est valide par le Regex selectionné.
    // Si c'est bon, le message d'erreur vaut "Valide".
    if (nameRegex.test(firstName.value)) {
        firstName.style.border = '1px solid green';
        document.getElementById('firstNameErrorMsg').style.color = 'green';
        document.getElementById('firstNameErrorMsg').textContent = "Valide";
    
    // Sinon on affiche le message d'erreur.
    } else {
        firstName.style.border = '1px solid red';
        document.getElementById('firstNameErrorMsg').style.color = 'red';
        document.getElementById('firstNameErrorMsg').innerHTML = 'Merci de renseigner votre prénom';
    }
});

lastName.addEventListener('change', () => {
    if (nameRegex.test(lastName.value)) {
        lastName.style.border = '1px solid green';
        document.getElementById('lastNameErrorMsg').style.color = 'green';
        document.getElementById('lastNameErrorMsg').textContent = "Valide";
    } else {
        lastName.style.border = '1px solid red';
        document.getElementById('lastNameErrorMsg').style.color = 'red';
        document.getElementById('lastNameErrorMsg').innerHTML = 'Merci de renseigner votre Nom';
    }
});

address.addEventListener('change', () => {
    if (addressRegex.test(address.value)) {
        address.style.border = '1px solid green';
        document.getElementById('addressErrorMsg').style.color = 'green';
        document.getElementById('addressErrorMsg').textContent = "Valide";
    } else {
        address.style.border = '1px solid red';
        document.getElementById('addressErrorMsg').style.color = 'red';
        document.getElementById('addressErrorMsg').innerHTML = 'Merci de renseigner votre adresse postale';
    }
});

city.addEventListener('change', () => {
    if (nameRegex.test(city.value)) {
        city.style.border = '1px solid green';
        document.getElementById('cityErrorMsg').style.color = 'green';
        document.getElementById('cityErrorMsg').textContent = "Valide";
    } else {
        city.style.border = '1px solid red';
        document.getElementById('cityErrorMsg').style.color = 'red';
        document.getElementById('cityErrorMsg').innerHTML = 'Merci de renseigner votre ville';
    }
});

email.addEventListener('change', () => {
    if (emailRegex.test(email.value)) {
        email.style.border = '1px solid green';
        document.getElementById('emailErrorMsg').style.color = 'green';
        document.getElementById('emailErrorMsg').textContent = "Valide";
    } else {
        email.style.border = '1px solid red';
        document.getElementById('emailErrorMsg').style.color = 'red';
        document.getElementById('emailErrorMsg').innerHTML = 'Merci de saisir une adresse mail correcte (exemple : jean@gmail.com';
    }
});

// ENREGISTREMENT ET ENVOI DES INFORMATIONS DU FORMULAIRE ET DU PANIER
//------------------------------------------------------------------------------------

// au clic sur le bouton "Commander !"
document.getElementById('order').addEventListener("click", (e)=> {
    e.preventDefault();
    
    // Si tous les champs sont valides et ne retournent pas d'erreur
    if (nameRegex.test(firstName.value) 
        && nameRegex.test(lastName.value) 
        && addressRegex.test(address.value)
        && nameRegex.test(city.value)
        && emailRegex.test(email.value)) {
        
        // Déclaration du tableau qui va recevoir les id des produits dans le panier
        let productsId = [];
        
        // Boucle For qui intégre les id des produits dans le tableau [productsId]
        for (let products of basket) {
           productsId.push(products.id);
        }

        // Déclaration d'un objet "orderClient" qui contient "contact" les coordonnées clients, et "products" les id des produits  
        const orderClient = {
            contact : {
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value,
            },
            products : productsId,
        }

        // Méthode Fetch qui envoie une requête "POST" de l'objet "orderClient" formaté en JSON
        fetch("http://localhost:3000/api/products/order", {
            method: 'POST',
            body: JSON.stringify(orderClient),
            headers: {
                'Accept': 'application/json', 
                "Content-Type": "application/json" 
            }
        })

        // On récupère le fichier json
        .then((response) => {

            if(response.ok) {
                response.json()

                // Redirection du visiteur vers confirmation.html avec "orderId" dans l'URL pour pouvoir la récupérer
                .then((value) => {
                    localStorage.clear();
                    document.location.href = `confirmation.html?orderId=${value.orderId}`;
                })

            } else {
                console.log('Mauvaise réponse du réseau');
            }
        })

        .catch((error) => {
            console.log("Il y a eu un problème avec l'opération fetch: " + error.message);
        });
         
    } else {
        alert ("Un problème est survenu lors de la saisie des données...");
    }
})