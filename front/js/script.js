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
           location.href = 'cart.html?id=cart';
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

 function returnCart(cart) {
   
    class CartProduct {
        constructor (id, name, color, quantity, imageUrl, altTxt, description, price, totalPrice) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.altTxt = altTxt;
        this.description = description;
        this.price = price;
        this.totalPrice = totalPrice;
        }
    }

    // récupérer données du panier + données JSON dans un objet 
    let cartProductItems = [];
    for(let i=0; i<cart.length; i++) {        
        fetch('http://localhost:3000/api/products')
        .then((response) => response.json())
        .then((products) => products.find(item => item._id == cart[i].id))
        .then((product) => {
        let totalPrice = cart[i].quantity * product.price;
        cartProductItems[i] = new CartProduct(cart[i].id, cart[i].name, cart[i].color, cart[i].quantity, product.imageUrl, product.altTxt, product.description, product.price, totalPrice);
        });
    }        
    return cartProductItems;
}


// afficher les produits
function printCart(selector, cartProductItems) {
    console.log(cartProductItems);   

    for(let i=0; i<cartProductItems.length; i++) {
        
        document.getElementById(selector).innerHTML += 'coucou';

        /*
        let productImg = [];
        productImg[i] = document.createElement('img');
        productImg[i].src = '../back/images/' + cartProductItems[i].imageUrl;
        productImg[i].alt = cartProductItems[i].altTxt;
        let productImgSection = [];
        productImgSection[i] = document.createElement('div');
        productImgSection[i].classList.add('cart__item__img');
        productImgSection[i].innerHTML = productImg[i].outerHTML;

        let productName = [];
        productName[i] = document.createElement('h2');
        productName[i].innerText = cartProductItems[i].name;
        let productColor = [];
        productColor[i] = document.createElement('p');
        productColor[i].innerText = cartProductItems[i].color;
        let productPrice = [];
        productPrice[i] = document.createElement('p');
        productPrice[i].innerText = cartProductItems[i].price;
        let productDescriptionSection = [];
        productDescriptionSection[i].createElement('div');
        productDescriptionSection[i].classList.add('cart__item__content__description');
        productDescriptionSection[i].innerHTML = productName[i].outerHTML + productColor[i].outerHTML + productPrice[i].outerHTML;
        
        let productQuantityLabel = [];
        productQuantityLabel[i] = document.createElement('p');
        productQuantityLabel[i].innerText = 'Qté : ';
        let productQuantityInput = [];
        productQuantityInput[i] = document.createElement('input');
        productQuantityInput[i].type = 'number';
        productQuantityInput[i].name = 'itemQunatity';
        productQuantityInput[i].min = '1';
        productQuantityInput[i].max = '100';
        productQuantityInput[i].value = cartProductItems[i].quantity;
        productQuantityInput[i].classList.add('itemQuantity');
        let productQuantitySettingsSection = [];
        productQuantitySettingsSection[i].createElement('div');
        productQuantitySettingsSection[i].classList.add('cart__item__content__settings__quantity');
        productQuantitySettingsSection[i].innerHTML = productQuantityLabel.outerHTML + productQuantityInput.outerHTML;
        
        let productSuppression = [];
        productSuppression[i] = document.createElement('p');
        productSuppression[i].innerText = 'Supprimer';
        productSuppression[i].classList.add('deleteItem');
        let productSuppressionSection = [];
        productSuppressionSection[i].createElement('div');    
        productSuppressionSection[i].classList.add('cart__item__content__settings__delete');
            
        let productSettingsSection = [];
        productSettingsSection[i] = document.createElement('div');
        productSettingsSection[i].classList.add('cart__item__content__settings');
        productSettingsSection[i].innerHTML = productQuantitySettingsSection[i].outerHTML + productSuppressionSection[i].outerHTML;

        let productContentSection = [];
        productContentSection[i] = document.createElement('article');
        productContentSection[i].classList.add('cart__item');
        productContentSection[i].dataset.id = cartProductItems[i].id;
        productContentSection[i].dataset.color = cartProductItems[i].color;
        productContentSection[i].innerHTML = productImgSection[i].outerHTML + productDescriptionSection[i].outerHTML + productSettingsSection[i].outerHTML;
    
        document.getElementById(selector).innerHTML += productContentSection[i].outerHTML; 
        */
    }
}

 function displayCart(selector, cart) {
    printCart(selector, returnCart(cart));
      
}
