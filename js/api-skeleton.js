const SEARCHSPRING_SITE_ID = "scmq7n";
const baseUrl = `https://${SEARCHSPRING_SITE_ID}.a.searchspring.io/api/search/search.json?&siteId=${SEARCHSPRING_SITE_ID}`;

let productGrid = document.getElementById("product-grid");
let paginationContainer = document.querySelector(".pagination-container");
let clickMeDiv = document.getElementById("click-me-div");
let clickMeDivButtons = clickMeDiv.querySelectorAll(".top-button");
const options = {method: 'GET', headers: {accept: 'application/json'}};
let searchInput = document.getElementById("search-input");
let searchIcon = document.getElementById("input-search-icon");
let resultsPerPage = document.getElementById("per-page").innerText;
let currentPage = 1;

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////


(function () {
    quickItemsView();

})();

function resetDefaults() {
    clearProductGrid();
}

function attachAddToCartV2(data) {
    let addToCartButton = document.querySelectorAll(".add-to-cart-button");
    let cartSize = document.getElementById("cart-size");

    addToCartButton.forEach((button, i) => {
        function getItemIndex(pageNum, perPage, totalResults) {
            const totalPages = Math.ceil(totalResults / perPage);
            const currentPage = pageNum;
            const begin = (currentPage - 1) * perPage + 1;
            const end = Math.min(begin + perPage - 1, totalResults);

            const relativeIndex = (currentPage - 1) * perPage + i + 1;

            return [{index: i, relativeIndex: relativeIndex, perPage, filterVale: data.breadcrumbs[0].filterValue, pageNum: pageNum}]
        }

        button.addEventListener("click", () => {
            let cartItem = getItemIndex(data.pagination.currentPage, data.pagination.perPage, data.pagination.totalResults);
            cartSize.innerText++;
        });
    });

}

function quickItemsView() {
    clickMeDivButtons.forEach(button =>{
        button.addEventListener('click', () =>{
            fullSend(button.getAttribute('data-id'), 1, resultsPerPage);
        })
    })
}

searchInput.addEventListener('keydown', (ev) => {
    if (ev.key === "Enter") {
        if (searchInput.value.trim() !== "") {
            let searchQ = searchInput.value;
            let pageNum = 1;
            fullSend(searchQ, pageNum, resultsPerPage);
        }
    }
});


searchIcon.addEventListener('click', () => {
    if (searchInput.value.trim() !== "") {
        let searchQ = searchInput.value;
        let pageNum = 1;
        fullSend(searchQ, pageNum, resultsPerPage);
    }
});

// This is the all-encompassing API Calling Behemoth
function fullSend(userSearchQ, pageNum, resultsPerPage) {
    // This will toggle the product-grid so that it will be displayed as a grid, and not invisible
    if (productGrid.style.display === "none") {
        toggleVisibility(productGrid);
        productGrid.style.display = "grid";
    }
    // This is useful in the event other API calls are made (changing pages, searching new items, etc)
    // This clears the product-grid so that old search items aren't populating
    resetDefaults();

    // This is the original API calling function this method is built on.
    ssApiCall(userSearchQ, pageNum, resultsPerPage).then((data) =>{
        // This method generates each product into a card in product-grid
        betterGenerator(data);
        // cyclePage will allow the viewer to go to previous/next pages as long as there is a page to go to
        cyclePage(showSearchResultsHeader(data));
    });
}

async function ssApiCall(userSearchQ, pageNum, resultsPerPage) {
    const editedUrl = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&page=${pageNum}&resultsPerPage=${resultsPerPage}`;
    try {
        const response = await fetch(editedUrl, options);
        if (!response.ok) {
            throw new Error("Img not found")
        }
        let ssApiData = await response.json();
        return ssApiData;
    } catch (error) {
        console.log(error);
    }
}

function clearProductGrid() {
    paginationContainer.innerHTML = "";
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
            let cardContent = `<p style="margin: 0;"><span style="font-style: italic; font-weight: bold">${results.brand}:</span> ${results.name}</p>`;
            if (msrp > price) {
                const percent = percentDiff(msrp, price);
                cardContent += `
        <p style="font-weight: bold; color: red; margin: 0;">
          <span>${percent}% OFF!</span>
        </p>
        Was: <span style="text-decoration: line-through">&#36;${msrp}</span>
        Now: <span style="font-weight: bold">&#36;${price}</span>`;
            } else {
                cardContent += `&#36;<span style="font-weight: bold;">${price}</span>`;
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
    attachAddToCartV2(data);
    paginationContainer.scrollIntoView({behavior: 'smooth'});
}

function cyclePage(searchAndPageInfoArray) {
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
                fullSend(searchResults, currentPage+1, resultsPerPage)
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
                fullSend(searchResults, currentPage-1, resultsPerPage)
            });
        }
    }

    if (currentPage > pagination.totalPages) {
        document.getElementById("per-page").textContent = 12;
        resultsPerPage = 12;
        fullSend(searchResults, pagination.totalPages, resultsPerPage);
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

// This adds the page number links for direct access to a specific page
function activePageLinks(data) {
    var paginatedLinks = "";
    const currentPage = data.pagination.currentPage;
    const totalPages = data.pagination.totalPages;

    // Determine the start and end pages for the pagination links
    let startPage = Math.floor((currentPage - 1) / 15) * 15 + 1;
    let endPage = Math.min(startPage + 14, totalPages);

    // Add the links to the paginatedLinks variable
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginatedLinks += ` <a style="margin: 3px"><span class="page-num active" data-id="${i}">${i}</span></a>`;
        } else {
            paginatedLinks += `<a style="margin: 3px" class="page-num" data-id="${i}">${i}</a> `;
        }
    }
    // Add the "..." link if necessary
    if (endPage < totalPages) {
        paginatedLinks += `<a style="margin: 3px" class="page-num" data-id="${endPage + 1}">...</a>`;
    }

    return paginatedLinks;
}

// This generates the "Showing {number} of {number} for {search query}
function showSearchResultsHeader(data) {
    currentPage = data.pagination.currentPage;

    const pagination = data.pagination;
    const breadcrumbs = data.breadcrumbs[0].filterValue;

    var paginatedLinks = activePageLinks(data);

    // This is the text for the search result
    const searchResultsHeader = `
    <h3 id="results-header" style="font-family: Knewave, sans-serif;">
      Showing <span>${pagination.currentPage}</span>
      of <span id="ending-page-number">${pagination.totalPages}</span>
      for <span data-id="searched-item">${breadcrumbs}</span>
    </h3>

    <div class="link-div">${paginatedLinks}</div>

    <div class="d-flex" style="justify-content: center; text-align: center">
        <button class="prev-page-button" disabled="disabled" style="display: none; height: 30px; border-radius: 12px; align-items: center">&#x2190;</button>
        <button class="next-page-button" disabled="disabled" style="display: none; height: 30px; border-radius: 12px; align-items: center">&rarr;</button>
    </div>`;

    const paginationContainers = document.querySelectorAll('.pagination-container');
    paginationContainers.forEach(container => {
        container.innerHTML = searchResultsHeader;
    });

    // This assigns the links to a variable: pageLink and waits for a click event
    const pageLink = document.querySelectorAll('.page-num');
    pageLink.forEach((link, i) =>{
        link.addEventListener('click', () =>{
            // if the link isn't "..."
            if (link.innerText !== "...") {
                // we'll make an API call taking the last used search value, the value of the link clicked, and the last updated resultsPerPage
                fullSend(data.breadcrumbs[0].filterValue, link.innerText, resultsPerPage);
            // otherwise if it is "..."
            } else {
                // we'll make an API call taking the last search value, doing some math to find out what the next value relative to the current page is, and getting those results with the last updated resultsPerPage
                fullSend(data.breadcrumbs[0].filterValue, ((parseInt(pageLink[14].innerHTML) - (data.pagination.currentPage)) + (data.pagination.currentPage + 1)), resultsPerPage);
            }
        });
    });
    return [pagination, breadcrumbs];
}

// This takes the value of the "Results Per Page" select tag and updates the variable "resultsPerPage"
function updateSelectedPerPage(selectedItem) {
    var selectedValue = selectedItem.textContent;
    if (searchInput.value.trim() === "") {
        document.getElementById("per-page").innerText = selectedValue;
        resultsPerPage = parseInt(selectedValue);
    } else {
            document.getElementById("per-page").innerText = selectedValue;
            resultsPerPage = parseInt(selectedValue);
            fullSend(searchInput.value, currentPage, resultsPerPage);
    }

    return resultsPerPage;
}