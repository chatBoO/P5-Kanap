/* Function that retrieves cart data from LocalStorage
Fonction qui récupère les données du panier dans le LocalStorage */
const getFromBasket = () => {
  let basket = localStorage.getItem("basketItems");

  if (basket == null) {
    return [];

  } else {
    return JSON.parse(basket);
  }
};

/* Function that saves cart data in LocalStorage
Fonction qui sauvegarde les données du panier dans le LocalStorage */
const saveTheBasket = (cartContent) => {
    localStorage.setItem("basketItems", JSON.stringify(cartContent));
  };  

const getTotalQty = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

    for (let j = 0; j < basket.length; j++) {
        let current_index = basketKanaps.findIndex((product) => {
            return product.id == basket[j].id;
        });
        totalQuantity += basket[j].quantity;
        totalPrice += basket[j].quantity * basketKanaps[current_index].price;
    }

    document.getElementById("totalQuantity").textContent = totalQuantity;
    document.getElementById("totalPrice").textContent = totalPrice;
}


const changeQuantity = (product) => {
    // let basket = getFromBasket();
    let findProduct = basket.find((p) => p.id == product.id && p.color == product.color);

    if (findProduct != undefined) {
        findProduct.quantity = product.quantity;
    }

    saveTheBasket(basket);
}

/* Function that injects the contents of the array [basketKanaps] into the code of cart.html
Fonction qui injecte le contenu du tableau [basketKanaps] dans le code de cart.html */
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

let basket = getFromBasket();

/* Declaration of an array that retrieves informations of the API of localStorage products 
Déclaration d'un tableau qui récupèrera les informations via l'API des produits du localStorage */
let basketKanaps = [];


fetch("http://localhost:3000/api/products")
    .then((response) => {
    return response.json();
    })

    .then((value) => {
        kanapList = value;
    
        /* Loops the data from the API, and at each iteration a 2nd loop is launched
        Boucle les données de l'API, et à chaque itération une 2ème boucle se lance */
        for (let i = 0; i < kanapList.length; i++) {
            
            /* At each iteration of the first loop, we look for a match in the localStorage
            A chaque itération de la première boucle, on recherche une correspondance dans le localStorage */
            for (let j = 0; j < basket.length; j++) {

                if (kanapList[i]._id === basket[j].id) {

                    /* If a match has been found, the "basketKanap" object is added to the "basketKanaps" array
                    Si une correspondance a été trouvé on ajoute l'objet "basketKanap" dans le tableau "basketKanaps" */
                    let basketKanap = {
                        id: basket[j].id,
                        color: basket[j].color,
                        quantity: basket[j].quantity,
                        name: kanapList[i].name,
                        price: kanapList[i].price,
                        img: kanapList[i].imageUrl,
                        altTxt: kanapList[i].altTxt,
                    };
                    basketKanaps.push(basketKanap);
                }
            }
        }
        cartDisplay();

        let inputItemQuantity = document.querySelectorAll('.itemQuantity');

        // for (let i = 0; i < inputItemQuantity.length; i++) {
        //     inputItemQuantity[i].addEventListener("change", (e) => {
        //         let itemQuantityValue = e.target.value;
        //         console.log(itemQuantityValue[i]);
        //     });
        // }
        
        inputItemQuantity.forEach(itemQuantity => {
            itemQuantity.addEventListener('change', (e) => {
                let retrieveParentData = itemQuantity.closest('.cart__item');

                changeQuantity ({
                    id: retrieveParentData.dataset.id,
                    color: retrieveParentData.dataset.color,
                    quantity: Number(e.target.value),
                });
                getTotalQty();
            });
        })
    })
