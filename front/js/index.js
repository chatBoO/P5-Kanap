// Déclaration des fonctions
//--------------------------------------------------------------------------------------------------

// Fonction qui injecte le contenu de l'API présentant les canapés dans index.html.
const kanapDisplay = () => {
  for (let i = 0; i < kanapList.length; i++) {
    
    kanapBox.innerHTML += `
        <a href="./product.html?id=${kanapList[i]._id}">
            <article>
                <img src="${kanapList[i].imageUrl}" alt="canapé : ${kanapList[i].altTxt}">
                <h3 class="productName">${kanapList[i].name}</h3>
                <p class="productDescription">${kanapList[i].description}</p>
            </article>
        </a>
        `;
  }
};

// Déclaration des variables
//--------------------------------------------------------------------------------------------------

// Variable "KanapList", un tableau vide qui va contenir le contenu des données de l'API.
let kanapList = [];

// Selection de la section "items" dans le DOM pour pouvoir lui injecter les données plus facilement.
let kanapBox = document.getElementById("items");


// Méthode Fetch qui récupère les données des canapés dans l'API et renvoie un fichier .json.
fetch("http://localhost:3000/api/products")

  .then((response) => {

    //On vérifie que la promesse est résolue.
    if(response.ok) {

      // SI elle est est résolue alors on récupère le fichier .json qui contient les données.
      response.json()
  
      // Le fichier .json est traité et son contenu stocké dans la variable "kanapList".
      .then((value) => {
        kanapList = value;

        kanapDisplay();
      })

    } else {
      console.log('Mauvaise réponse du réseau');
    }
  })

  // On récupère l'erreur dans l'une des requêtes.
  .catch((error) => {
    console.log("Il y a eu un problème avec l'opération fetch: " + error.message);
  });