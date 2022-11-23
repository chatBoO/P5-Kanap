// PARTIE QUI AFFICHE LES INFORMATIONS SUR LA PAGE product.html 
//--------------------------------------------------------------------------------

// Ici on récupère l'ID du produit cliqué sur la page d'accueil pour récupérer les informations
let url = new URL(window.location.href);
let id = url.searchParams.get("id");

let informationsKanap;
let colorsKanap;

// Récupération du bouton "ajouter au panier"
let cartButton = document.querySelector("#addToCart");

// Fonction qui inétègre les différentes données du canapé dans la page product.html
const informationsKanapDisplay = () => {
  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${informationsKanap.imageUrl}" alt="${informationsKanap.altTxt}">`;
  document.querySelector("#title").innerHTML = informationsKanap.name;
  document.querySelector("#price").innerHTML = informationsKanap.price;
  document.querySelector("#description").innerHTML =
    informationsKanap.description;

  // Une boucle "For in" qui parcourt les couleurs disponibles dans le tableau "colorsKanap"
  for (let i in colorsKanap) {
    document.querySelector("#colors").innerHTML += `
        <option value="${colorsKanap[i]}">${colorsKanap[i]}</option>
        `;
  }
};

// Fonction Fetch qui récupère les données du canapé avec l'ID Dynamique récupéré dans l'URL et génère un fichier .JSON
fetch("http://localhost:3000/api/products/" + id)
  .then((response) => response.json())

  // Le fichier .json est traité et son contenu stocké dans la variable "informationsKanap" et les couleurs dans "colorsKanap" */
  .then((value) => {
    informationsKanap = value;
    colorsKanap = informationsKanap.colors;

    informationsKanapDisplay();
  })

  .catch((error) => {
    console.log(error.message);
  });

// PARTIE QUI TRAITE ET ENREGISTRE LES DONNÉES DANS LE localStorage
//--------------------------------------------------------------------------------

// Fonction qui sauvegarde les données du panier dans le LocalStorage
const saveTheBasket = (cartContent) => {
  localStorage.setItem("basketItems", JSON.stringify(cartContent));
};

// Fonction qui récupère les données du panier dans le LocalStorage
const getFromBasket = () => {
  let basket = localStorage.getItem("basketItems");

  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
};

// Fonction qui appelle getFromBasket pour récupérér les données du panier dans le localStorage
const addToBasket = (product) => {
  let basket = getFromBasket();

  // Vérifie si un canapé stocké dans le LocalStorage a déjà le même ID et la même couleur, si c'est pas le cas alors retourne : "undefined"
  let findProduct = basket.find((p) => p.id == product.id && p.color == product.color);

  // Si le produit existe déjà dans le localStorage avec le même id et la même couleur alors on incrémente la quatité
  if (findProduct != undefined) {
    findProduct.quantity += product.quantity;
    
  // Sinon le resultat est "undefined" et donc le produit n'existe pas donc on rajoute le produit
  } else {
    product.quantity = product.quantity;
    basket.push(product);
  }

  saveTheBasket(basket);
};

// Création d'un évènement au clic sur le bouton "ajouter au panier"
cartButton.addEventListener("click", () => {
  let color = document.querySelector("#colors").value;
  let quantity = document.querySelector("#quantity").value;

  
  // Si "color" n'est pas vide ET que "quantity" est supérieur à 0, on exécute la fonction "addToBasket"
  if (color != "" && quantity > 0 && quantity <= 100) {
  
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
