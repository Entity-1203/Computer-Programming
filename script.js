// INVENTORY MANAGEMENT SYSTEM

let products = JSON.parse(localStorage.getItem("products")) || [];

const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const submitBtn = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");

let editIndex = -1;

// DISPLAY PRODUCTS
function displayProducts(productList = products){

  productTableBody.innerHTML = "";

  if(productList.length === 0){

    productTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="no-data">
          No Products Available
        </td>
      </tr>
    `;

    return;
  }

  productList.forEach((product, index) => {

    productTableBody.innerHTML += `
      <tr>
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.quantity}</td>
        <td>₱${product.price.toFixed(2)}</td>
        <td>
          <button
            class="edit-btn"
            onclick="editProduct(${index})"
          >
            Edit
          </button>

          <button
            class="delete-btn"
            onclick="deleteProduct(${index})"
          >
            Delete
          </button>
        </td>
      </tr>
    `;
  });

}

// SAVE PRODUCTS
function saveProducts(){

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

}

// CLEAR FORM
function clearForm(){

  productForm.reset();

  editIndex = -1;

  submitBtn.textContent = "Add Product";

}

// VALIDATION
function validateInputs(
  id,
  name,
  category,
  quantity,
  price
){

  if(!id || !name || !category){

    throw new Error("All fields are required.");

  }

  if(isNaN(quantity) || isNaN(price)){

    throw new Error(
      "Quantity and Price must be numbers."
    );

  }

  if(quantity < 0 || price < 0){

    throw new Error(
      "Negative values are not allowed."
    );

  }

}

// ADD / UPDATE PRODUCT
productForm.addEventListener(
  "submit",
  function(e){

    e.preventDefault();

    errorMessage.textContent = "";

    try{

      const id = document
        .getElementById("productId")
        .value
        .trim();

      const name = document
        .getElementById("productName")
        .value
        .trim();

      const category = document
        .getElementById("category")
        .value
        .trim();

      const quantity = parseInt(
        document.getElementById("quantity").value
      );

      const price = parseFloat(
        document.getElementById("price").value
      );

      validateInputs(
        id,
        name,
        category,
        quantity,
        price
      );

      // DUPLICATE CHECK
      const duplicate = products.find(
        (product, index) =>
          product.id === id &&
          index !== editIndex
      );

      if(duplicate){

        throw new Error(
          "Product ID already exists."
        );

      }

      const productData = {
        id,
        name,
        category,
        quantity,
        price
      };

      // UPDATE
      if(editIndex !== -1){

        products[editIndex] = productData;

        errorMessage.style.color = "green";

        errorMessage.textContent =
          "Product updated successfully.";

      }else{

        products.push(productData);

        errorMessage.style.color = "green";

        errorMessage.textContent =
          "Product added successfully.";

      }

      saveProducts();

      displayProducts();

      clearForm();

    }catch(error){

      errorMessage.style.color = "red";

      errorMessage.textContent =
        error.message;

    }

  }
);

// EDIT PRODUCT
function editProduct(index){

  const product = products[index];

  document.getElementById("productId").value =
    product.id;

  document.getElementById("productName").value =
    product.name;

  document.getElementById("category").value =
    product.category;

  document.getElementById("quantity").value =
    product.quantity;

  document.getElementById("price").value =
    product.price;

  editIndex = index;

  submitBtn.textContent = "Update Product";

}

// DELETE PRODUCT
function deleteProduct(index){

  const confirmDelete = confirm(
    "Do you want to delete this product?"
  );

  if(confirmDelete){

    products.splice(index, 1);

    saveProducts();

    displayProducts();

    errorMessage.style.color = "green";

    errorMessage.textContent =
      "Product deleted successfully.";

  }

}

// LINEAR SEARCH
searchInput.addEventListener(
  "input",
  function(){

    const searchValue = searchInput
      .value
      .toLowerCase()
      .trim();

    let filteredProducts = [];

    // LINEAR SEARCH
    for(let i = 0; i < products.length; i++){

      const productId =
        products[i].id.toLowerCase();

      const productName =
        products[i].name.toLowerCase();

      if(
        productId.includes(searchValue) ||
        productName.includes(searchValue)
      ){

        filteredProducts.push(products[i]);

      }

    }

    displayProducts(filteredProducts);

  }
);

// BUBBLE SORT
sortSelect.addEventListener(
  "change",
  function(){

    const sortValue = sortSelect.value;

    let sortedProducts = [...products];

    // BUBBLE SORT
    for(let i = 0; i < sortedProducts.length; i++){

      for(
        let j = 0;
        j < sortedProducts.length - i - 1;
        j++
      ){

        let shouldSwap = false;

        if(sortValue === "name"){

          shouldSwap =
            sortedProducts[j].name.toLowerCase() >
            sortedProducts[j + 1]
            .name
            .toLowerCase();

        }

        else if(sortValue === "quantity"){

          shouldSwap =
            sortedProducts[j].quantity >
            sortedProducts[j + 1].quantity;

        }

        else if(sortValue === "price"){

          shouldSwap =
            sortedProducts[j].price >
            sortedProducts[j + 1].price;

        }

        if(shouldSwap){

          let temp = sortedProducts[j];

          sortedProducts[j] =
            sortedProducts[j + 1];

          sortedProducts[j + 1] = temp;

        }

      }

    }

    displayProducts(sortedProducts);

  }
);

// INITIAL DISPLAY
displayProducts();