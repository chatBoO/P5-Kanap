/* PART THAT DISPLAYS INFORMATION ON THE product.html PAGE
PARTIE QUI AFFICHE LES INFORMATIONS SUR LA PAGE product.html 
-------------------------------------------------------------------------------- */

/* Here we retrieve the ID of the product clicked on the home page to retrieve the informations
Ici on récupère l'ID du produit cliqué sur la page d'accueil pour récupérer les informations*/
let url = new URL(window.location.href);
let id = url.searchParams.get("id");

let informationsKanap;
let colorsKanap;

/* Recovery of the "add to cart" button
Récupération du bouton "ajouter au panier" */
let cartButton = document.querySelector("#addToCart");

/* Function that integrates the various sofa data into the product.html page
Fonction qui inétègre les différentes données du canapé dans la page product.html */
const informationsKanapDisplay = () => {
  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${informationsKanap.imageUrl}" alt="${informationsKanap.altTxt}">`;
  document.querySelector("#title").innerHTML = informationsKanap.name;
  document.querySelector("#price").innerHTML = informationsKanap.price;
  document.querySelector("#description").innerHTML =
    informationsKanap.description;

  /* A For in loop that loops through the colors available in the "colorsKanap" array
    Une boucle "For in" qui parcourt les couleurs disponibles dans le tableau "colorsKanap" */
  for (let i in colorsKanap) {
    document.querySelector("#colors").innerHTML += `
        <option value="${colorsKanap[i]}">${colorsKanap[i]}</option>
        `;
  }
};

/* Fetch function that fetches sofas data with Dynamic ID fetched from URL and generates a .JSON file
Fonction Fetch qui récupère les données du canapé avec l'ID Dynamique récupéré dans l'URL et génère un fichier .JSON */
fetch("http://localhost:3000/api/products/" + id)
  .then((response) => {
    return response.json();
  })

  /* The .json file is processed and its content stored in the "informationKanap" variable and the colors in "colorsKanap"
    Le fichier .json est traité et son contenu stocké dans la variable "informationsKanap" et les couleurs dans "colorsKanap" */
  .then((value) => {
    informationsKanap = value;
    colorsKanap = informationsKanap.colors;

    informationsKanapDisplay();
  });

/* PARTY THAT PROCESS AND SAVE DATA IN THE localStorage
PARTIE QUI TRAITE ET ENREGISTRE LES DONNÉES DANS LE localStorage
-------------------------------------------------------------------------------- */

/* Function that saves cart data in LocalStorage
Fonction qui sauvegarde les données du panier dans le LocalStorage */
const saveTheBasket = (cartContent) => {
  localStorage.setItem("basketItems", JSON.stringify(cartContent));
};

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

/* Function that calls getFromBasket to retrieve basket data
Fonction qui appelle getFromBasket pour récupérér les données du panier */
const addToBasket = (product) => {
  let basket = getFromBasket();

  /* Checks if a sofa stored in the LocalStorage already has the same ID and color, if not so return: "undefined"
  Vérifie si un canapé stocké dans le LocalStorage a déjà le même ID et la même couleur, si c'est pas le cas alors retourne : "undefined" */
  let findProduct = basket.find(
    (p) => p.id == product.id && p.color == product.color
  );

    /* If the product already exists in the localStorage with the same id and the same color then we increment the quantity
    Si le produit existe déjà dans le localStorage avec le même id et la même couleur alors on incrémente la quatité */
  if (findProduct != undefined) {
    findProduct.quantity = findProduct.quantity + product.quantity;
    
    /* The result is "undefined" and therefore the product does not exist so we add the product
    Sinon le resultat est "undefined" et donc le produit n'existe pas donc on rajoute le produit */
  } else {
    product.quantity = product.quantity;
    basket.push(product);
  }

  saveTheBasket(basket);
};

/* Creation of an event when the "add to cart" button is clicked
Création d'un évènement au clic sur le bouton "ajouter au panier" */
cartButton.addEventListener("click", () => {
  let color = document.querySelector("#colors").value;
  let quantity = document.querySelector("#quantity").value;

  
  /* If "color" is not empty AND "quantity" is greater than 0, we execute the "addToBasket" function
  Si "color" n'est pas vide ET que "quantity" est supérieur à 0, on exécute la fonction "addToBasket" */
  if (color != "" && quantity > 0) {
  
    addToBasket({
      id: id,
      color: color,
      quantity: Number(quantity),
    });

    alert("Produit ajouté au panier avec succès");

  } else {
    alert("Veuillez choisir une couleur et une quantité");
  }
});
