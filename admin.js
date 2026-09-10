/* =========================================================
   VJoraShop ADMIN PANEL
   ========================================================= */

/* ================= ADMIN LOGIN ================= */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "VJora@2026";
const API_BASE = "http://localhost:3000";

async function apiRequest(url, options = {}) {
    const response = await fetch(API_BASE + url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(data.message || "Backend error");
    }

    return data;
}

function adminLogin() {
    const usernameInput = document.getElementById("adminUsername");
    const passwordInput = document.getElementById("adminPassword");
    const error = document.getElementById("loginError");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        sessionStorage.setItem("vjoraAdminLoggedIn", "true");

        document.getElementById("adminLogin").style.display = "none";

        if (error) {
            error.textContent = "";
        }

        showToast("Admin login successful");
        initializeAdmin();
    } else {
        error.textContent = "Username ya Password galat hai!";
        passwordInput.value = "";
        passwordInput.focus();
    }
}


/* Allow Enter key on login */

document.addEventListener("keydown", (event) => {
    const loginBox = document.getElementById("adminLogin");

    if (
        event.key === "Enter" &&
        loginBox &&
        loginBox.style.display !== "none"
    ) {
        adminLogin();
    }
});


/* ================= KEYS ================= */

const PRODUCT_KEY = "vjoraProducts";
const ORDER_KEY = "vjoraOrders";
const USER_KEY = "vjoraUser";
const CART_KEY = "vjoraCart";
const WISHLIST_KEY = "vjoraWishlist";
const STORE_SETTINGS_KEY = "vjoraStoreSettings";


/* ================= DOM ================= */

const productModal = document.getElementById("productModal");
const orderModal = document.getElementById("orderModal");

const productForm = document.getElementById("productForm");

const totalProducts = document.getElementById("totalProducts");
const totalOrders = document.getElementById("totalOrders");
const totalSales = document.getElementById("totalSales");
const totalCustomers = document.getElementById("totalCustomers");

const productsTable = document.getElementById("productsTable");
const ordersTable = document.getElementById("ordersTable");
const customersTable = document.getElementById("customersTable");

const recentOrders = document.getElementById("recentOrders");
const lowStockProducts = document.getElementById("lowStockProducts");

const productSearch = document.getElementById("productSearch");
const productCategoryFilter =
    document.getElementById("productCategoryFilter");

const orderSearch = document.getElementById("orderSearch");
const orderStatusFilter =
    document.getElementById("orderStatusFilter");

const adminToast = document.getElementById("adminToast");
const adminToastMessage =
    document.getElementById("adminToastMessage");


/* ================= LOGIN CHECK ================= */

function isAdminLoggedIn() {
    return sessionStorage.getItem("vjoraAdminLoggedIn") === "true";
}

function protectAdminPanel() {
    const login = document.getElementById("adminLogin");

    if (!login) {
        return;
    }

    if (isAdminLoggedIn()) {
        login.style.display = "none";
    } else {
        login.style.display = "flex";
    }
}


/* ================= DATA ================= */

function getProducts() {
    try {
        return JSON.parse(
            localStorage.getItem(PRODUCT_KEY)
        ) || [];
    } catch {
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(
        PRODUCT_KEY,
        JSON.stringify(products)
    );
}

function getOrders() {
    try {
        return JSON.parse(
            localStorage.getItem(ORDER_KEY)
        ) || [];
    } catch {
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(
        ORDER_KEY,
        JSON.stringify(orders)
    );
}


/* ================= HELPERS ================= */

function money(value) {
    return "₹" +
        Number(value || 0).toLocaleString("en-IN");
}


function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function showToast(message) {

    if (!adminToast || !adminToastMessage) {
        return;
    }

    adminToastMessage.textContent = message;

    adminToast.classList.add("show");

    clearTimeout(window.adminToastTimer);

    window.adminToastTimer = setTimeout(() => {
        adminToast.classList.remove("show");
    }, 2500);
}


function imageFallback(img) {

    if (!img) {
        return;
    }

    img.onerror = null;

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="100"
             height="100"
             viewBox="0 0 100 100">

            <rect width="100"
                  height="100"
                  fill="#eef1f5"/>

            <text x="50"
                  y="52"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="12"
                  fill="#777">
                VJora
            </text>

        </svg>
    `;

    img.src =
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg);
}


/* ================= NAVIGATION ================= */

const sideButtons =
    document.querySelectorAll(".side-btn");

const sections =
    document.querySelectorAll(".admin-section");


function openSection(sectionName) {

    sideButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.section === sectionName
        );

    });


    sections.forEach(section => {
        section.classList.remove("active");
    });


    const target = document.getElementById(
        sectionName + "Section"
    );


    if (target) {
        target.classList.add("active");
    }


    if (sectionName === "dashboard") {
        renderDashboard();
    }

    if (sectionName === "products") {
        renderProducts();
    }

    if (sectionName === "orders") {
        renderOrders();
    }

    if (sectionName === "customers") {
        renderCustomers();
    }

    if (sectionName === "settings") {
        loadSettings();
    }
}


sideButtons.forEach(button => {

    button.addEventListener("click", () => {

        openSection(
            button.dataset.section
        );

    });

});


document
    .querySelectorAll("[data-section-target]")
    .forEach(button => {

        button.addEventListener("click", () => {

            openSection(
                button.dataset.sectionTarget
            );

        });

    });


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const products = getProducts();
    const orders = getOrders();


    totalProducts.textContent =
        products.length;


    totalOrders.textContent =
        orders.length;


    const sales = orders
        .filter(order =>
            order.status !== "Cancelled"
        )
        .reduce(
            (sum, order) =>
                sum + Number(order.total || 0),
            0
        );


    totalSales.textContent =
        money(sales);


    const customers = new Set();


    orders.forEach(order => {

        const email =
            String(order.email || "")
                .trim()
                .toLowerCase();

        const phone =
            String(order.phone || "")
                .trim();

        const name =
            String(order.name || "")
                .trim()
                .toLowerCase();

        const key =
            email || phone || name;

        if (key) {
            customers.add(key);
        }

    });


    totalCustomers.textContent =
        customers.size;


    renderRecentOrders(orders);
    renderLowStock(products);
}


/* ================= RECENT ORDERS ================= */

function renderRecentOrders(orders) {

    if (!orders.length) {

        recentOrders.innerHTML = `
            <div class="empty-state">
                <strong>No orders yet</strong>
                Customer orders will appear here.
            </div>
        `;

        return;
    }


    const latest =
        [...orders]
            .reverse()
            .slice(0, 6);


    recentOrders.innerHTML = `
        <table class="admin-table">

            <thead>
                <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>

                ${latest.map(order => `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    order.orderId
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                order.name || "Customer"
                            )}
                        </td>

                        <td>
                            <strong>
                                ${money(order.total)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                order.status ||
                                "Order Placed"
                            )}
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>
    `;
}


/* ================= LOW STOCK ================= */

function renderLowStock(products) {

    const low = products
        .filter(product =>
            Number(product.stock) <= 5
        )
        .sort(
            (a, b) =>
                Number(a.stock) -
                Number(b.stock)
        );


    if (!low.length) {

        lowStockProducts.innerHTML = `
            <div class="empty-state">
                <strong>Stock looks good</strong>
                No products have low stock.
            </div>
        `;

        return;
    }


    lowStockProducts.innerHTML =
        low.map(product => `

            <div class="low-stock-item">

                <div class="low-stock-name">
                    ${escapeHTML(
                        product.name
                    )}
                </div>

                <div class="low-stock-count">
                    ${Number(product.stock)} left
                </div>

            </div>

        `).join("");
}


/* ================= PRODUCTS ================= */

function renderProducts() {

    let products = getProducts();


    const search =
        productSearch.value
            .trim()
            .toLowerCase();


    const category =
        productCategoryFilter.value;


    products =
        products.filter(product => {

            const productName =
                String(product.name || "")
                    .toLowerCase();

            const productId =
                String(product.id || "")
                    .toLowerCase();


            const matchesSearch =
                !search ||
                productName.includes(search) ||
                productId.includes(search);


            const matchesCategory =
                category === "all" ||
                product.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    if (!products.length) {

        productsTable.innerHTML = `
            <div class="empty-state">
                <strong>No products found</strong>
                Try another search or add a new product.
            </div>
        `;

        return;
    }


    productsTable.innerHTML = `

        <table class="admin-table">

            <thead>

                <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>

            </thead>


            <tbody>

                ${products.map(product => {

                    let stockClass =
                        "stock-good";


                    if (
                        Number(product.stock) <= 5
                    ) {
                        stockClass =
                            "stock-low";
                    }


                    if (
                        Number(product.stock) <= 0
                    ) {
                        stockClass =
                            "stock-out";
                    }


                    return `

                        <tr>

                            <td>

                                <div class="product-table-info">

                                    <img
                                        src="${escapeHTML(
                                            product.image || ""
                                        )}"
                                        alt=""
                                        onerror="imageFallback(this)"
                                    >

                                    <div>

                                        <strong>
                                            ${escapeHTML(
                                                product.name
                                            )}
                                        </strong>

                                        <small>
                                            ID:
                                            ${escapeHTML(
                                                product.id
                                            )}
                                        </small>

                                    </div>

                                </div>

                            </td>


                            <td>
                                ${escapeHTML(
                                    product.category
                                )}
                            </td>


                            <td>
                                <strong>
                                    ${money(
                                        product.price
                                    )}
                                </strong>
                            </td>


                            <td>
                                <span class="${stockClass}">
                                    ${Number(
                                        product.stock || 0
                                    )}
                                </span>
                            </td>


                            <td>

                                <div class="action-group">

                                    <button
                                        class="table-action edit-btn"
                                        data-action="edit-product"
                                        data-id="${escapeHTML(
                                            product.id
                                        )}">
                                        Edit
                                    </button>


                                    <button
                                        class="table-action delete-btn"
                                        data-action="delete-product"
                                        data-id="${escapeHTML(
                                            product.id
                                        )}">
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    `;

                }).join("")}

            </tbody>

        </table>

    `;
}


/* ================= ADD PRODUCT ================= */

document
    .getElementById("addProductBtn")
    .addEventListener("click", () => {

        productForm.reset();

        document.getElementById(
            "productId"
        ).value = "";


        document.getElementById(
            "productModalTitle"
        ).textContent = "Add Product";


        productModal.classList.add("show");

    });


/* ================= EDIT PRODUCT ================= */

function editProduct(id) {

    const products = getProducts();


    const product =
        products.find(
            item => item.id === id
        );


    if (!product) {

        showToast(
            "Product not found"
        );

        return;
    }


    document.getElementById(
        "productId"
    ).value = product.id;


    document.getElementById(
        "productName"
    ).value = product.name || "";


    document.getElementById(
        "productCategory"
    ).value = product.category || "";


    document.getElementById(
        "productPrice"
    ).value = product.price || "";


    document.getElementById(
        "productOldPrice"
    ).value = product.oldPrice || "";


    document.getElementById(
        "productStock"
    ).value = product.stock ?? 0;


    document.getElementById(
        "productImage"
    ).value = product.image || "";


    document.getElementById(
        "productModalTitle"
    ).textContent = "Edit Product";


    productModal.classList.add("show");
}


/* ================= SAVE PRODUCT ================= */

productForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const id =
            document.getElementById(
                "productId"
            ).value.trim();


        const name =
            document.getElementById(
                "productName"
            ).value.trim();


        const category =
            document.getElementById(
                "productCategory"
            ).value;


        const price =
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            );


        const oldPrice =
            Number(
                document.getElementById(
                    "productOldPrice"
                ).value || 0
            );


        const stock =
            Number(
                document.getElementById(
                    "productStock"
                ).value
            );


        const image =
            document.getElementById(
                "productImage"
            ).value.trim();


        if (
            !name ||
            !category ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isFinite(stock) ||
            stock < 0
        ) {

            showToast(
                "Please enter valid product details"
            );

            return;
        }


        const products =
            getProducts();


        if (id) {

            const index =
                products.findIndex(
                    product =>
                        product.id === id
                );


            if (index === -1) {

                showToast(
                    "Product not found"
                );

                return;
            }


            products[index] = {
                ...products[index],
                name,
                category,
                price,
                oldPrice,
                stock,
                image
            };


            showToast(
                "Product updated successfully"
            );

        } else {

            const newId =
                createProductId(products);


            products.push({
                id: newId,
                name,
                price,
                oldPrice,
                category,
                image,
                stock
            });


            showToast(
                "Product added successfully"
            );
        }


        saveProducts(products);
syncProductToBackend(
    id,
    products.find(product => product.id === id) ||
    products[products.length - 1]
);
        closeProductModal();

        renderProducts();
        renderDashboard();


        window.dispatchEvent(
            new StorageEvent("storage", {
                key: PRODUCT_KEY
            })
        );

    }
);


/* ================= PRODUCT ID ================= */

function createProductId(products) {

    let number =
        products.length + 1;


    let id =
        "P" +
        String(number).padStart(3, "0");


    while (
        products.some(
            product =>
                product.id === id
        )
    ) {

        number++;

        id =
            "P" +
            String(number).padStart(3, "0");
    }


    return id;
}


/* ================= DELETE PRODUCT ================= */

function deleteProduct(id) {

    const products =
        getProducts();


    const product =
        products.find(
            item => item.id === id
        );


    if (!product) {
        return;
    }


    const confirmDelete =
        confirm(
            `Delete "${product.name}"?`
        );


    if (!confirmDelete) {
        return;
    }


    const updated =
        products.filter(
            item => item.id !== id
        );


    saveProducts(updated);


    /* Remove deleted product from cart */

    try {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    CART_KEY
                )
            ) || [];


        const updatedCart =
            cart.filter(item =>
                item.id !== id
            );


        localStorage.setItem(
            CART_KEY,
            JSON.stringify(updatedCart)
        );

    } catch {}


    /* Remove deleted product from wishlist */

    try {

        const wishlist =
            JSON.parse(
                localStorage.getItem(
                    WISHLIST_KEY
                )
            ) || [];


        const updatedWishlist =
            wishlist.filter(item => {

                if (
                    typeof item === "string"
                ) {
                    return item !== id;
                }

                return item.id !== id;
            });


        localStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify(
                updatedWishlist
            )
        );

    } catch {}


    renderProducts();
    renderDashboard();


    showToast(
        "Product deleted"
    );


    window.dispatchEvent(
        new StorageEvent("storage", {
            key: PRODUCT_KEY
        })
    );

    window.dispatchEvent(
        new StorageEvent("storage", {
            key: CART_KEY
        })
    );

    window.dispatchEvent(
        new StorageEvent("storage", {
            key: WISHLIST_KEY
        })
    );
}


/* ================= PRODUCT TABLE ACTIONS ================= */

productsTable.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) {
            return;
        }


        const id =
            button.dataset.id;


        const action =
            button.dataset.action;


        if (
            action === "edit-product"
        ) {
            editProduct(id);
        }


        if (
            action === "delete-product"
        ) {
            deleteProduct(id);
        }

    }
);


productSearch.addEventListener(
    "input",
    renderProducts
);


productCategoryFilter.addEventListener(
    "change",
    renderProducts
);


/* ================= PRODUCT MODAL ================= */

function closeProductModal() {

    productModal.classList.remove(
        "show"
    );
}


document
    .getElementById(
        "closeProductModal"
    )
    .addEventListener(
        "click",
        closeProductModal
    );


document
    .getElementById(
        "cancelProductBtn"
    )
    .addEventListener(
        "click",
        closeProductModal
    );


/* ================= ORDERS ================= */

function renderOrders() {

    let orders =
        getOrders();


    const search =
        orderSearch.value
            .trim()
            .toLowerCase();


    const status =
        orderStatusFilter.value;


    orders =
        orders
            .filter(order => {

                const searchable = `

                    ${order.orderId || ""}
                    ${order.name || ""}
                    ${order.phone || ""}
                    ${order.email || ""}

                `.toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(search);


                const matchesStatus =
                    status === "all" ||
                    order.status === status;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            })
            .reverse();


    if (!orders.length) {

        ordersTable.innerHTML = `
            <div class="empty-state">
                <strong>No orders found</strong>
                Orders will appear here after checkout.
            </div>
        `;

        return;
    }


    ordersTable.innerHTML = `

        <table class="admin-table">

            <thead>

                <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>

            </thead>


            <tbody>

                ${orders.map(order => `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    order.orderId
                                )}
                            </strong>
                        </td>


                        <td>

                            <strong>
                                ${escapeHTML(
                                    order.name ||
                                    "Customer"
                                )}
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(
                                    order.phone || ""
                                )}
                            </small>

                        </td>


                        <td>
                            ${escapeHTML(
                                order.date || ""
                            )}
                        </td>


                        <td>
                            <strong>
                                ${money(
                                    order.total
                                )}
                            </strong>
                        </td>


                        <td>

                            <select
                                class="status-select"
                                data-order-status="${escapeHTML(
                                    order.orderId
                                )}">

                                ${[
                                    "Order Placed",
                                    "Processing",
                                    "Shipped",
                                    "Delivered",
                                    "Cancelled"
                                ].map(
                                    statusOption => `

                                        <option
                                            value="${statusOption}"
                                            ${
                                                (
                                                    order.status ||
                                                    "Order Placed"
                                                ) ===
                                                statusOption
                                                    ? "selected"
                                                    : ""
                                            }>
                                            ${statusOption}
                                        </option>

                                    `
                                ).join("")}

                            </select>

                        </td>


                        <td>

                            <div class="action-group">

                                <button
                                    class="table-action view-order-btn"
                                    data-view-order="${escapeHTML(
                                        order.orderId
                                    )}">
                                    View
                                </button>


                                <button
                                    class="table-action delete-btn"
                                    data-delete-order="${escapeHTML(
                                        order.orderId
                                    )}">
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;
}


/* ================= ORDER STOCK HELPERS ================= */

function getOrderItems(order) {

    return Array.isArray(order.items)
        ? order.items
        : [];
}


function restoreOrderStock(order) {

    const items =
        getOrderItems(order);


    if (!items.length) {
        return;
    }


    const products =
        getProducts();


    items.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.id
            );


        if (!product) {
            return;
        }


        product.stock =
            Number(product.stock || 0) +
            Number(item.qty || 1);

    });


    saveProducts(products);
}


function reserveOrderStock(order) {

    const items =
        getOrderItems(order);


    if (!items.length) {
        return true;
    }


    const products =
        getProducts();


    /* First check stock */

    for (const item of items) {

        const product =
            products.find(
                product =>
                    product.id === item.id
            );


        if (!product) {
            return false;
        }


        const qty =
            Number(item.qty || 1);


        if (
            Number(product.stock || 0) <
            qty
        ) {
            return false;
        }
    }


    /* Then reduce stock */

    items.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id === item.id
            );


        if (!product) {
            return;
        }


        product.stock =
            Math.max(
                0,
                Number(product.stock || 0) -
                Number(item.qty || 1)
            );

    });


    saveProducts(products);

    return true;
}


/* ================= ORDER STATUS ================= */

ordersTable.addEventListener(
    "change",
    event => {

        const select =
            event.target.closest(
                "[data-order-status]"
            );


        if (!select) {
            return;
        }


        const orderId =
            select.dataset.orderStatus;


        const newStatus =
            select.value;


        const orders =
            getOrders();


        const order =
            orders.find(
                item =>
                    item.orderId === orderId
            );


        if (!order) {
            return;
        }


        const oldStatus =
            order.status ||
            "Order Placed";


        if (
            oldStatus === newStatus
        ) {
            return;
        }


        /* Active → Cancelled */

        if (
            oldStatus !== "Cancelled" &&
            newStatus === "Cancelled"
        ) {

            restoreOrderStock(order);

        }


        /* Cancelled → Active */

        if (
            oldStatus === "Cancelled" &&
            newStatus !== "Cancelled"
        ) {

            const success =
                reserveOrderStock(order);


            if (!success) {

                select.value =
                    "Cancelled";


                showToast(
                    "Not enough stock to reopen this order."
                );

                return;
            }
        }


        order.status =
            newStatus;


        saveOrders(orders);


        renderOrders();
        renderDashboard();


        showToast(
            "Order status updated"
        );


        window.dispatchEvent(
            new StorageEvent("storage", {
                key: ORDER_KEY
            })
        );


        window.dispatchEvent(
            new StorageEvent("storage", {
                key: PRODUCT_KEY
            })
        );

    }
);


/* ================= VIEW / DELETE ORDER ================= */

ordersTable.addEventListener(
    "click",
    event => {

        const viewButton =
            event.target.closest(
                "[data-view-order]"
            );


        if (viewButton) {

            openOrderDetails(
                viewButton.dataset.viewOrder
            );

            return;
        }


        const deleteButton =
            event.target.closest(
                "[data-delete-order]"
            );


        if (deleteButton) {

            deleteOrder(
                deleteButton.dataset.deleteOrder
            );

        }

    }
);


/* ================= DELETE ORDER ================= */

function deleteOrder(orderId) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                item.orderId === orderId
        );


    if (!order) {

        showToast(
            "Order not found"
        );

        return;
    }


    const confirmed =
        confirm(
            `Delete order "${orderId}"?`
        );


    if (!confirmed) {
        return;
    }


    /* Restore stock only if order is active */

    if (
        order.status !== "Cancelled"
    ) {
        restoreOrderStock(order);
    }


    const updated =
        orders.filter(
            item =>
                item.orderId !== orderId
        );


    saveOrders(updated);


    renderOrders();
    renderDashboard();
    renderCustomers();


    showToast(
        "Order deleted"
    );


    window.dispatchEvent(
        new StorageEvent("storage", {
            key: ORDER_KEY
        })
    );


    window.dispatchEvent(
        new StorageEvent("storage", {
            key: PRODUCT_KEY
        })
    );
}


/* ================= ORDER DETAILS ================= */

function openOrderDetails(orderId) {

    const orders =
        getOrders();


    const order =
        orders.find(
            item =>
                item.orderId === orderId
        );


    if (!order) {

        showToast(
            "Order not found"
        );

        return;
    }


    const items =
        getOrderItems(order);


    document.getElementById(
        "orderModalId"
    ).textContent =
        "Order ID: " +
        order.orderId;


    document.getElementById(
        "orderDetailsContent"
    ).innerHTML = `

        <div class="order-details">

            <div class="order-info-grid">

                <div class="info-box">
                    <span>Customer</span>
                    <strong>
                        ${escapeHTML(
                            order.name ||
                            "Customer"
                        )}
                    </strong>
                </div>


                <div class="info-box">
                    <span>Phone</span>
                    <strong>
                        ${escapeHTML(
                            order.phone || "-"
                        )}
                    </strong>
                </div>


                <div class="info-box">
                    <span>Email</span>
                    <strong>
                        ${escapeHTML(
                            order.email || "-"
                        )}
                    </strong>
                </div>


                <div class="info-box">
                    <span>Payment</span>
                    <strong>
                        ${escapeHTML(
                            order.payment ||
                            order.paymentMethod ||
                            "-"
                        )}
                    </strong>
                </div>


                <div class="info-box">
                    <span>Address</span>
                    <strong>
                        ${escapeHTML(
                            order.address || "-"
                        )}
                    </strong>
                </div>


                <div class="info-box">
                    <span>City / Pincode</span>
                    <strong>
                        ${escapeHTML(
                            order.city || "-"
                        )}
                        -
                        ${escapeHTML(
                            order.pincode || "-"
                        )}
                    </strong>
                </div>


                <div class="info-box">
                    <span>Status</span>
                    <strong>
                        ${escapeHTML(
                            order.status ||
                            "Order Placed"
                        )}
                    </strong>
                </div>


                <div class="info-box">
                    <span>Date</span>
                    <strong>
                        ${escapeHTML(
                            order.date || "-"
                        )}
                    </strong>
                </div>

            </div>


            <div class="order-items">

                ${items.length

                    ? items.map(item => `

                        <div class="order-item">

                            <div>

                                <div class="order-item-name">
                                    ${escapeHTML(
                                        item.name ||
                                        "Product"
                                    )}
                                </div>

                                <small>
                                    Qty:
                                    ${Number(
                                        item.qty || 1
                                    )}
                                </small>

                            </div>


                            <strong>
                                ${money(
                                    Number(
                                        item.price || 0
                                    ) *
                                    Number(
                                        item.qty || 1
                                    )
                                )}
                            </strong>

                        </div>

                    `).join("")

                    : `

                        <div class="empty-state">
                            No item information available.
                        </div>

                    `
                }


                <div class="order-total">

                    <span>Total</span>

                    <span>
                        ${money(
                            order.total
                        )}
                    </span>

                </div>

            </div>

        </div>

    `;


    orderModal.classList.add(
        "show"
    );
}


document
    .getElementById(
        "closeOrderModal"
    )
    .addEventListener(
        "click",
        () =>
            orderModal.classList.remove(
                "show"
            )
    );


/* ================= ORDER FILTER ================= */

orderSearch.addEventListener(
    "input",
    renderOrders
);


orderStatusFilter.addEventListener(
    "change",
    renderOrders
);


/* ================= CUSTOMERS ================= */

function renderCustomers() {

    const orders =
        getOrders();


    const customers =
        new Map();


    orders.forEach(order => {

        const key =
            String(
                order.email || ""
            )
                .trim()
                .toLowerCase()
            ||
            String(
                order.phone || ""
            )
                .trim()
            ||
            String(
                order.name || ""
            )
                .trim()
                .toLowerCase();


        if (!key) {
            return;
        }


        if (!customers.has(key)) {

            customers.set(
                key,
                {
                    name:
                        order.name ||
                        "Customer",

                    email:
                        order.email ||
                        "-",

                    phone:
                        order.phone ||
                        "-",

                    orders: 0,

                    spent: 0
                }
            );

        }


        const customer =
            customers.get(key);


        customer.orders += 1;


        if (
            order.status !==
            "Cancelled"
        ) {

            customer.spent +=
                Number(
                    order.total || 0
                );

        }

    });


    const list =
        [...customers.values()];


    if (!list.length) {

        customersTable.innerHTML = `
            <div class="empty-state">
                <strong>No customers yet</strong>
                Customer information will appear after orders.
            </div>
        `;

        return;
    }


    customersTable.innerHTML = `

        <table class="admin-table">

            <thead>

                <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                </tr>

            </thead>


            <tbody>

                ${list.map(customer => `

                    <tr>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    customer.name
                                )}
                            </strong>
                        </td>


                        <td>
                            ${escapeHTML(
                                customer.email
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                customer.phone
                            )}
                        </td>


                        <td>
                            ${customer.orders}
                        </td>


                        <td>
                            <strong>
                                ${money(
                                    customer.spent
                                )}
                            </strong>
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;
}


/* ================= SETTINGS ================= */

/* ================= SETTINGS ================= */

function loadSettings() {

    try {

        const settings =
            JSON.parse(
                localStorage.getItem(
                    STORE_SETTINGS_KEY
                )
            ) || {};

        document.getElementById(
            "storeName"
        ).value =
            settings.storeName ||
            "VJora";

        document.getElementById(
            "storeEmail"
        ).value =
            settings.storeEmail ||
            "";

        document.getElementById(
            "storePhone"
        ).value =
            settings.storePhone ||
            "";

        /* Load UPI ID */

        const savedUpi =
            settings.upiId ||
            localStorage.getItem("vjoraUpiId") ||
            "";

        const upiInput =
            document.getElementById("storeUpiId");

        if (upiInput) {
            upiInput.value = savedUpi;
        }

    } catch {

        document.getElementById(
            "storeName"
        ).value = "VJora";

        const upiInput =
            document.getElementById("storeUpiId");

        if (upiInput) {
            upiInput.value =
                localStorage.getItem("vjoraUpiId") || "";
        }
    }
}


document
    .getElementById(
        "saveSettingsBtn"
    )
    .addEventListener(
        "click",
        () => {

            const upiInput =
                document.getElementById("storeUpiId");

            const upiId =
                upiInput
                    ? upiInput.value.trim()
                    : "";

            const settings = {

                storeName:
                    document.getElementById(
                        "storeName"
                    ).value.trim() ||
                    "VJora",

                storeEmail:
                    document.getElementById(
                        "storeEmail"
                    ).value.trim(),

                storePhone:
                    document.getElementById(
                        "storePhone"
                    ).value.trim(),

                upiId: upiId
            };


            /* Save complete store settings */

            localStorage.setItem(
                STORE_SETTINGS_KEY,
                JSON.stringify(settings)
            );


            /* Save UPI separately for public checkout */

            localStorage.setItem(
                "vjoraUpiId",
                upiId
            );


            showToast(
                "Settings & UPI ID saved successfully"
            );


            /* Notify other pages/tabs */

            window.dispatchEvent(
                new StorageEvent(
                    "storage",
                    {
                        key:
                            STORE_SETTINGS_KEY
                    }
                )
            );


            window.dispatchEvent(
                new StorageEvent(
                    "storage",
                    {
                        key:
                            "vjoraUpiId"
                    }
                )
            );

        }
    );


/* ================= EXPORT DATA ================= */

document
    .getElementById(
        "exportDataBtn"
    )
    .addEventListener(
        "click",
        () => {

            const data = {

                products:
                    getProducts(),

                orders:
                    getOrders(),

                settings:
                    JSON.parse(
                        localStorage.getItem(
                            STORE_SETTINGS_KEY
                        ) || "{}"
                    ),

                exportedAt:
                    new Date().toISOString()

            };


            const blob =
                new Blob(
                    [
                        JSON.stringify(
                            data,
                            null,
                            2
                        )
                    ],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const a =
                document.createElement(
                    "a"
                );


            a.href = url;

            a.download =
                "vjora-store-backup.json";


            document.body.appendChild(a);

            a.click();

            a.remove();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Store data exported"
            );

        }
    );


/* ================= RESET DEMO PRODUCTS ================= */

document
    .getElementById(
        "resetProductsBtn"
    )
    .addEventListener(
        "click",
        () => {

            const confirmReset =
                confirm(
                    "Reset products to the original VJora demo products?"
                );


            if (!confirmReset) {
                return;
            }


            const demoProducts = [

                {
                    id: "P001",
                    name: "Golden Chain",
                    price: 249,
                    oldPrice: 399,
                    category: "Accessories",
                    image: "images/golden-chain.jpg",
                    stock: 20
                },


                {
                    id: "P002",
                    name: "Methi Hair Oil",
                    price: 199,
                    oldPrice: 399,
                    category: "Beauty",
                    image: "images/methi-hair-oil.jpg",
                    stock: 20
                },


                {
                    id: "P003",
                    name: "Oxidized Silver Jhumkas",
                    price: 299,
                    oldPrice: 599,
                    category: "Accessories",
                    image: "images/jhumka.jpg",
                    stock: 20
                },


                {
                    id: "P004",
                    name: "Premium T-Shirt",
                    price: 299,
                    oldPrice: 699,
                    category: "Fashion",
                    image: "images/tshirt.jpg",
                    stock: 20
                },


                {
                    id: "P005",
                    name: "Face Wash",
                    price: 399,
                    oldPrice: 699,
                    category: "Beauty",
                    image: "images/face-wash.jpg",
                    stock: 20
                },


                {
                    id: "P006",
                    name: "Men's Sports Shoes",
                    price: 599,
                    oldPrice: 999,
                    category: "Sports",
                    image: "images/sports-shoes.jpg",
                    stock: 20
                },


                {
                    id: "P007",
                    name: "Bluetooth Speaker",
                    price: 499,
                    oldPrice: 799,
                    category: "Electronics",
                    image: "images/bluetooth-speaker.jpg",
                    stock: 20
                },


                {
                    id: "P008",
                    name: "Fast USB Charger",
                    price: 299,
                    oldPrice: 499,
                    category: "Electronics",
                    image: "images/usb-charger.jpg",
                    stock: 20
                },


                {
                    id: "P009",
                    name: "Premium Water Bottle",
                    price: 199,
                    oldPrice: 349,
                    category: "Home",
                    image: "images/water-bottle.jpg",
                    stock: 20
                },


                {
                    id: "P010",
                    name: "Modern Table Lamp",
                    price: 399,
                    oldPrice: 699,
                    category: "Home",
                    image: "images/table-lamp.jpg",
                    stock: 20
                },


                {
                    id: "P011",
                    name: "Men's Casual Shirt",
                    price: 449,
                    oldPrice: 899,
                    category: "Fashion",
                    image: "images/casual-shirt.jpg",
                    stock: 20
                },


                {
                    id: "P012",
                    name: "Premium Men's Wallet",
                    price: 249,
                    oldPrice: 499,
                    category: "Accessories",
                    image: "images/wallet.jpg",
                    stock: 20
                }

            ];


            saveProducts(
                demoProducts
            );


            renderProducts();
            renderDashboard();


            showToast(
                "Demo products restored"
            );


            window.dispatchEvent(
                new StorageEvent(
                    "storage",
                    {
                        key:
                            PRODUCT_KEY
                    }
                )
            );

        }
    );


/* ================= LOGOUT ================= */

document
    .getElementById(
        "adminLogoutBtn"
    )
    .addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            sessionStorage.removeItem(
                "vjoraAdminLoggedIn"
            );


            showToast(
                "Logged out successfully"
            );


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 500);

        }
    );


/* ================= MODAL OUTSIDE CLICK ================= */

productModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            productModal
        ) {
            closeProductModal();
        }

    }
);


orderModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            orderModal
        ) {

            orderModal.classList.remove(
                "show"
            );

        }

    }
);


/* ================= ESC KEY ================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") {
            return;
        }


        closeProductModal();


        orderModal.classList.remove(
            "show"
        );

    }
);


/* ================= STORAGE SYNC ================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === PRODUCT_KEY ||
            event.key === ORDER_KEY ||
            event.key === CART_KEY ||
            event.key === WISHLIST_KEY
        ) {

            renderDashboard();
            renderProducts();
            renderOrders();
            renderCustomers();

        }

    }
);


/* ================= INITIALIZE ================= */

function initializeAdmin() {

    loadSettings();

    renderDashboard();
    renderProducts();
    renderOrders();
    renderCustomers();

}


/* ================= START ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        protectAdminPanel();

        if (isAdminLoggedIn()) {
            initializeAdmin();
        }

    }
);