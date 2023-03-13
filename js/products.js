const siteId = "scmq7n";
const apiUrl = `https://${siteId}.a.searchspring.io/api/search/search.json?resultsFormat=native&siteId=${siteId}&resultsPerPage=13`;

fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
        const html = data.results
            .map((result) => {
                return `
        <div class="bg-white shadow rounded-lg border border-gray-100">
          
          <img
            class="mx-auto rounded-tl-lg rounded-tr-lg"
            src="${result.thumbnailImageUrl}"
          />
          
          <div class="px-5 py-3 space-y-2">
            <h3 class="text-lg">${result.name}</h3>
            <p class="space-x-2">
              <span class="text-2xl font-semibold">$${result.price}</span>
              ${
                    result.price * 1 < result.msrp * 1
                        ? `
                  <span class="line-through text-gray-500">$${
                            result.msrp
                        }</span>
                  <span class="percent-off">${Math.round(
                            ((result.msrp * 1 - result.price * 1) / (result.msrp * 1)) *
                            100
                        )}% off</span>
                `
                        : ``
                }
              
            </p>
            <div class="flex justify-between items-center pt-3 pb-2">
              <button class="add-to-cart-button">Add to Cart</button>
            </div>
          </div>
        </div>
      `;
            })
            .join("");
        document.getElementById("product-grid").innerHTML = html;
        attachAddToCartV2(data);
    });
