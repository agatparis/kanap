function displayProducts(selector, data) {
    console.log(data);
    for(let i=0; i<data.length; i++) {
        let pimg = [];
        pimg[i] = document.createElement('img');
        pimg[i].src = data[i].imageUrl;
        pimg[i].alt = data[i].altTxt;
        let ptitle = [];
        ptitle[i] = document.createElement('h3');
        ptitle[i].classList.add('productName');
        ptitle[i].textContent = data[i].name;
        let pp = [];
        pp[i] = document.createElement('p');
        pp[i].classList.add('productDescription');
        pp[i].textContent = data[i].description;
        let plink = [];
        plink[i] = document.createElement('a');
        plink[i].href = 'product.html?id='+data[i]._id;
        let particle = [];
        particle[i] = document.createElement('article');
        particle[i].innerHTML = pimg[i].outerHTML + ptitle[i].outerHTML + pp[i].outerHTML;
        plink[i].innerHTML = particle[i].outerHTML;
        document.getElementById(selector).innerHTML += plink[i].outerHTML;
    }
}

function printProducts(selector) {
    fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
    displayProducts(selector, data);    
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
/*
 function printCart(selector, cart) {
    
}
*/