/* Here we retrieve the ID of the product clicked on the home page to retrieve the informations
Ici on récupère l'ID du produit cliqué sur la page d'accueil pour récupérer les informations*/
let url = new URL(window.location.href);
let idKanap = url.searchParams.get("id");

/* Sofa and colors data retrieved
Récupération des données du canapé et des couleurs */
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
  ).innerHTML = `<img src="${informationsKanap.imageUrl}" alt="${informationsKanap.name}">`;
  document.querySelector("#title").innerHTML = informationsKanap.name;
  document.querySelector("#price").innerHTML = informationsKanap.price;
  document.querySelector("#description").innerHTML = informationsKanap.description;

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
fetch("http://localhost:3000/api/products/" + idKanap)
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

/* Creation of an event when the "Add to cart" button is clicked which adds the information to the "LocalStorage" so that it can be retrieved 
Création d'un évènement au clic du bouton "Ajouter au panier" qui ajoute les informations dans le "LocalStorage" pour pouvoir être récupérer */
cartButton.addEventListener("click", () => {
  let colorKanap = document.querySelector("#colors").value;
  let quantityKanap = document.querySelector("#quantity").value;

  if (colorKanap && quantityKanap !== 0) {
   
    let objJson = {
      kanapId: idKanap,
      kanapColor: colorKanap,
      kanapQuantity: quantityKanap,
    };

    let objLinea = JSON.stringify(objJson);
    localStorage.setItem("kanapToCart", objLinea);

  } else {
    alert = "Veuillez choisir une couleur et une quantité";
  }
});

console.log(localStorage);
console.log(document.querySelector("#quantity").value);
