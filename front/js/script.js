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

function printProduct(productId) {
    fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((products) => products.find(item => item._id == productId))
    .then((product) => {
        document.querySelector('.item').dataset.id = product._id;
        document.querySelector('.item__img img').src = product.imageUrl;
        document.querySelector('.item__img img').alt = product.altTxt;
        document.getElementById('title').innerText = product.name;
        document.getElementById('price').innerText = product.price;
        document.getElementById('description').innerText = product.description;

        for(let colors of product.colors) {
            const colorOption = document.createElement('option');
            colorOption.value = colors;
            colorOption.innerText = colors;
            document.getElementById('colors').appendChild(colorOption);
        }

        document.getElementById('addToCart').addEventListener('click', event => {
            event.preventDefault();
            addProductToCart({
                id: document.querySelector('.item').dataset.id,
                name: document.getElementById('title').innerText,
                color: document.querySelector('option:checked').value,
                quantity: Number(document.getElementById('quantity').value)
            }, getCart());
        });
    })
    .catch(error => alert('Erreur : ' + error));
}

function getCart() {
    let cart = localStorage.getItem('cart');
    if(!cart) {
        cart = [];
    } else {
        cart = JSON.parse(cart);
    }
    return cart;
}

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function productExist(product, cart) {
    return cart.filter(item => {
        return item.name == product.name && item.color == product.color;
    }).length > 0;
}

function productIndex(product, cart) {
    return cart.findIndex(item => {
        return item.name == product.name && item.color == product.color;
    });
}

function addProductToCart(product, cart) {
    if(productExist(product, cart)) {
        let position = productIndex(product, cart);
        cart[position].quantity += Number(product.quantity);
    }
    else {
        cart.push(product);
    }
    setCart(cart);
 }