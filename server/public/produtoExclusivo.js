const showProdEx = document.querySelector(".showProdEx");
//começo de produto exclusivo ui

class ProdutoExclusivoUI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
            
    <!-- single product -->

    <article class="product">

    <div class="details">

    <div class="img-container">
    <img class="imgProdutoExclusivo" src=${product.image} alt="product"
    class="product-img"
    />
    </div>





    <div class="details-product">
    <ul>
    <li>
    <h1>${product.title}</h1>
    </li>

    <li>reviews: #####
    </li>


    <li>
    description: ${product.description}
    </li>

    <li>
    <h1>price: $ ${product.price}</h1>
    </li>

    </ul>
    </div>

    

    <div class="details-action">

    <ul>

    <li><button id="bag-btn" class="add-btn" data-id=${product.id}>
    <i class="fas fa-shopping-cart">
    add to cart
    </i>
    </button>
    
    </li>

    <li>price: $ ${product.price}</li>
    <li>status: ${product.status}</li>

    </div>

    </div>

    </article>

    <!-- end single product -->
            
            `;
    });

    showProdEx.innerHTML = result;
  }
}

//fim de produto exclusivo ui

document.addEventListener("DOMContentLoaded", () => {
  const ProdutoExclusivoui = new ProdutoExclusivoUI();

  const ui = new UI();
  const products = new Products();

  ui.msgLogin();
  document.querySelector(".fazerLogout").addEventListener("click", ui.sair);

  let GET = {};
  let query = window.location.search.substring(1).split("&");

  for (let i = 0, max = query.length; i < max; i++) {
    let param = query[i].split("=");

    let pesquisa = param[1].split("%20").join(" ");

    products
      .getProducts()
      .then((products) => {
        let dataSearch = products.filter((item) => {
          return Object.keys(item).some((key) =>
            item[key]
              .toString()
              .toLowerCase()
              .includes(pesquisa.toString().toLowerCase())
          );
        });

        ProdutoExclusivoui.displayProducts(dataSearch);
      })
      .then(() => {
        ui.getBagButtons();
      });
  }
});
