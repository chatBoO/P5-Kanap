/* Here we retrieve the ID of the product clicked on the home page to retrieve the informations
Ici on récupère l'ID du produit cliqué sur la page d'accueil pour récupérer les informations*/

let url = new URL(window.location.href);
let idKanap = url.searchParams.get("id");

/* Sofa and colors data retrieved
Récupération des données du canapé et des couleurs */

let informationsKanap;
let colorsKanap;

/* Function that integrates the various sofa data into the product.html page
Fonction qui inétègre les différentes données du canapé dans la page product.html */

const informationsKanapDisplay = () => {
    document.querySelector('.item__img').innerHTML = `<img src="${informationsKanap.imageUrl}" alt="${informationsKanap.name}">`;
    document.querySelector('#title').innerHTML = informationsKanap.name;
    document.querySelector('#price').innerHTML = informationsKanap.price;
    document.querySelector('#description').innerHTML = informationsKanap.description;

    for(let i = 0; i < colorsKanap.length; i++){
        document.querySelector('#colors').innerHTML += `
        <option value="${colorsKanap[i]}">${colorsKanap[i]}</option>
        `
    }
}

/* Fetch function that fetches sofas data with Dynamic ID fetched from URL and generates a .JSON file
Fonction Fetch qui récupère les données du canapé avec l'ID Dynamique récupéré dans l'URL et génère un fichier .JSON */

fetch("http://localhost:3000/api/products/"+idKanap)
    .then((response) => {
        return response.json()
    })

    /* The .json file is processed and its content stored in the "informationKanap" variable and the colors in "colorsKanap"
    Le fichier .json est traité et son contenu stocké dans la variable "informationsKanap" et les couleurs dans "colorsKanap" */
    
    .then((value) => {
        informationsKanap = value;
        colorsKanap = informationsKanap.colors

        informationsKanapDisplay();
    });




