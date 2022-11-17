let kanapList = [];
let kanapBox = document.getElementById('items');

/* Injects in HTML the content of the API presenting the sofas in index.html
Fonction qui injecte le contenu de l'API présentant les canapés dans index.html */

const kanapDisplay = () => {
    for (let i = 0; i < kanapList.length; i++) {
        kanapBox.innerHTML += `
        <a href="./product.html?id=${kanapList[i]._id}">
            <article>
                <img src="${kanapList[i].imageUrl}" alt="canapé : ${kanapList[i].name}">
                <h3 class="productName">${kanapList[i].name}</h3>
                <p class="productDescription">${kanapList[i].description}</p>
            </article>
        </a>
        `;
    }
};

/* Fetch function that fetches data from the canapes in the API and returns a .json file
Fonction Fetch qui récupère les données des canapés dans l'API et renvoie un fichier .json */

fetch('http://localhost:3000/api/products')
    .then((response) => {
        return response.json()
    })

    /* The .json file is processed and its content stored in the "kanapList" variable
    Le fichier .json est traité et son contenu stocké dans la variable "kanapList" */
    
    .then((value) => {
        kanapList = value;
        
        kanapDisplay();
    });