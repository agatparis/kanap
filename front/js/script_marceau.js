/**
 * @property {id: String, name: String, color: String, imageUrl: String, price: Number} product
 * @property {Number} quantity
 */
class CartProduct {
    constructor (product, quantity = 1) {
        this.product = product
        this.product.price = this.product.price / 100
        this.quantity = Number(quantity)
    }

    template () {
        return `
        <article class="cart__item" data-id="${this.product.id}" data-color="${this.product.color}">
            <div class="cart__item__img">
              <img src="${this.product.imageUrl}" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${this.product.name}</h2>
                <p>${this.product.color}</p>
                <p>${this.price(true)} €</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${this.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>
          </article>`
    }

    price (formated = false) {
        return formated ? this.formatPrice(this.product.price) : this.product.price
    }

    totalPrice (formated = false) {
        let total = this.quantity * this.product.price

        return formated ? this.formatPrice(total) : total
    }

    formatPrice (price) {
        return new Intl.NumberFormat('fr-FR').format(price)
    }
}

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

/**
 * Transforme les produits du panier en instance de CartProduct nettoyé avec les infos serveur
 * @param {Object[]}
 * @returns {CartProduct[]}
 */
async function cartToCartProducts(cartProducts) {
    return await fetch('http://localhost:3000/api/products')
        .then((response) => response.json())
        .then((items) => {
            let products = [];

            for (let i = 0; i < cartProducts.length; i++) {
                let cartProduct = cartProducts[i]
                let product = items.find(item => item._id === cartProduct.id)

                if (product) {
                    products.push(
                        new CartProduct({
                            id: product._id,
                            color: cartProduct.color,
                            name: product.name,
                            imageUrl: product.imageUrl,
                            price: product.price,
                        }, cartProduct.quantity)
                    )
                }
            }

            return products
        })
}

/**
 * Affiche les produits sur la page Panier
 * @param {String} selector
 * @param {CartProduct[]} cartProducts
 */
function displayCart(selector, cartProducts) {
    // récupère le container contenant la liste des produits et les totaux
    let wrapper = document.querySelector(selector)
    
    // récupére l'élement où on affiche les produits
    let productsTable = wrapper.querySelector('#cart__items')
    // vide la table des produits
    productsTable.innerHTML = ''
    
    // récupère l'élément où on affiche les totaux
    let total = wrapper.querySelector('.cart__price')
    // prépare deux variables pour stocker le total des prix et le total des articles
    let price = 0
    let quantity = 0

    cartProducts.forEach(product => {
        productsTable.insertAdjacentHTML('beforeend', product.template())
        price += product.totalPrice()
        quantity += product.quantity
    })

    total.querySelector('#totalQuantity').textContent = quantity
    total.querySelector('#totalPrice').textContent = new Intl.NumberFormat('fr-FR').format(price)

    Array.from(wrapper.querySelectorAll('.itemQuantity')).forEach(item => {
        item.addEventListener('change', event => {
            event.preventDefault()
            // Faire la même chose que pour la suppression mais dans le but d'update la quantité
        })
    })

    Array.from(wrapper.querySelectorAll('.deleteItem')).forEach(item => {
        // Gère le clic sur le bouton supprimer d'un article
        item.addEventListener('click', event => {
            event.preventDefault()
            // Récupère l'élément parent contenant les infos parent depuis l'élément du bouton supprimer
            let target = event.target.closest('.cart__item')
            // Lit l'ID et la couleur du produit concerné par la suppression
            let id = target.dataset.id
            let color = target.dataset.color
            
            // ensuite : supprimer le produit du panier
            // relancer l'affichage avec le panier en localStorage avec le nouveau panier
            // ex : removeProductFromCart(id, color) puis initializeCartDisplay
        })
    })
}

async function initializeCartDisplay(selector) {
    let cartProducts = await cartToCartProducts(getCart());
    displayCart(selector, cartProducts);
}
