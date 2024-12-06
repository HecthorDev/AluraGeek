import { servicesProducts } from "./product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

function createCard({ name, price, image, id }) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="img-container">
            <img src="${image}" alt="${name}">
        </div>
        <div class="card-container--info">
            <p>${name}</p>
            <div class="card-container--price">
                <p>$${price}</p>
                <button class="delete-button" data-id="${id}">
                    <img src="./assets/trashIcon.svg" alt="Eliminar" class="icon">
                </button>
            </div>
        </div>
    `;

    const deleteButton = card.querySelector(".delete-button");
    deleteButton.addEventListener("click", async () => {
        try {
            await servicesProducts.deleteProduct(id);
            card.remove(); // Remueve la tarjeta del DOM
        } catch (error) {
            console.log("Error al intentar eliminar producto:", error);
        }
    });

    return card;
}

const renderProducts = async () => {
    try {
        const listProducts = await servicesProducts.productList();
        listProducts.forEach((product) => {
            const productCard = createCard(product);
            productContainer.appendChild(productCard);
        });
    } catch (error) {
        console.log("Error al renderizar productos:", error);
    }
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.querySelector("[data-name]").value;
    const price = document.querySelector("[data-price]").value;
    const image = document.querySelector("[data-image]").value;

    try {
        const newProduct = await servicesProducts.createProduct(name, price, image);
        const newCard = createCard(newProduct);
        productContainer.appendChild(newCard);
    } catch (error) {
        console.log("Error al crear producto:", error);
    }
    form.reset();
});

renderProducts();
