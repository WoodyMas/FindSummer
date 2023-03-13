// function attachAddToCart() {
//     /* Add your add to cart logic here */
//     let addToCartButton = document.querySelectorAll(".add-to-cart-button");
//     let cartSize = document.getElementById("cart-size");
//     addToCartButton.forEach((button) => {
//         button.addEventListener("click", () => {
//             cartSize.innerText++;
//         });
//     });
// }
//function replaceSpacesWithAsterisks(str) {
//     return str.replace(/ /g, '*');
// }
//
// function cartGenerator(item) {
//     cart.innerHTML = item.map((results) =>{
//         // const cartThumbnail = args.
//         const msrp = results.msrp;
//         const price = results.price;
//         let cardContent = `<p style="margin: 0;"><span style="font-style: italic; font-weight: bold">${results.brand}:</span> ${results.name}</p>`;
//         if (msrp > price) {
//             const percent = percentDiff(msrp, price);
//             cardContent += `
//         <p style="font-weight: bold; color: red; margin: 0;">
//           <span>${percent}% OFF!</span>
//         </p>
//         Was: <span style="text-decoration: line-through">&#36;${msrp}</span>
//         Now: <span style="font-weight: bold">&#36;${price}</span>`;
//         } else {
//             cardContent += `&#36;<span style="font-weight: bold;">${price}</span>`;
//         }
//         return `
//       <div class="card-container">
//         <div class="product-card card">
//           <img src="${results.thumbnailImageUrl}" onerror="this.src='img/ai-logo.png'">
//           <div class="inner-card">
//             ${cardContent}
//           </div>
//           <button class="add-to-cart-button">Add To Cart</button>
//         </div>
//       </div>
//     `;
//     })
// }
//
// async function quickFetch(index, perPage ,userSearchQ, pageNum) {
//     // Must be index in relation to pageNumber, NOT item count!!
//     let url = `${baseUrl}&resultsFormat=native&q=${userSearchQ}&page=${pageNum}&resultsPerPage=${perPage}`
//     const response = await fetch(url, options)
//         .then(resp => resp.json())
//         .then(resp =>{
//             console.log(resp.results[index]);
//             return resp.results[index];
//         });
// }