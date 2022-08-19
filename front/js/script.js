function printProducts(selector) {
    fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
        for (let i=0; i<data.length; i++) {  
            document.getElementById(selector).innerHTML +='<a href="./product.html?id='+data[i]._id+'">        <article><img src="'+data[i].imageUrl+'" alt="'+data[i].altTxt+'"/><h3 class="productName">'+data[i].name+'</h3><p class="productDescription">'+data[i].description+'</p></article></a>';
        }    
    })
    .catch(error => alert('Erreur : ' + error));
}

const parsedUrl = new URL(window.location.href);
const productId = (parsedUrl.searchParams.get('id'));

function printProduct() {
    fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
        function productIdIs(data) {
            return data._id == productId;
        }
        const productData = data.find(productIdIs);
        document.querySelector('.item__img img').src = productData.imageUrl;
        document.querySelector('.item__img img').alt = productData.altTxt;
        document.getElementById('title').innerText = productData.name;
        document.getElementById('price').innerText = productData.price;
        document.getElementById('description').innerText = productData.description;
        for(let colors of productData.colors) {
            const colorOption = document.createElement('option');
            colorOption.value = colors;
            colorOption.innerText = colors;
            document.getElementById('colors').appendChild(colorOption);
        }
    })
}

function addProductToCart() {
    // cas nouveau panier
    // cas panier existant
        const cart = localStorage;
        const productName = document.getElementById('title').innerText;
        const productColor = document.getElementById('colors').value;
        const productQty = document.getElementById('quantity').value;
        const productExist = false;
            // cas nouveau produit : ajout produit + qté
        for(let product of cart.product) {
            if (cart.productName === product.name && cart.color === productColor) {
                return productExist = true;
            }
        }
        if (productExist) {
           //alert('le produit existe');
            addProductQty();
        }
        else {
            //alert('le produit n\'existe pas');
            addProduct();
        }
        function addProductQty() {
            cart.qty += document.getElementById('quantity').value;
        }
        function addProduct() {
            cart.productName = productName;
            cart.color = productColor;
            cart.qty = productQty;
            if (!cart.color && cart.qty < 1) {
                alert('Vous n\'avez pas choisi une couleur valide et une quantité valide');
            }
            else if (!cart.color) {
                alert('Vous n\'avez pas choisi une couleur valide');
            }
            else if (cart.qty < 1) {
                alert('Vous n\'avez pas indiqué une quantité valide');            
            }
        }
        console.log(cart);
    }

document.getElementById('addToCart').addEventListener('click', addProductToCart);


/*
function afficherProduits (selector) {
    console.log('Affiche les produits dans ' + selector);
}

function afficherUnProduit (id, selector) {
    console.log('Affiche le produit ' + id + ' dans le ' + selector);
}
*/
