let kanapList = [];

function affichageNoms() {
    for (let i = 0; i < kanapList.length; i++) {
        document.getElementById("test2").innerHTML += kanapList[i].name;
    }
}

fetch('http://localhost:3000/api/products')
    .then(function(response) {
        return response.json()
    })

    .then(function(value) {
        kanapList = value;
        console.log(kanapList);
        document.getElementById("testFetch").appendChild(document.createElement("p")).innerHTML=`Voici les différents noms de canapes :`
        
    });

    affichageNoms();