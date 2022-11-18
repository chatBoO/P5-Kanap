const getFromBasket = () => {
  let basket = localStorage.getItem("basketItems");

  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
};

/* Function that injects the contents of the array [basketKanaps] into the code of cart.html
Fonction qui injecte le contenu du tableau [basketKanaps] dans le code de cart.html */
const cartDisplay = () => {
  for (let i = 0; i < basketKanaps.length; i++) {
    cartItems.innerHTML += `
        <article class="cart__item" data-id="${basketKanaps[i].id}" data-color="${basketKanaps[i].color}">
            <div class="cart__item__img">
                <img src="${basketKanaps[i].img}" alt="${basketKanaps[i].altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${basketKanaps[i].name}</h2>
                    <p>${basketKanaps[i].color}</p>
                    <p>${basketKanaps[i].price}</p>
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
};

let basket = getFromBasket();
let cartItems = document.getElementById("cart__items");

/* Declaration of an array that retrieves informations of the API of localStorage products 
Déclaration d'un tableau qui récupèrera les informations de l'API des produits du localStorage */
let basketKanaps = [];



fetch("http://localhost:3000/api/products")
  .then((response) => {
    return response.json();
  })

  .then((value) => {
    kanapList = value;

    for (let i = 0; i < kanapList.length; i++) {

      for (let j = 0; j < basket.length; j++) {

        if (kanapList[i]._id === basket[j].id) {

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
  });




