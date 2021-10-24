const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartDOM = document.querySelector(".cart");

const lewindowDOM = document.querySelector(".leWindow");
const lewindowOverlay = document.querySelector(".leWindow-overlay");
const closeLewindowBtn = document.querySelector(".close-leWindow");
const lewindowBtn = document.getElementById("leWindow-btn-1");

const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

let msgLogin = document.querySelector(".msgLogin");
let userLogado = JSON.parse(localStorage.getItem("userLogado"));

let cart = [];

let buttonsDOM = [];

//getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();

      let products = data.items;
      products = products.map((item) => {
        const { title, price, description, status } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;

        return { title, price, id, image, description, status };
      });

      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//começo class ui
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
            
    <!-- single product -->

    <article class="product">

    <div class="img-container">

    <img src=${product.image} alt="product"
    class="product-img" onclick="javascript:window.location='http://localhost:3000/produtoExclusivo.html?varname=${product.title}';"
    />
    <button id="bag-btn" class="bag-btn" data-id=${product.id}>

    <i class="fas fa-shopping-cart">
    add to cart
    </i>

    </button>



    </div>

    <h3 onclick="javascript:window.location='http://localhost:3000/produtoExclusivo.html?varname=${product.title}';">${product.title}</h3>
    <h3>$${product.price}</h3>



    </article>

    <!-- end single product -->


            
            `;
    });

    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll("#bag-btn")];

    buttonsDOM = buttons;

    buttons.forEach((button) => {
      let id = button.dataset.id;

      let inCart = cart.find((item) => item.id === id);

      if (inCart) {
        console.log("já está no carrinho");

        //button.disabled = true
        //button.innerText = "in Cart"
      }

      button.addEventListener("click", (event) => {
        //event.target.innerText = "In Cart";
        //event.target.disabled = true;

        //get product from products

        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        //add to products to the cart

        let tempItem11 = cart.find((item) => item.id === cartItem.id);

        if (tempItem11) {
          console.log("viu");
        } else {
          cart = [...cart, cartItem];

          //save in local storage
          Storage.saveCart(cart);

          //set cart values

          this.setCartValues(cart);

          // display cart item
          this.addCartItem(cartItem);

          //show the cart
          this.showCart();
        }
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} 
    alt="product"/>


    <div>


    <h4>${item.title}</h4>
    <h5>${item.price}</h5>
    <span class="remove-item" data-id=${item.id}>remove</span>
    </div>





    <div>


    <i class="fas fa-chevron-up" data-id=${item.id}></i>

    <p class="item-amount">${item.amount}</p>
    <i class="fas fa-chevron-down" data-id=${item.id}></i>

    </div>

    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  showCategories() {
    lewindowOverlay.classList.add("transparentBcg");
    lewindowDOM.classList.add("showLeWindow");
  }
  msgLogin() {
    if (localStorage.getItem("token") == null) {
      msgLogin.innerHTML = `faça seu login para comprar!  <a href="login.html">Fazer login</a>`;
    } else {
      msgLogin.innerHTML = `Seja bem vindo, ${userLogado.username} !
        <a class="fazerLogout"> Sair</a>  
          
        
        `;
    }
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart); //refere-se a uma função , a qual manipulará as quantidades e os preços totais
    this.populateCart(cart); // manda para addcartitem, aqual será criada uma nova div para cada produto novo
    this.msgLogin();
    cartBtn.addEventListener("click", this.showCart); // botao de mostrar a tela de dentro do carrinho
    closeCartBtn.addEventListener("click", this.hideCart);
    lewindowBtn.addEventListener("click", this.showCategories);
    closeLewindowBtn.addEventListener("click", this.hideLewindow);
    document.querySelector(".fazerLogout").addEventListener("click", this.sair);
  }

  sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("userLogado");
    window.location.href = "index.html";
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  hideLewindow() {
    lewindowOverlay.classList.remove("transparentBcg");
    lewindowDOM.classList.remove("showLeWindow");
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
    //a cada elemento do carrinho,
    //será criada uma nova div dentro do carrinho
    //com o produto selecionado
  }

  cartLogic() {
    //clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    //cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;

        let id = removeItem.dataset.id;

        cartContent.removeChild(removeItem.parentElement.parentElement);

        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;

        let tempItem = cart.find((item) => item.id === id);

        tempItem.amount = tempItem.amount + 1;

        Storage.saveCart(cart);
        this.setCartValues(cart);

        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;

        let tempItem = cart.find((item) => item.id === id);

        tempItem.amount = tempItem.amount - 1;

        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);

    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

//fim do class UI

//localstorage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveButtons(buttons) {
    localStorage.setItem("buttons", JSON.stringify(buttons));
  }

  static getButtons(id) {
    let buttons = JSON.parse(localStorage.getItem("buttons"));
    return buttons.find((buttons) => buttons.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
//fim do localstorage

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  ui.setupAPP();
  // get all products

  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
