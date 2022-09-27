// déclaration de l'objet produit du panier
class CartProduct {
    constructor(product) {
        this.product = product
    }
}

class finalCartProduct {
    constructor(id, color, quantity, name, imageUrl, imageAlt, description, price, totalProductPrice) {
        this.id = id,
        this.color = color,
        this.quantity = quantity,
        this.name = name,
        this.imageUrl = imageUrl,
        this.imageAlt = imageAlt,
        this.description = description,
        this.price = price,
        this.totalProductPrice = Number(this.price) * Number(this.quantity)
    }
}

// fonctions d'affichage des produits sous forme de liste pour la homepage

async function displayProducts(selector, data) {
    for(let i=0; i<data.length; i++) {
        templateHPList = [];
        templateHPList[i] = `<a href="./product.html?id=${data[i]._id}">
            <article>
                <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
                <h3 class="productName">${data[i].name}</h3>
                <p class="productDescription">${data[i].description}</p>
            </article>
            </a>`;
        document.getElementById(selector).innerHTML += templateHPList[i];
        }
}

async function printProducts(selector) {
    fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .then((data) => {
    displayProducts(selector, data);    
    })
    .catch(error => alert('Erreur : ' + error));
}

// fonction d'affichage d'un produit spécifique avec son ID

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
            if((document.getElementById('quantity').value < 0) || (document.getElementById('quantity').value >=100)) {
                alert('il doit y avoir 1 produit minimum et 100 produits maximum');
            }
            else if (document.getElementById('colors').value == '') {
                alert('une couleur doit être sélectionnée');
            }
            else {
                addProductToCart({
                        id: document.querySelector('.item').dataset.id,
                        name: document.getElementById('title').innerText,
                        color: document.querySelector('option:checked').value,
                        quantity: Number(document.getElementById('quantity').value)
                    }, getCart());        
            location.href = 'cart.html';
            }
        });
    })
    .catch(error => alert('Erreur : ' + error));
}

// fonction de recherche du panier 

function getCart() {
    let cart = localStorage.getItem('cart');
    if(!cart) {
        cart = [];
    } else {
        cart = JSON.parse(cart);
    }
    return cart;
}

// fonction de stockage du panier dans localStorage

function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// fonctions d'ajout des produits au panier
    // vérification de la présence ou non du produit sélectionné dans le panier
function productExist(product, cart) {
    return cart.filter(item => {
        return item.name == product.name && item.color == product.color;
    }).length > 0;
}
    // fonction de récupération de l'index sélectionné du produit dans le panier
function productIndex(product, cart) {
    return cart.findIndex(item => {
        return item.name == product.name && item.color == product.color;
    });
}
    // fonction d'ajout du produit sélectionné et de sa quantité dans le panier
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


/**
 * fonction de suppression d'un produit
 * @param {HTMLElement} element 
 * @param {Array} cart
 */
function deleteProductFromElement(element, cart) {
    let id = element.dataset.id;
    let color = element.dataset.color;
    for(let i=0; i<cart.length; i++) {
        let product = cart[i];
        if(product.id == id && product.color == color) {
            // supprimer le produit du local storage
            cart.splice(i, 1);
            setCart(cart);
        }
    }
    location.reload();
}

async function displayCart(selector, cart) {
    // récupérer données JSON dans l'objet finalProduct
    let finalProduct = [];  
    let totalCartProductQuantity = 0;
    let totalCartPrice = 0;  
    fetch('http://localhost:3000/api/products')
        .then((response) => response.json())
        .then((products) => {
            // création des objets finalProducts
            for(let i=0; i<cart.length; i++) {
                let product = products.find(item => item._id === cart[i].id);
                if(product) {
                   finalProduct[i] = new finalCartProduct(cart[i].id, cart[i].color, cart[i].quantity, product.name, product.imageUrl, product.altTxt, product.description, product.price, Number(product.price) * Number(cart[i].quantity));
                   totalCartProductQuantity += Number(cart[i].quantity);
                   totalCartPrice += Number(product.price * cart[i].quantity);
                }  
            }

            // création du template d'affichage des produits du panier
            let templateCartList = [];
            for(let i=0; i<finalProduct.length; i++) {
                templateCartList[i] = `<article class="cart__item" data-id="${finalProduct[i].id}" data-color="${finalProduct[i].color}">
                <div class="cart__item__img">
                <img src="${finalProduct[i].imageUrl}" alt="${finalProduct[i].imageAlt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${finalProduct[i].name}</h2>
                    <p>${finalProduct[i].color}</p>
                    <p>${finalProduct[i].totalProductPrice} €</p>
                </div>
                <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${finalProduct[i].quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                    </div>
                </div>
                </div>
                </article>`;                
            document.getElementById(selector).innerHTML += templateCartList[i];    
        }

        document.getElementById('totalQuantity').innerHTML = totalCartProductQuantity;
        document.getElementById('totalPrice').innerHTML = totalCartPrice;


        // ajout des fonctions de suppression
        let suppressionBtn = document.getElementsByClassName('deleteItem');
        Array.from(suppressionBtn).forEach(item => {                       
            item.addEventListener('click', event => deleteProductFromElement(item.closest('article'), cart));
        });
        })
        .catch(error => alert('Erreur : ' + error)); 
        
    }