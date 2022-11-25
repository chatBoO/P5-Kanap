// PARTIE QUI AFFICHE LES INFORMATIONS SUR LA PAGE product.html 
//--------------------------------------------------------------------------------
// Fonction qui inétègre les différentes données du canapé dans la page product.html
const informationsKanapDisplay = () => {
  document.querySelector(".item__img").innerHTML = `<img src="${informationsKanap.imageUrl}" alt="${informationsKanap.altTxt}">`;
  document.querySelector("#title").innerHTML = informationsKanap.name;
  document.querySelector("#price").innerHTML = informationsKanap.price;
  document.querySelector("#description").innerHTML =
    informationsKanap.description;

  // Une boucle "For in" qui parcourt les couleurs disponibles dans le tableau "colorsKanap".
  for (let i in colorsKanap) {
    document.querySelector("#colors").innerHTML += `
        <option value="${colorsKanap[i]}">${colorsKanap[i]}</option>
        `;
  }
};

// "url" prend comme valeur l'adresse internet de la page qui contient un id (?id=....).
let url = new URL(window.location.href);

// "id" utilise la propriété "searchParams" pour récupérer avec ".get" l'id de "url".
let id = url.searchParams.get("id");

let informationsKanap;
let colorsKanap = [];

// Récupération du bouton "ajouter au panier"
let cartButton = document.querySelector("#addToCart");



// Méthode Fetch qui récupère les données du canapé avec l'ID Dynamique récupéré dans l'URL et génère un fichier .JSON
fetch("http://localhost:3000/api/products/" + id)

  .then((response) => {
  
    if(response.ok) {
      response.json()

      /* Le fichier .json est traité,
      son contenu stocké dans la variable "informationsKanap" et les couleurs dans "colorsKanap". */
      .then((value) => {
        informationsKanap = value;
        colorsKanap = informationsKanap.colors;

        informationsKanapDisplay();
      })

    } else {
      console.log('Mauvaise réponse du réseau');
    }
  })

  // On récupère l'erreur dans l'une des requêtes.
  .catch((error) => {
    console.log("Il y a eu un problème avec l'opération fetch: " + error.message);
  });

// PARTIE QUI TRAITE ET ENREGISTRE LES DONNÉES DANS LE localStorage
//--------------------------------------------------------------------------------

// Fonction qui sauvegarde les données du panier dans le LocalStorage.
const saveTheBasket = (cartContent) => {
  localStorage.setItem("basketItems", JSON.stringify(cartContent));
};

// Fonction qui récupère les données du panier dans le LocalStorage.
const getFromBasket = () => {
  let basket = localStorage.getItem("basketItems");

  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
};

let basket = getFromBasket();

// Fonction qui va ajouter des produits dans le panier (localStorage)
const addToBasket = (product) => {
 
  // Vérifie si un canapé stocké dans le LocalStorage (variable basket) a déjà le même ID et la même couleur, si c'est pas le cas alors retourne : "undefined".
  let findProduct = basket.find((p) => p.id == product.id && p.color == product.color);

  // Si le produit existe déjà dans le localStorage avec le même id et la même couleur alors on incrémente la quatité.
  if (findProduct != undefined) {
    findProduct.quantity += product.quantity;
    
  // Sinon le resultat est "undefined" et donc le produit n'existe pas donc on rajoute le produit au tableau "basket"
  } else {
    basket.push(product);
  }

  saveTheBasket(basket);
};

// Création d'un évènement au clic sur le bouton "ajouter au panier".
cartButton.addEventListener("click", () => {

  let color = document.querySelector("#colors").value;
  let quantity = document.querySelector("#quantity").value;

  if (color != "" && quantity <= 0 || quantity > 100) {

    alert("Quantité invalide, selectionnez une quantité comprise entre 1 - 100");
  }

  else if (color == "" && quantity > 0 && quantity <= 100) {
    
    alert("Vous n'avez pas sélectionné la couleur de votre produit");
  }

  // Si "color" n'est pas vide ET que "quantity" est supérieur à 0, on exécute la fonction "addToBasket".
  else if (color != "" && quantity > 0 && quantity <= 100) {
  
    addToBasket({
      id: id,
      color: color,
      quantity: Number(quantity),
    });

    alert("Produit ajouté au panier avec succès");

  } else {
    alert("Veuillez sélectionner une couleur et une quantité (1 - 100)");
  }
});
