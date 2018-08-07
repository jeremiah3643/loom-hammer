(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*
    Purpose: Store and retrieve data from remote API
*/

const APIObject = {

}

/*
    Purpose: Make GET request to API to retrieve data
*/
APIObject.getTypes = () => {
    return fetch("http://localhost:8088/types")
        .then(response => response.json());
}

/*
    Purpose: Retrieves all product objects from API
*/
APIObject.getProducts = () => {
    return fetch("http://localhost:8088/inventory")
    .then(response => response.json());
}

/*
    Purpose: POSTs (creates) a new product in the API
*/
APIObject.saveProduct = (product) => {
    return fetch("http://localhost:8088/inventory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    });
}

module.exports = APIObject



},{}],2:[function(require,module,exports){
const DataManager = require("./data/DataManager")
const renderProductList = require("./product/ProductList")
const renderNavBar = require("./nav/NavBar")
const renderForm = require("./product/ProductForm")


const saveProduct = (product) => {
    // Save the product to the API
    DataManager.saveProduct(product)
        .then(() => {
            renderProductList()
        })
}

renderNavBar().then(html => {
    document.querySelector("#navigation").innerHTML = html
    document.querySelector("#navbar").addEventListener("click", event => {
        const typeClickedOn = parseInt(event.target.id.split("--")[1])
        if (typeClickedOn === 4) {
            renderForm("#container", saveProduct)
        }
        else {
            renderProductList(typeClickedOn)
        }
    })
})
// renderProductList()
renderForm("#container", saveProduct)




},{"./data/DataManager":1,"./nav/NavBar":3,"./product/ProductForm":4,"./product/ProductList":5}],3:[function(require,module,exports){
const DataManager = require("../data/DataManager")

function renderNavBar () {
    return DataManager.getTypes().then(types => {
        let navHTML = "<nav id=\"navbar\">"

        types.forEach(type => {
            navHTML += `<a id="type--${type.id}" href="#">${type.description}</a>`
        })

        navHTML += "<a id=\"type--4\" href=\"#\">Create Product</a>"
        navHTML += "</nav>"

        return navHTML
    })
}

module.exports = renderNavBar

},{"../data/DataManager":1}],4:[function(require,module,exports){
const DataManager = require("../data/DataManager")
const renderProductList = require("./ProductList")
/*
    Purpose: Adds the event listener to the Save Product button
        and construct the object to be saved to the API when the
        button is clicked
*/
const addListener = () => {
    document.querySelector(".btn--saveProduct").addEventListener("click", () => {
        const product = {}
        product.name = document.querySelector("#productName").value
        product.description = document.querySelector("#productDescription").value
        product.price = parseFloat(document.querySelector("#productPrice").value)
        product.quantity = parseInt(document.querySelector("#productQuantity").value)
        product.type = parseInt(document.querySelector("#productType").value)

        console.log(product)

        DataManager.saveProduct(product)
            .then(() =>
                renderProductList(null)
            )
    })
}

/*
    Purpose: Build the product form component
    Arguments: types (string) - The option strings to put in the select
*/
const buildFormTemplate = (types) => {
    return `
        <fieldset>
            <label for="productName">Product name:</label>
            <input required type="text" name="productName" id="productName">
        </fieldset>
        <fieldset>
            <label for="productDescription">Description:</label>
            <input required type="text" name="productDescription" id="productDescription">
        </fieldset>
        <fieldset>
            <label for="productPrice">Price:</label>
            <input required type="number" name="productPrice" id="productPrice">
        </fieldset>
        <fieldset>
            <label for="productQuantity">Quantity:</label>
            <input required type="number" name="productQuantity" id="productQuantity">
        </fieldset>
        <fieldset>
            <label for="productType">Category:</label>
            <select required name="productType" id="productType">
            ${types.join("")}
            </select>
        </fieldset>
        <button class="btn btn--saveProduct">Save Product</button>
    `
}

/*
    Purpose: Renders the form component to the target element
    Arguments: targetElement (string) - Query selector string for HTML element
*/
const renderForm = (targetElement) => {
    return DataManager.getTypes()
        .then(types => {
            // Build options from the product types
            const options = types.map(type => {
                return `<option value="${type.id}">${type.description}</option>`
            })

            // Render the form to the DOM
            document.querySelector(targetElement).innerHTML = buildFormTemplate(options)

            // Now that it's on the DOM, add the event listener
            addListener()
        })
}

module.exports = renderForm

},{"../data/DataManager":1,"./ProductList":5}],5:[function(require,module,exports){
const DataManager = require("../data/DataManager")

function renderProductList(productTypeId) {
    DataManager.getProducts()
        .then((products) => {
            const container = document.querySelector("#container")
            container.textContent = ""
            if (productTypeId === null) {
                products.forEach(product => {
                    container.innerHTML += `<p>${product.name} $${product.price}</p>`
                })
            }
            else {
                // Filter all products to the ones that have the correct type
                const filteredProducts = products.filter(product => {
                    return product.type === productTypeId
                })

                // Display only the products that are of the correct type
                filteredProducts.forEach(product => {
                    container.innerHTML += `<p>${product.name} $${product.price}</p>`
                })
            }
        })
}

module.exports = renderProductList

},{"../data/DataManager":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi9zY3JpcHRzL2RhdGEvRGF0YU1hbmFnZXIuanMiLCIuLi9zY3JpcHRzL21haW4uanMiLCIuLi9zY3JpcHRzL25hdi9OYXZCYXIuanMiLCIuLi9zY3JpcHRzL3Byb2R1Y3QvUHJvZHVjdEZvcm0uanMiLCIuLi9zY3JpcHRzL3Byb2R1Y3QvUHJvZHVjdExpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLypcbiAgICBQdXJwb3NlOiBTdG9yZSBhbmQgcmV0cmlldmUgZGF0YSBmcm9tIHJlbW90ZSBBUElcbiovXG5cbmNvbnN0IEFQSU9iamVjdCA9IHtcblxufVxuXG4vKlxuICAgIFB1cnBvc2U6IE1ha2UgR0VUIHJlcXVlc3QgdG8gQVBJIHRvIHJldHJpZXZlIGRhdGFcbiovXG5BUElPYmplY3QuZ2V0VHlwZXMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L3R5cGVzXCIpXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSk7XG59XG5cbi8qXG4gICAgUHVycG9zZTogUmV0cmlldmVzIGFsbCBwcm9kdWN0IG9iamVjdHMgZnJvbSBBUElcbiovXG5BUElPYmplY3QuZ2V0UHJvZHVjdHMgPSAoKSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2ludmVudG9yeVwiKVxuICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSk7XG59XG5cbi8qXG4gICAgUHVycG9zZTogUE9TVHMgKGNyZWF0ZXMpIGEgbmV3IHByb2R1Y3QgaW4gdGhlIEFQSVxuKi9cbkFQSU9iamVjdC5zYXZlUHJvZHVjdCA9IChwcm9kdWN0KSA9PiB7XG4gICAgcmV0dXJuIGZldGNoKFwiaHR0cDovL2xvY2FsaG9zdDo4MDg4L2ludmVudG9yeVwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByb2R1Y3QpXG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQVBJT2JqZWN0XG5cblxuIiwiY29uc3QgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi9kYXRhL0RhdGFNYW5hZ2VyXCIpXG5jb25zdCByZW5kZXJQcm9kdWN0TGlzdCA9IHJlcXVpcmUoXCIuL3Byb2R1Y3QvUHJvZHVjdExpc3RcIilcbmNvbnN0IHJlbmRlck5hdkJhciA9IHJlcXVpcmUoXCIuL25hdi9OYXZCYXJcIilcbmNvbnN0IHJlbmRlckZvcm0gPSByZXF1aXJlKFwiLi9wcm9kdWN0L1Byb2R1Y3RGb3JtXCIpXG5cblxuY29uc3Qgc2F2ZVByb2R1Y3QgPSAocHJvZHVjdCkgPT4ge1xuICAgIC8vIFNhdmUgdGhlIHByb2R1Y3QgdG8gdGhlIEFQSVxuICAgIERhdGFNYW5hZ2VyLnNhdmVQcm9kdWN0KHByb2R1Y3QpXG4gICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJlbmRlclByb2R1Y3RMaXN0KClcbiAgICAgICAgfSlcbn1cblxucmVuZGVyTmF2QmFyKCkudGhlbihodG1sID0+IHtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI25hdmlnYXRpb25cIikuaW5uZXJIVE1MID0gaHRtbFxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbmF2YmFyXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBldmVudCA9PiB7XG4gICAgICAgIGNvbnN0IHR5cGVDbGlja2VkT24gPSBwYXJzZUludChldmVudC50YXJnZXQuaWQuc3BsaXQoXCItLVwiKVsxXSlcbiAgICAgICAgaWYgKHR5cGVDbGlja2VkT24gPT09IDQpIHtcbiAgICAgICAgICAgIHJlbmRlckZvcm0oXCIjY29udGFpbmVyXCIsIHNhdmVQcm9kdWN0KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVuZGVyUHJvZHVjdExpc3QodHlwZUNsaWNrZWRPbilcbiAgICAgICAgfVxuICAgIH0pXG59KVxuLy8gcmVuZGVyUHJvZHVjdExpc3QoKVxucmVuZGVyRm9ybShcIiNjb250YWluZXJcIiwgc2F2ZVByb2R1Y3QpXG5cblxuXG4iLCJjb25zdCBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuLi9kYXRhL0RhdGFNYW5hZ2VyXCIpXG5cbmZ1bmN0aW9uIHJlbmRlck5hdkJhciAoKSB7XG4gICAgcmV0dXJuIERhdGFNYW5hZ2VyLmdldFR5cGVzKCkudGhlbih0eXBlcyA9PiB7XG4gICAgICAgIGxldCBuYXZIVE1MID0gXCI8bmF2IGlkPVxcXCJuYXZiYXJcXFwiPlwiXG5cbiAgICAgICAgdHlwZXMuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgICAgICAgIG5hdkhUTUwgKz0gYDxhIGlkPVwidHlwZS0tJHt0eXBlLmlkfVwiIGhyZWY9XCIjXCI+JHt0eXBlLmRlc2NyaXB0aW9ufTwvYT5gXG4gICAgICAgIH0pXG5cbiAgICAgICAgbmF2SFRNTCArPSBcIjxhIGlkPVxcXCJ0eXBlLS00XFxcIiBocmVmPVxcXCIjXFxcIj5DcmVhdGUgUHJvZHVjdDwvYT5cIlxuICAgICAgICBuYXZIVE1MICs9IFwiPC9uYXY+XCJcblxuICAgICAgICByZXR1cm4gbmF2SFRNTFxuICAgIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyTmF2QmFyXG4iLCJjb25zdCBEYXRhTWFuYWdlciA9IHJlcXVpcmUoXCIuLi9kYXRhL0RhdGFNYW5hZ2VyXCIpXG5jb25zdCByZW5kZXJQcm9kdWN0TGlzdCA9IHJlcXVpcmUoXCIuL1Byb2R1Y3RMaXN0XCIpXG4vKlxuICAgIFB1cnBvc2U6IEFkZHMgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBTYXZlIFByb2R1Y3QgYnV0dG9uXG4gICAgICAgIGFuZCBjb25zdHJ1Y3QgdGhlIG9iamVjdCB0byBiZSBzYXZlZCB0byB0aGUgQVBJIHdoZW4gdGhlXG4gICAgICAgIGJ1dHRvbiBpcyBjbGlja2VkXG4qL1xuY29uc3QgYWRkTGlzdGVuZXIgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5idG4tLXNhdmVQcm9kdWN0XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSB7fVxuICAgICAgICBwcm9kdWN0Lm5hbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2R1Y3ROYW1lXCIpLnZhbHVlXG4gICAgICAgIHByb2R1Y3QuZGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2R1Y3REZXNjcmlwdGlvblwiKS52YWx1ZVxuICAgICAgICBwcm9kdWN0LnByaWNlID0gcGFyc2VGbG9hdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2R1Y3RQcmljZVwiKS52YWx1ZSlcbiAgICAgICAgcHJvZHVjdC5xdWFudGl0eSA9IHBhcnNlSW50KGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcHJvZHVjdFF1YW50aXR5XCIpLnZhbHVlKVxuICAgICAgICBwcm9kdWN0LnR5cGUgPSBwYXJzZUludChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2R1Y3RUeXBlXCIpLnZhbHVlKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKHByb2R1Y3QpXG5cbiAgICAgICAgRGF0YU1hbmFnZXIuc2F2ZVByb2R1Y3QocHJvZHVjdClcbiAgICAgICAgICAgIC50aGVuKCgpID0+XG4gICAgICAgICAgICAgICAgcmVuZGVyUHJvZHVjdExpc3QobnVsbClcbiAgICAgICAgICAgIClcbiAgICB9KVxufVxuXG4vKlxuICAgIFB1cnBvc2U6IEJ1aWxkIHRoZSBwcm9kdWN0IGZvcm0gY29tcG9uZW50XG4gICAgQXJndW1lbnRzOiB0eXBlcyAoc3RyaW5nKSAtIFRoZSBvcHRpb24gc3RyaW5ncyB0byBwdXQgaW4gdGhlIHNlbGVjdFxuKi9cbmNvbnN0IGJ1aWxkRm9ybVRlbXBsYXRlID0gKHR5cGVzKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInByb2R1Y3ROYW1lXCI+UHJvZHVjdCBuYW1lOjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgcmVxdWlyZWQgdHlwZT1cInRleHRcIiBuYW1lPVwicHJvZHVjdE5hbWVcIiBpZD1cInByb2R1Y3ROYW1lXCI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwcm9kdWN0RGVzY3JpcHRpb25cIj5EZXNjcmlwdGlvbjo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHJlcXVpcmVkIHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInByb2R1Y3REZXNjcmlwdGlvblwiIGlkPVwicHJvZHVjdERlc2NyaXB0aW9uXCI+XG4gICAgICAgIDwvZmllbGRzZXQ+XG4gICAgICAgIDxmaWVsZHNldD5cbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwcm9kdWN0UHJpY2VcIj5QcmljZTo8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IHJlcXVpcmVkIHR5cGU9XCJudW1iZXJcIiBuYW1lPVwicHJvZHVjdFByaWNlXCIgaWQ9XCJwcm9kdWN0UHJpY2VcIj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGZpZWxkc2V0PlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInByb2R1Y3RRdWFudGl0eVwiPlF1YW50aXR5OjwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgcmVxdWlyZWQgdHlwZT1cIm51bWJlclwiIG5hbWU9XCJwcm9kdWN0UXVhbnRpdHlcIiBpZD1cInByb2R1Y3RRdWFudGl0eVwiPlxuICAgICAgICA8L2ZpZWxkc2V0PlxuICAgICAgICA8ZmllbGRzZXQ+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicHJvZHVjdFR5cGVcIj5DYXRlZ29yeTo8L2xhYmVsPlxuICAgICAgICAgICAgPHNlbGVjdCByZXF1aXJlZCBuYW1lPVwicHJvZHVjdFR5cGVcIiBpZD1cInByb2R1Y3RUeXBlXCI+XG4gICAgICAgICAgICAke3R5cGVzLmpvaW4oXCJcIil9XG4gICAgICAgICAgICA8L3NlbGVjdD5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tLXNhdmVQcm9kdWN0XCI+U2F2ZSBQcm9kdWN0PC9idXR0b24+XG4gICAgYFxufVxuXG4vKlxuICAgIFB1cnBvc2U6IFJlbmRlcnMgdGhlIGZvcm0gY29tcG9uZW50IHRvIHRoZSB0YXJnZXQgZWxlbWVudFxuICAgIEFyZ3VtZW50czogdGFyZ2V0RWxlbWVudCAoc3RyaW5nKSAtIFF1ZXJ5IHNlbGVjdG9yIHN0cmluZyBmb3IgSFRNTCBlbGVtZW50XG4qL1xuY29uc3QgcmVuZGVyRm9ybSA9ICh0YXJnZXRFbGVtZW50KSA9PiB7XG4gICAgcmV0dXJuIERhdGFNYW5hZ2VyLmdldFR5cGVzKClcbiAgICAgICAgLnRoZW4odHlwZXMgPT4ge1xuICAgICAgICAgICAgLy8gQnVpbGQgb3B0aW9ucyBmcm9tIHRoZSBwcm9kdWN0IHR5cGVzXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gdHlwZXMubWFwKHR5cGUgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBgPG9wdGlvbiB2YWx1ZT1cIiR7dHlwZS5pZH1cIj4ke3R5cGUuZGVzY3JpcHRpb259PC9vcHRpb24+YFxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgLy8gUmVuZGVyIHRoZSBmb3JtIHRvIHRoZSBET01cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0RWxlbWVudCkuaW5uZXJIVE1MID0gYnVpbGRGb3JtVGVtcGxhdGUob3B0aW9ucylcblxuICAgICAgICAgICAgLy8gTm93IHRoYXQgaXQncyBvbiB0aGUgRE9NLCBhZGQgdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICBhZGRMaXN0ZW5lcigpXG4gICAgICAgIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyRm9ybVxuIiwiY29uc3QgRGF0YU1hbmFnZXIgPSByZXF1aXJlKFwiLi4vZGF0YS9EYXRhTWFuYWdlclwiKVxuXG5mdW5jdGlvbiByZW5kZXJQcm9kdWN0TGlzdChwcm9kdWN0VHlwZUlkKSB7XG4gICAgRGF0YU1hbmFnZXIuZ2V0UHJvZHVjdHMoKVxuICAgICAgICAudGhlbigocHJvZHVjdHMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY29udGFpbmVyXCIpXG4gICAgICAgICAgICBjb250YWluZXIudGV4dENvbnRlbnQgPSBcIlwiXG4gICAgICAgICAgICBpZiAocHJvZHVjdFR5cGVJZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHByb2R1Y3RzLmZvckVhY2gocHJvZHVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgKz0gYDxwPiR7cHJvZHVjdC5uYW1lfSAkJHtwcm9kdWN0LnByaWNlfTwvcD5gXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBhbGwgcHJvZHVjdHMgdG8gdGhlIG9uZXMgdGhhdCBoYXZlIHRoZSBjb3JyZWN0IHR5cGVcbiAgICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZFByb2R1Y3RzID0gcHJvZHVjdHMuZmlsdGVyKHByb2R1Y3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvZHVjdC50eXBlID09PSBwcm9kdWN0VHlwZUlkXG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgb25seSB0aGUgcHJvZHVjdHMgdGhhdCBhcmUgb2YgdGhlIGNvcnJlY3QgdHlwZVxuICAgICAgICAgICAgICAgIGZpbHRlcmVkUHJvZHVjdHMuZm9yRWFjaChwcm9kdWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCArPSBgPHA+JHtwcm9kdWN0Lm5hbWV9ICQke3Byb2R1Y3QucHJpY2V9PC9wPmBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlclByb2R1Y3RMaXN0XG4iXX0=
