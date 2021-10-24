const searchedProducts = document.querySelector(".searched-products");

class SearchUI {
  displayProducts(dataSearch) {
    let result = "";
    dataSearch.forEach((item) => {
      let otitulo = item.title;

      result += `
        
  <div class="searched-product-item">

    <div class="searched-product-right">   
    <img class="img1" src=${item.image} alt="" onclick="javascript:window.location='http://localhost:3000/produtoExclusivo.html?varname=${item.title}';"/>
    </div>   

    
    <div class="searched-product-left">

<div class="infoTop">
<h1 onclick="javascript:window.location='http://localhost:3000/produtoExclusivo.html?varname=${item.title}';">${item.title}</h1>

</div>


<div class="infoDescription">

    <p>The most beautiful on the planet, you wont regret buying this product.</p>

    <h3>reviews: estrelas</h3>
</div>



<div class="infoPrice">

<h2>price: $ ${item.price}</h2>

<button id="bag-btn" class="ba-btn" data-id=${item.id}>
    
      add to cart
      
    </button>




</div>
       
    </div>

</div>
   

    `;
    });

    searchedProducts.innerHTML = result;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchUI = new SearchUI();
  const ui = new UI();
  const products = new Products();

  ui.msgLogin();
  document.querySelector(".fazerLogout").addEventListener("click", ui.sair);

  let GET = {};
  let query = window.location.search.substring(1).split("&");

  for (let i = 0, max = query.length; i < max; i++) {
    if (query[i] === "") continue;

    let param = query[i].split("=");

    let pesquisa = param[1].split("+").join(" ");

    GET[decodeURIComponent(pesquisa)] = decodeURIComponent(pesquisa || "");

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

        searchUI.displayProducts(dataSearch);
      })
      .then(() => {
        ui.getBagButtons();
      });
  }
});
