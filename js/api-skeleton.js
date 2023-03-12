// https://siteid.a.searchspring.io/api/search/search.json?siteId=scmq7n&resultsFormat=native&q=jeans&redirectResponse=minimal&page=1&resultsPerPage=24&newKey=New%20Value'
const SEARCHSPRING_SITE_ID = "scmq7n";
const baseUrl = `https://${SEARCHSPRING_SITE_ID}.a.searchspring.io/api/search/search.json?&siteId=${SEARCHSPRING_SITE_ID}`;
// let editedUrl = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;
let userSearchQuery = "shoes";
let pageNum = 1;
let resultsPerPage = 25;

// variable to store API data
let ssApiData = [];

let productGrid = document.getElementById("product-grid");
let paginationContainer = document.querySelector(".pagination-container");
let clickMeDiv = document.getElementById("click-me-div");
const options = {method: 'GET', headers: {accept: 'application/json'}};


let searchInput = document.getElementById("search-input");
let inputSearchIcon = document.getElementById("input-search-icon");
let searchQuery = "";

function replaceSpacesWithAsterisks(str) {
    return str.replace(/ /g, '*');
}

function resetDefaults() {
    clearProductGrid();

}

searchInput.addEventListener('keydown', (ev) => {
    if (ev.key === "Enter") {
       let searchQ = searchInput.value;
       let pageNum = 1;
       // let resultsPerPage = 13;

        fullSend(searchQ, pageNum, resultsPerPage);
    }
});

function fullSend(userSearchQ, pageNum, resultsPerPage) {
    let importantDetails = [];
    resetDefaults();
    // userSearchQuery = searchInput.value;
    // console.log(userSearchQuery);
    ssApiCall(userSearchQ, pageNum, resultsPerPage).then((data) =>{
        // importantDetails = data;
        console.log(data);
        // console.log(getItemAndPageData(data));
        // showSearchResultsHeader(data);
        // showSearchResultsHeader(data);

        goPrevNextPage(showSearchResultsHeader(data));

        betterGenerator(data);

    });
}

async function ssApiCall(userSearchQ, pageNum, resultsPerPage) {
    let editedUrl = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&redirectResponse=minimal&page=${pageNum}&resultsPerPage=${resultsPerPage}`;
    const response = await fetch(editedUrl, options);
    ssApiData = await response.json();
    return ssApiData;
}

function clearProductGrid() {
    productGrid.innerHTML = "";
}



function betterGenerator(data) {
    function percentDiff(msrp, price) {
        const diff = Math.abs(msrp - price);
        const percentDiff = (diff / msrp) * 100;
        return Math.round(percentDiff);
    }

    document.getElementById("product-grid").innerHTML = data.results
        .map((results) => {
            const msrp = results.msrp;
            const price = results.price;
            let cardContent = `<p style="margin: 0;">${results.name}</p>`;
            if (msrp > price) {
                const percent = percentDiff(msrp, price);
                cardContent += `
        <p style="font-weight: bold; color: red; margin: 0;">
          <span>${percent}% OFF!</span>
        </p>
        Was: <span style="text-decoration: line-through">&#36;${msrp}</span>
        Now: &#36;<span style="font-weight: bold">${price}</span>`;
            } else {
                cardContent += `&#36;<span style="font-weight: bold">${price}</span>`;
            }
            return `    
      <div class="card-container">
        <div class="product-card card">
          <img src="${results.thumbnailImageUrl}" onerror="this.src='img/ai-logo.png'">
          <div class="inner-card">
            ${cardContent}
          </div>
          <button class="add-to-cart-button">Add To Cart</button>
        </div>
      </div>
    `;
        })
        .join("");
    attachAddToCart();
    paginationContainer.scrollIntoView({behavior: 'smooth'});
}

function goPrevNextPage(searchAndPageInfoArray) {
    var pagination = searchAndPageInfoArray[0];
    var searchResults = searchAndPageInfoArray[1];

    let prevButton = document.getElementsByClassName("prev-page-button");
    let nextButton = document.getElementsByClassName("next-page-button");


    // Iterate through every button with class="next-page-button"
    for (let i = 0; i < nextButton.length; i++) {
        // If we are on a page less than the final page
        if (pagination.currentPage < pagination.totalPages) {
            // Enable nextButton at index of i
            toggleDisabled(nextButton[i]);
            toggleVisibility(nextButton[i]);
            // Check for an addEventListener
            nextButton[i].addEventListener("click", () =>{
                fullSend(searchResults, pagination.nextPage, resultsPerPage)
            });
        }
    }
    // Iterate through every button with class="prev-page-button"
    for (let i = 0; i < prevButton.length; i++) {
        if (pagination.currentPage <= pagination.totalPages && pagination.currentPage > 1) {
            // Enable nextButton at index of i
            toggleDisabled(prevButton[i]);
            toggleVisibility(prevButton[i]);
            // Check for an addEventListener
            prevButton[i].addEventListener("click", () =>{
                fullSend(searchResults, pagination.previousPage, resultsPerPage)
            });
        }
    }
}

function toggleDisabled(id) {
    if (id.disabled === "true") {
        id.disabled = false;
    } else {
        id.disabled = false;
    }
}

function toggleVisibility(id) {

    if (id.style.display === "none") {
        id.style.display = "block";
    } else {
        id.style.display = "none";
    }
}

function showSearchResultsHeader(data) {
    const pagination = data.pagination;
    const breadcrumbs = data.breadcrumbs[0].filterValue;

    var paginatedLinks = ``;

    for (let i = 1; i <= pagination.totalPages; i++) {
        paginatedLinks += `<a href="#" style="margin: 10px">${i}</a>`;
        if (i % 10 === 0) {
            paginatedLinks += `<a style="margin: 3px">...</a><a style="margin: 3px;" href="#">&#62;</a>`
            break;
        }

    }



    const searchResultsHeader = `
    <h3 id="results-header" style="font-family: Knewave, sans-serif; margin: 35px 0;">
      Showing
      <span>${pagination.currentPage}</span>
      of <span id="ending-page-number">${pagination.totalPages}</span>
      for <span data-id="searched-item">${breadcrumbs}</span>
    </h3>

    <div>${paginatedLinks}</div>

    <div class="d-flex" style="justify-content: center; text-align: center">
        <button class="prev-page-button" disabled="disabled" style="display: none; height: 30px; border-radius: 12px; align-items: center">Previous Page</button>
        <button class="next-page-button" disabled="disabled" style="display: none; height: 30px; border-radius: 12px; align-items: center">Next Page</button>
    </div>
        
<!--        <div>-->
<!--        </div>-->
  `;

    const paginationContainers = document.querySelectorAll('.pagination-container');
    paginationContainers.forEach(container => {
        container.innerHTML = searchResultsHeader;
    });
    // let collectivePageSearchInfo = [pagination, breadcrumbs];
    // goPrevNextPage(collectivePageSearchInfo)

    return [pagination, breadcrumbs];

}
