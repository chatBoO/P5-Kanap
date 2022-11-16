let kanapList = [];
let kanapBox = document.getElementById('items');

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

fetch('http://localhost:3000/api/products')
    .then((response) => {
        return response.json()
    })

    .then((value) => {
        kanapList = value;
        console.log(kanapList);
        kanapDisplay();
    });