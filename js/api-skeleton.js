// https://siteid.a.searchspring.io/api/search/search.json?siteId=scmq7n&resultsFormat=native&q=jeans&redirectResponse=minimal&page=1&resultsPerPage=24&newKey=New%20Value'
const SEARCHSPRING_SITE_ID = "scmq7n";
const baseUrl = `https://${SEARCHSPRING_SITE_ID}.a.searchspring.io/api/search/search.json?&siteId=${SEARCHSPRING_SITE_ID}`;
// let editedUrl = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;
let userSearchQuery = "shoes";
let pageNum = 1;
let resultsPerPage = 13;

// variable to store API data
let ssApiData = [];

let productGrid = document.getElementById("product-grid");
let paginationDiv = document.getElementById("pagination-div");

const options = {method: 'GET', headers: {accept: 'application/json'}};


let searchInput = document.getElementById("search-input");
let inputSearchIcon = document.getElementById("input-search-icon");
let searchQuery = "";

function replaceSpacesWithAsterisks(str) {
    return str.replace(/ /g, '*');
}

function resetDefaults() {
    clearProductGrid();
    removeContentFromPaginationContainers();

}

searchInput.addEventListener('keydown', (ev) => {
    if (ev.key === "Enter") {
       resetDefaults();
       userSearchQuery = searchInput.value;
       console.log(userSearchQuery);
       ssApiCall(userSearchQuery).then((data) =>{
           console.log(data);

           // generateCardsByUserQuery(data);
       betterGenerator(data);
       generatePageFlipButtons()
       // generatePagination(data);
       // generatePagination(data)
       });
    }
});



function generatePagination(data) {
    const paginationDiv = document.getElementById("pagination-div");
    const numPages = data.pagination.totalPages;
    const currentPage = data.pagination.currentPage;
    const defaultPerPage = data.pagination.defaultPerPage;

    paginationDiv.innerHTML = "";

    for (let i = 1; i <= numPages; i++) {
        const paginationIndex = document.createElement("div");
        paginationIndex.classList.add("pagination-index");
        paginationIndex.innerText = i;
        paginationDiv.appendChild(paginationIndex);
    }
}



// function ssApiCall() {
//     return new Promise((resolve, reject) =>{
//         fetch(editedUrl, options)
//             .then(response => response.json())
//             .then(response => ssApiData = response)
//             .then(resp => console.log(resp))
//             .catch(error => console.log(error));
//
//     })
// }

// async function ssApiCall(userSearchQ) {
//     let editedUrl = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;
//     // Fetch Springsearch API data
//     const response = await fetch(editedUrl, options);
//     ssApiData = await response.json();
//     console.log(ssApiData);
//
//     return ssApiData;
//
// }

async function ssApiCall(userSearchQ) {
    let editedUrl = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;
    const response = await fetch(editedUrl, options);
    ssApiData = await response.json();
    return ssApiData;
}

    // searchInput.addEventListener('keydown', function (event) {
    //     searchBarFunctionality(event);
    //     ssApiCall();
    //     generateCardsByUserQuery();
    // });


function calculatePercentageDifference(originalPrice, newPrice) {
    const difference = originalPrice - newPrice;
    return (difference / originalPrice) * 100;
}

function clearProductGrid() {
    productGrid.innerHTML = "";
}

function showPageButtons(template, element) {
    let containers = document.querySelectorAll(element);
    containers.forEach((container) => {
        let newContent = document.createRange().createContextualFragment(template);
        container.appendChild(newContent);
    });
}

function generatePageFlipButtons() {
    showPageButtons(`
    <div class="">
        <div>
            <button>Previous Page</button>
            <button>Next Page</button>
        </div>
    </div>
    `, ".pagination-container");
}

function removeContentFromPaginationContainers() {
    const containers = document.querySelectorAll(".pagination-container");
    containers.forEach(container => {
        container.lastChild.remove();
    });
}


function betterGenerator(data) {
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
}

