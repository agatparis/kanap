function printProducts() {
    fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
        for (let i=0; i<data.length; i++) {  
            document.getElementById('items').innerHTML +='<a href="./product.html?id='+data[i]._id+'">        <article><img src="'+data[i].imageUrl+'" alt="'+data[i].altTxt+'"/><h3 class="productName">'+data[i].name+'</h3><p class="productDescription">'+data[i].description+'</p></article></a>';
        }    
    })
    .catch(error => alert('Erreur : ' + error));
}



/*
function afficherProduits (selector) {
    console.log('Affiche les produits dans ' + selector);
}

function afficherUnProduit (id, selector) {
    console.log('Affiche le produit ' + id + ' dans le ' + selector);
}
*/
