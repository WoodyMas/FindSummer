const siteId = "scmq7n";
const apiUrl = `https://${siteId}.a.searchspring.io/api/search/search.json?resultsFormat=native&siteId=${siteId}`;
let userSearchQ = "shoes";
let pageNum = "1";
let resultsPerPage = "12";

let editedUrl = `${apiUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;

function clearProductGrid() {
    productGrid.innerHTML = "";
}

fetch(editedUrl)
    .then((response) => response.json())
    .then((data) => {
        const html = data.results
            .map((results) => {
                return `    
                <div class="card-container">
                    <div class="product-card card">
                        <img src="${results.thumbnailImageUrl}" onerror="this.src='img/ai-logo.png'">
                           <div class="inner-card">
                               <p>${results.name}</p>
                               Was: <span style="text-decoration: line-through">&#36;${results.msrp}</span>
                               Now: &#36;<span style="font-weight: bold">${results.price}</span>
                           </div>
                           <button class="add-to-cart-button">Add To Cart</button>
                    </div>
                </div>
                `;
            })
            .join("");
        document.getElementById("product-grid").innerHTML = html;
        attachAddToCart();
    });
