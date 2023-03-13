// const siteId = "scmq7n";
// const apiUrl = `https://${siteId}.a.searchspring.io/api/search/search.json?resultsFormat=native&siteId=${siteId}`;
// let userSearchQ = "shoes";
// let pageNum = "1";
// let resultsPerPage = "12";
//
// let editedUrl = `${apiUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;
//
// function clearProductGrid() {
//     productGrid.innerHTML = "";
// }
// window.onload = function () {
//
// fetch(editedUrl)
//     .then((response) => response.json())
//     .then((data) => {
//         const html = data.results
//             .map((results) => {
//                 return `
//                 <div class="card-container">
//                     <div class="product-card card">
//                         <img src="${results.thumbnailImageUrl}" onerror="this.src='img/ai-logo.png'">
//                            <div class="inner-card">
//                                <p>${results.name}</p>
//                                Was: <span style="text-decoration: line-through">&#36;${results.msrp}</span>
//                                Now: &#36;<span style="font-weight: bold">${results.price}</span>
//                            </div>
//                            <button class="add-to-cart-button">Add To Cart</button>
//                     </div>
//                 </div>
//                 `;
//             })
//             .join("");
//         document.getElementById("product-grid").innerHTML = html;
//         attachAddToCart();
//     });
// }

// const thisUrlBase = baseUrl;

// fetch(`https://${thisUrlBase}/api/search/autocomplete.json?resultsFormat=json&redirectResponse=minimal&page=1&resultsPerPage=24`, options)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));

/*
    let editedUrl = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;

 */
const SEARCHSPRING_TEST_SITE_ID = "scmq7n";
const baseUrl_Test = `https://${SEARCHSPRING_TEST_SITE_ID}.a.searchspring.io/api/search/search.json?&siteId=${SEARCHSPRING_TEST_SITE_ID}`;
const options = {method: 'GET', headers: {accept: 'application/json'}};

// page 1, begin 2, end, 1

fetch(`${baseUrl_Test}&resultsFormat=native&q=sale&page=4&resultsPerPage=24`, options)
    .then(response => response.json())
    .then(response => {
        console.log(response.results[/* INDEX */ 0]);

    })
    .catch(err => console.error(err));

// cartItem( URL, index, resultsPerPage, searchQuery, pageNum)