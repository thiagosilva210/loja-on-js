const valorFrete = document.querySelector(".valor-frete");

let frete = 30;

valorFrete.innerHTML =
  `<p>O valor do frete será: ` + `<b>R$ ${frete.toFixed(2)}</b></p>`;

const valorTotalProdutos = document.querySelector(".cart-total-produtos");
const valorTotalFrete = document.querySelector(".cart-total-frete");

const checkoutLista = document.querySelector(".checkout-lista");

const completarBtn = document.querySelector(".completar");

const valorTotal = document.querySelector(".cart-total-final");
const totalItems = document.querySelector(".total-itens");

const enderecoDiv = document.querySelector(".endereco");

const itemAmount = document.querySelector(".item-amount");

const msgEndereco = document.querySelector(".msg-endereco");
const msgEnderecoCep = document.querySelector(".msg-endereco-cep");

class checkoutUI {
  cartLogic() {
    //cart functionality
    checkoutLista.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;

        let id = removeItem.dataset.id;

        checkoutLista.removeChild(
          removeItem.parentElement.parentElement.parentElement
        );

        this.removeItem(id);

        if (totalItems.innerHTML < 1) {
          alert("Você ainda não tem items no carrinho!!!");
          window.location.href = "index.html";
        }
      } else if (event.target.classList.contains("fa-chevron-right")) {
        let addAmount = event.target;

        let id = addAmount.dataset.id;

        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;

        Storage.saveCart(cart);
        this.setCartValues(cart);

        addAmount.previousElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-left")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;

        let tempItem = cart.find((item) => item.id === id);

        tempItem.amount = tempItem.amount - 1;

        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.nextElementSibling.innerText = tempItem.amount;
        } else {
          checkoutLista.removeChild(
            lowerAmount.parentElement.parentElement.parentElement
          );

          this.removeItem(id);

          if (totalItems.innerHTML < 1) {
            alert("Você ainda não tem items no carrinho!!!");
            window.location.href = "index.html";
          }
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);

    cartItems.forEach((id) => this.removeItem(id));

    while (checkoutLista.children.length > 0) {
      checkoutLista.removeChild(checkoutLista.children[0]);
    }

    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    valorTotalProdutos.innerText = parseFloat(tempTotal.toFixed(2));
    valorTotalFrete.innerText = frete.toFixed(2);

    valorTotal.innerText = parseFloat(tempTotal + frete).toFixed(2);
    totalItems.innerText = itemsTotal;

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("items-checkout");
    div.innerHTML = `
         
         
         
         
         

         <div class="checkout-result-left">
         <img class="imgCheckout" src=${item.image} 
            alt="product"/>
        </div>
        


        <div class="checkout-result-right">
            <div class="checkoutResult-1">
        
        
            <h4> ${item.title}</h4>
            <p></p>
            <h5>Preço: $ ${item.price}</h5>
            <h5>Description: ${item.description}</h5>
            <span class="remove-item" data-id=${item.id}>remove </span>
            </div>
        
        
        
        
        
            <div class="checkoutResult-2">
        
            <p>quantidade: </p>
            <i class="fas fa-chevron-left" data-id=${item.id}></i>
        
             <p class="item-amount">${item.amount}</p>
            
            <i class="fas fa-chevron-right" data-id=${item.id}></i>
        

            </div>

            </div>
          
        
        `;

    checkoutLista.appendChild(div);
  }

  setupAPP() {
    this.setCartValues(cart);
    this.populateCart(cart);
    this.setMsgEndereco();
  }

  setMsgEndereco() {
    msgEndereco.innerHTML = ` <b>${userLogado.endereco}</b>`;
    msgEnderecoCep.innerHTML = ` <b>${userLogado.CEP}</b>`;
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
    //a cada elemento do carrinho,
    //será criada uma nova div dentro do carrinho
    //com o produto selecionado
  }

  completarCompra() {
    completarBtn.addEventListener("click", () => {
      let items = [];
      let cartItemContent =
        document.getElementsByClassName("checkout-lista")[0];
      let cartRowItems =
        cartItemContent.getElementsByClassName("items-checkout");

      for (let i = 0; i < cartRowItems.length; i++) {
        let cartRowItem = cartRowItems[i];

        let quantityElement =
          cartRowItem.getElementsByClassName("item-amount")[0];

        let quantity = cart[i].amount;

        let id = cart[i].id;

        items.push({
          id: id,
          quantity: quantity,
        });
      }

      fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          items: items,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json();

          return res.json().then((json) => Promise.reject(json));
        })
        .then(({ url }) => {
          console.log(url);

          window.location = url;
        })
        .catch((e) => {
          console.error(e.error);
        });
    });
  } //fim de completar compra
}

if (localStorage.getItem("token") == null) {
  alert("você precisa estar logado para acessar esta página");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const checkoutui = new checkoutUI();

  checkoutui.setupAPP();
  checkoutui.completarCompra();
  checkoutui.cartLogic();
  ui.msgLogin();
  document.querySelector(".fazerLogout").addEventListener("click", ui.sair);

  if (totalItems.innerHTML < 1) {
    alert("Você ainda não tem items no carrinho!!!");
    window.location.href = "index.html";
  }
});
