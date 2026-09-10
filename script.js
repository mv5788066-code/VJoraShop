/* =========================================================
   VJoraShop - Main Store JavaScript
   Customer Website + Admin Shared LocalStorage
   ========================================================= */

const PRODUCT_KEY = "vjoraProducts";
const ORDER_KEY = "vjoraOrders";
const CART_KEY = "vjoraCart";
const WISHLIST_KEY = "vjoraWishlist";
const USER_KEY = "vjoraUser";

const PENDING_CHECKOUT_KEY = "vjoraPendingCheckout";
const PENDING_BUY_NOW_KEY = "vjoraPendingBuyNow";
const UPI_KEY = "vjoraUpiId";


/* =========================================================
   DEFAULT PRODUCTS
   ========================================================= */

const defaultProducts = [
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


/* =========================================================
   DOM
   ========================================================= */

const productGrid = document.getElementById("productGrid");
const newArrivalsGrid = document.getElementById("newArrivalsGrid");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const productSectionTitle =
    document.getElementById("productSectionTitle");

const noProducts =
    document.getElementById("noProducts");

const clearFilterBtn =
    document.getElementById("clearFilterBtn");

const emptyResetBtn =
    document.getElementById("emptyResetBtn");

const cartOverlay =
    document.getElementById("cartOverlay");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const cartCount =
    document.getElementById("cartCount");

const wishlistCount =
    document.getElementById("wishlistCount");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================================
   SAFE JSON
   ========================================================= */

function safeJSON(value, fallback = null) {
    try {
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}


/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */

function getProducts() {
    const saved = localStorage.getItem(PRODUCT_KEY);

    if (!saved) {
        localStorage.setItem(
            PRODUCT_KEY,
            JSON.stringify(defaultProducts)
        );

        return [...defaultProducts];
    }

    const parsed = safeJSON(saved, null);

    if (!Array.isArray(parsed)) {
        localStorage.setItem(
            PRODUCT_KEY,
            JSON.stringify(defaultProducts)
        );

        return [...defaultProducts];
    }

    return parsed;
}


function saveProducts(products) {
    localStorage.setItem(
        PRODUCT_KEY,
        JSON.stringify(products)
    );
}


function getCart() {
    const cart = safeJSON(
        localStorage.getItem(CART_KEY),
        []
    );

    return Array.isArray(cart) ? cart : [];
}


function saveCart(cart) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


function getWishlist() {
    const list = safeJSON(
        localStorage.getItem(WISHLIST_KEY),
        []
    );

    return Array.isArray(list) ? list : [];
}


function saveWishlist(list) {
    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(list)
    );
}


function getOrders() {
    const orders = safeJSON(
        localStorage.getItem(ORDER_KEY),
        []
    );

    return Array.isArray(orders) ? orders : [];
}


function saveOrders(orders) {
    localStorage.setItem(
        ORDER_KEY,
        JSON.stringify(orders)
    );
}


/* =========================================================
   MONEY
   ========================================================= */

function money(value) {
    const amount = Number(value) || 0;

    return "₹" + amount.toLocaleString("en-IN");
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(message) {
    if (!toast || !toastMessage) {
        alert(message);
        return;
    }

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}


/* =========================================================
   IMAGE FALLBACK
   ========================================================= */

function imageFallback(img) {
    if (!img) return;

    img.onerror = function () {
        this.onerror = null;

        this.src =
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="600"
                     height="600"
                     viewBox="0 0 600 600">

                    <rect width="600"
                          height="600"
                          fill="#eef1f6"/>

                    <text x="300"
                          y="285"
                          text-anchor="middle"
                          font-family="Arial"
                          font-size="28"
                          font-weight="bold"
                          fill="#08152f">
                        VJoraShop
                    </text>

                    <text x="300"
                          y="325"
                          text-anchor="middle"
                          font-family="Arial"
                          font-size="18"
                          fill="#667085">
                        Product Image
                    </text>

                </svg>
            `);
    };
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   PRODUCT RENDER
   ========================================================= */
function productCard(product) {
    const productId = String(product.id || "");
    const wishlist = getWishlist().includes(productId);
    const price = Math.max(0, Number(product.price) || 0);
    const oldPrice = Math.max(0, Number(product.oldPrice) || 0);
    const stock = Math.max(0, Number(product.stock) || 0);
    const discount = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    return `
        <article class="product-card">
            <div class="product-img">
                ${discount > 0 ? `<span class="product-badge">${discount}% OFF</span>` : ""}
                <button type="button" class="wishlist-product-btn ${wishlist ? "active" : ""}" data-action="wishlist" data-id="${escapeHTML(productId)}">
                    ${wishlist ? "♥" : "♡"}
                </button>
                <img src="${escapeHTML(product.image || "")}" alt="${escapeHTML(product.name)}" onerror="imageFallback(this)">
            </div>
            <div class="product-body">
                <span class="product-category">${escapeHTML(product.category)}</span>
                <h3>${escapeHTML(product.name)}</h3>
                <div class="product-price">
                    <strong>${money(price)}</strong>
                    ${oldPrice > price ? `<del>${money(oldPrice)}</del>` : ""}
                </div>
                ${discount > 0 ? `<span class="product-discount">Save ${discount}%</span>` : ""}
                <div class="stock-status ${stock <= 0 ? "out-of-stock" : ""}">${stock > 0 ? `${stock} available` : "Out of stock"}</div>
                <div class="product-actions">
                    <button type="button" class="product-details-btn" data-action="view" data-id="${escapeHTML(productId)}">View Details</button>
                    <button type="button" class="add-cart-btn" data-action="cart" data-id="${escapeHTML(productId)}" ${stock <= 0 ? "disabled" : ""}>
                        ${stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                    ${stock > 0 ? `<button type="button" class="buy-now-btn" data-action="buy-now" data-id="${escapeHTML(productId)}">Buy Now</button>` : ""}
                </div>
            </div>
        </article>
    `;
}

/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(
    list,
    title = "Popular Products"
) {
    if (!productGrid) return;

    if (productSectionTitle) {
        productSectionTitle.textContent = title;
    }

    if (!Array.isArray(list) || !list.length) {

        productGrid.innerHTML = "";

        if (noProducts) {
            noProducts.style.display = "block";
        }

        return;
    }

    if (noProducts) {
        noProducts.style.display = "none";
    }

    productGrid.innerHTML =
        list.map(productCard).join("");
}


/* =========================================================
   NEW ARRIVALS
   ========================================================= */

function renderNewArrivals() {

    if (!newArrivalsGrid) return;

    const products = getProducts();

    const latest = [...products]
        .slice(-4)
        .reverse();

    newArrivalsGrid.innerHTML =
        latest.map(productCard).join("");
}


/* =========================================================
   SHOW ALL
   ========================================================= */

function showAllProducts() {

    renderProducts(
        getProducts(),
        "Popular Products"
    );

    if (clearFilterBtn) {
        clearFilterBtn.style.display = "none";
    }

    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

function filterCategory(category) {

    const products = getProducts();

    const target =
        String(category || "").toLowerCase();

    const filtered = products.filter(product =>
        String(product.category || "")
            .toLowerCase() === target
    );

    renderProducts(
        filtered,
        category
    );

    if (clearFilterBtn) {
        clearFilterBtn.style.display = "inline-block";
    }

    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchProducts() {

    if (!searchInput) return;

    const query =
        searchInput.value.trim().toLowerCase();

    if (!query) {
        showAllProducts();
        return;
    }

    const products = getProducts();

    const result = products.filter(product => {

        const name =
            String(product.name || "").toLowerCase();

        const category =
            String(product.category || "").toLowerCase();

        return (
            name.includes(query) ||
            category.includes(query)
        );
    });

    renderProducts(
        result,
        `Search Results: "${searchInput.value.trim()}"`
    );

    if (clearFilterBtn) {
        clearFilterBtn.style.display = "inline-block";
    }

    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {

    const products = getProducts();

    const product =
        products.find(p => p.id === productId);

    if (!product) {
        showToast("Product not found.");
        return;
    }

    const stock =
        Math.max(0, Number(product.stock) || 0);

    if (stock <= 0) {
        showToast("Product is out of stock.");
        return;
    }

    const cart = getCart();

    const existing =
        cart.find(item => item.id === productId);

    if (existing) {

        const currentQty =
            Math.max(0, Number(existing.qty) || 0);

        if (currentQty >= stock) {
            showToast(
                `Only ${stock} item(s) available.`
            );
            return;
        }

        existing.qty = currentQty + 1;

    } else {

        cart.push({
            id: productId,
            qty: 1
        });
    }

    saveCart(cart);

    updateCartUI();

    showToast("Product added to cart.");
}


/* =========================================================
   UPDATE CART QUANTITY
   ========================================================= */

function updateCartQuantity(
    productId,
    change
) {

    const cart = getCart();

    const item =
        cart.find(i => i.id === productId);

    if (!item) return;

    const product =
        getProducts().find(
            p => p.id === productId
        );

    if (!product) return;

    let qty =
        Math.max(0, Number(item.qty) || 0);

    qty += Number(change) || 0;

    if (qty <= 0) {

        const index =
            cart.findIndex(
                i => i.id === productId
            );

        if (index >= 0) {
            cart.splice(index, 1);
        }

    } else {

        const stock =
            Math.max(0, Number(product.stock) || 0);

        if (qty > stock) {

            qty = stock;

            showToast(
                `Only ${stock} available.`
            );
        }

        if (qty <= 0) {

            const index =
                cart.findIndex(
                    i => i.id === productId
                );

            if (index >= 0) {
                cart.splice(index, 1);
            }

        } else {

            item.qty = qty;
        }
    }

    saveCart(cart);

    updateCartUI();
}


/* =========================================================
   REMOVE CART ITEM
   ========================================================= */

function removeFromCart(productId) {

    const cart =
        getCart().filter(
            item => item.id !== productId
        );

    saveCart(cart);

    updateCartUI();

    showToast("Product removed from cart.");
}


/* =========================================================
   CART TOTAL
   ========================================================= */

function cartTotalAmount() {

    const cart = getCart();

    const products = getProducts();

    return cart.reduce((total, item) => {

        const product =
            products.find(
                p => p.id === item.id
            );

        if (!product) {
            return total;
        }

        return total +
            (Number(product.price) || 0) *
            (Number(item.qty) || 0);

    }, 0);
}


/* =========================================================
   CART UI
   ========================================================= */

function updateCartUI() {

    if (!cartItems || !cartTotal || !cartCount) {
        return;
    }

    const cart = getCart();

    const products = getProducts();

    let totalItems = 0;

    cart.forEach(item => {
        totalItems +=
            Math.max(0, Number(item.qty) || 0);
    });

    cartCount.textContent = totalItems;


    if (!cart.length) {

        cartItems.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>Your Cart is Empty</h3>

                <p>
                    Add some products to continue shopping.
                </p>

            </div>
        `;

        cartTotal.textContent =
            money(0);

        return;
    }


    cartItems.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    p => p.id === item.id
                );

            if (!product) {
                return "";
            }

            const qty =
                Math.max(1, Number(item.qty) || 1);

            return `
                <div class="cart-item">

                    <div class="cart-item-img">

                        <img
                            src="${escapeHTML(product.image || "")}"
                            alt="${escapeHTML(product.name)}"
                            onerror="imageFallback(this)"
                        >

                    </div>


                    <div>

                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        <p>
                            ${money(product.price)}
                        </p>


                        <div class="qty-control">

                            <button
                                type="button"
                                data-cart-action="minus"
                                data-id="${escapeHTML(product.id)}"
                            >
                                −
                            </button>

                            <strong>
                                ${qty}
                            </strong>

                            <button
                                type="button"
                                data-cart-action="plus"
                                data-id="${escapeHTML(product.id)}"
                            >
                                +
                            </button>

                        </div>


                        <button
                            type="button"
                            class="remove-cart"
                            data-cart-action="remove"
                            data-id="${escapeHTML(product.id)}"
                        >
                            Remove
                        </button>

                    </div>


                    <strong>
                        ${money(
                            Number(product.price) * qty
                        )}
                    </strong>

                </div>
            `;

        }).join("");


    cartTotal.textContent =
        money(cartTotalAmount());
}


/* =========================================================
   WISHLIST
   ========================================================= */

function toggleWishlist(productId) {

    const list = getWishlist();

    const index =
        list.indexOf(productId);

    if (index >= 0) {

        list.splice(index, 1);

        showToast(
            "Removed from wishlist."
        );

    } else {

        list.push(productId);

        showToast(
            "Added to wishlist."
        );
    }

    saveWishlist(list);

    updateWishlistUI();

    refreshCurrentProducts();
}


function updateWishlistUI() {

    if (!wishlistCount) return;

    wishlistCount.textContent =
        getWishlist().length;
}


/* =========================================================
   REFRESH CURRENT PRODUCTS
   ========================================================= */

function refreshCurrentProducts() {

    if (!productSectionTitle) {
        showAllProducts();
        return;
    }

    const title =
        productSectionTitle.textContent || "";


    if (title.startsWith("Search Results:")) {

        searchProducts();

        return;
    }


    const categoryExists =
        getProducts().some(
            p =>
                String(p.category) ===
                String(title)
        );

    if (categoryExists) {

        filterCategory(title);

        return;
    }


    if (title === "❤️ My Wishlist") {

        const list =
            getWishlist();

        const products =
            getProducts().filter(
                product =>
                    list.includes(product.id)
            );

        renderProducts(
            products,
            "❤️ My Wishlist"
        );

        return;
    }


    renderProducts(
        getProducts(),
        "Popular Products"
    );

    renderNewArrivals();
}


/* =========================================================
   PRODUCT DETAILS
   ========================================================= */

function openProductDetails(productId) {

    const product =
        getProducts().find(
            p => p.id === productId
        );

    if (!product) return;

    const detailsContent =
        document.getElementById(
            "detailsContent"
        );

    if (!detailsContent) return;

    const price =
        Number(product.price) || 0;

    const oldPrice =
        Number(product.oldPrice) || 0;

    const stock =
        Math.max(0, Number(product.stock) || 0);

    const discount =
        oldPrice > price
            ? Math.round(
                ((oldPrice - price) / oldPrice) * 100
            )
            : 0;


    detailsContent.innerHTML = `

        <div class="details-product">

            <div class="details-image">

                <img
                    src="${escapeHTML(product.image || "")}"
                    alt="${escapeHTML(product.name)}"
                    onerror="imageFallback(this)"
                >

            </div>


            <div class="details-info">

                <span class="section-label">
                    ${escapeHTML(product.category)}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>

                <p>
                    Premium quality product from
                    VJoraShop.
                </p>


                <div class="details-price">

                    ${money(price)}

                    ${
                        oldPrice > price
                            ? `
                                <del style="
                                    color:#98a2b3;
                                    font-size:14px;
                                    margin-left:8px;
                                ">
                                    ${money(oldPrice)}
                                </del>
                              `
                            : ""
                    }

                </div>


                ${
                    discount
                        ? `
                            <div class="discount">
                                ${discount}% OFF
                            </div>
                          `
                        : ""
                }


                <p style="margin-top:15px;">

                    ${
                        stock > 0
                            ? `Stock Available: ${stock}`
                            : "Currently Out of Stock"
                    }

                </p>


                <div
                    style="
                        display:flex;
                        gap:10px;
                        flex-wrap:wrap;
                        margin-top:15px;
                    "
                >

                    <button
                        type="button"
                        class="primary-btn"
                        data-details-cart="${escapeHTML(product.id)}"
                        ${stock <= 0 ? "disabled" : ""}
                    >
                        ${
                            stock > 0
                                ? "Add to Cart"
                                : "Out of Stock"
                        }
                    </button>

                    ${
                        stock > 0
                            ? `
                                <button
                                    type="button"
                                    class="outline-btn"
                                    data-details-buy="${escapeHTML(product.id)}"
                                >
                                    Buy Now
                                </button>
                              `
                            : ""
                    }

                </div>

            </div>

        </div>

    `;


    openModal(
        document.getElementById(
            "detailsModal"
        )
    );
}


/* =========================================================
   MODAL HELPERS
   ========================================================= */

function openModal(element) {

    if (!element) return;

    element.style.display = "flex";

    document.body.style.overflow = "hidden";
}


function closeModal(element) {

    if (!element) return;

    element.style.display = "none";

    document.body.style.overflow = "";
}


/* =========================================================
   ACCOUNT
   ========================================================= */

function renderAccount() {

    const accountContent =
        document.getElementById(
            "accountContent"
        );

    if (!accountContent) return;

    const userRaw =
        localStorage.getItem(USER_KEY);


    if (!userRaw) {

        accountContent.innerHTML = `

            <span class="section-label">
                ACCOUNT
            </span>

            <h2>
                Welcome to VJoraShop
            </h2>

            <p>
                Login to view your account and orders.
            </p>


            <form
                id="loginForm"
                class="account-form"
            >

                <input
                    type="text"
                    id="loginName"
                    placeholder="Your Name"
                    required
                >

                <input
                    type="email"
                    id="loginEmail"
                    placeholder="Email Address"
                    required
                >

                <button
                    type="submit"
                    class="primary-btn"
                >
                    Login
                </button>

            </form>

        `;


        document
            .getElementById("loginForm")
            ?.addEventListener(
                "submit",
                loginUser
            );

        return;
    }


    const parsedUser =
        safeJSON(userRaw, null);

    if (!parsedUser) {

        localStorage.removeItem(USER_KEY);

        renderAccount();

        return;
    }


    const orders =
        getOrders().filter(
            order =>
                String(
                    order.email ||
                    order.userEmail ||
                    ""
                ).toLowerCase() ===
                String(parsedUser.email || "")
                    .toLowerCase()
        );


    accountContent.innerHTML = `

        <span class="section-label">
            MY ACCOUNT
        </span>

        <h2>
            Hello, ${escapeHTML(parsedUser.name)}
        </h2>

        <p>
            ${escapeHTML(parsedUser.email)}
        </p>


        <div style="
            margin-top:20px;
            display:grid;
            gap:10px;
        ">

            <button
                type="button"
                class="primary-btn"
                id="accountOrdersBtn"
            >
                📦 My Orders (${orders.length})
            </button>

            <button
                type="button"
                class="outline-btn"
                id="logoutBtn"
            >
                Logout
            </button>

        </div>

    `;


    document
        .getElementById("accountOrdersBtn")
        ?.addEventListener(
            "click",
            () => {

                closeModal(
                    document.getElementById(
                        "accountModal"
                    )
                );

                openOrders();
            }
        );


    document
        .getElementById("logoutBtn")
        ?.addEventListener(
            "click",
            logoutUser
        );
}


/* =========================================================
   LOGIN
   ========================================================= */

function loginUser(event) {

    event.preventDefault();

    const nameInput =
        document.getElementById("loginName");

    const emailInput =
        document.getElementById("loginEmail");

    if (!nameInput || !emailInput) {
        return;
    }

    const name =
        nameInput.value.trim();

    const email =
        emailInput.value.trim().toLowerCase();


    if (!name || !email) {
        showToast("Please fill all details.");
        return;
    }


    localStorage.setItem(
        USER_KEY,
        JSON.stringify({
            name,
            email
        })
    );


    showToast("Login successful.");


    const pendingBuyNow =
        safeJSON(
            sessionStorage.getItem(
                PENDING_BUY_NOW_KEY
            ),
            null
        );


    const pendingCheckout =
        sessionStorage.getItem(
            PENDING_CHECKOUT_KEY
        ) === "true";


    sessionStorage.removeItem(
        PENDING_CHECKOUT_KEY
    );


    closeModal(
        document.getElementById(
            "accountModal"
        )
    );


    if (pendingBuyNow) {

        openCheckout(
            pendingBuyNow,
            true
        );

        return;
    }


    if (pendingCheckout) {

        openCheckout(
            null,
            false
        );

        return;
    }


    renderAccount();
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    localStorage.removeItem(USER_KEY);

    showToast("Logged out.");

    renderAccount();
}


/* =========================================================
   BUY NOW
   ========================================================= */

function buyNow(productId) {

    const product =
        getProducts().find(
            p => p.id === productId
        );

    if (!product) {
        showToast("Product not found.");
        return;
    }


    const stock =
        Math.max(
            0,
            Number(product.stock) || 0
        );


    if (stock <= 0) {

        showToast(
            "Product is out of stock."
        );

        return;
    }


    const buyNowItem = {
        id: product.id,
        qty: 1
    };


    sessionStorage.setItem(
        PENDING_BUY_NOW_KEY,
        JSON.stringify(buyNowItem)
    );


    const user =
        safeJSON(
            localStorage.getItem(USER_KEY),
            null
        );


    if (!user) {

        sessionStorage.setItem(
            PENDING_CHECKOUT_KEY,
            "true"
        );

        document
            .getElementById("accountBtn")
            ?.click();

        showToast(
            "Please login to continue checkout."
        );

        return;
    }


    openCheckout(
        buyNowItem,
        true
    );
}


/* =========================================================
   GET CHECKOUT ITEMS
   ========================================================= */

function getCheckoutItems() {

    const pendingBuyNow =
        safeJSON(
            sessionStorage.getItem(
                PENDING_BUY_NOW_KEY
            ),
            null
        );


    if (
        pendingBuyNow &&
        pendingBuyNow.id
    ) {

        return [
            {
                id: pendingBuyNow.id,
                qty: Math.max(
                    1,
                    Number(pendingBuyNow.qty) || 1
                )
            }
        ];
    }


    return getCart();
}


/* =========================================================
   OPEN CHECKOUT
   ========================================================= */

function openCheckout(
    directItems = null,
    isBuyNow = false
) {

    const items =
        Array.isArray(directItems) &&
        directItems.length
            ? directItems
            : getCheckoutItems();


    if (!items.length) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    const user =
        safeJSON(
            localStorage.getItem(USER_KEY),
            null
        );


    if (!user) {

        if (isBuyNow) {

            sessionStorage.setItem(
                PENDING_BUY_NOW_KEY,
                JSON.stringify(items)
            );

        } else {

            sessionStorage.setItem(
                PENDING_CHECKOUT_KEY,
                "true"
            );
        }


        document
            .getElementById("accountBtn")
            ?.click();

        showToast(
            "Please login to continue checkout."
        );

        return;
    }


    const name =
        document.getElementById(
            "customerName"
        );

    const email =
        document.getElementById(
            "customerEmail"
        );


    if (name && !name.value) {
        name.value = user.name || "";
    }


    if (email && !email.value) {
        email.value = user.email || "";
    }


    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );


    openModal(checkoutModal);
}


/* =========================================================
   VALIDATE CHECKOUT ITEMS
   ========================================================= */

function buildOrderItems(items) {

    const products =
        getProducts();

    const orderItems = [];


    for (const checkoutItem of items) {

        const product =
            products.find(
                p => p.id === checkoutItem.id
            );


        if (!product) {

            return {
                error: "A product in your order is no longer available."
            };
        }


        const qty =
            Math.max(
                1,
                Number(checkoutItem.qty) || 1
            );


        const stock =
            Math.max(
                0,
                Number(product.stock) || 0
            );


        if (stock < qty) {

            return {
                error:
                    `${product.name} has only ${stock} item(s) available.`
            };
        }


        orderItems.push({

            id: product.id,

            name: product.name,

            price:
                Number(product.price) || 0,

            qty,

            image:
                product.image || ""

        });
    }


    if (!orderItems.length) {

        return {
            error: "No products selected."
        };
    }


    return {
        items: orderItems
    };
}


/* =========================================================
   RAZORPAY PAYMENT + CHECKOUT
   ========================================================= */

const RAZORPAY_BACKEND_URL = "https://vjorashop-backend.onrender.com";


/* =========================================================
   LOAD RAZORPAY
   ========================================================= */

function loadRazorpayScript() {

    return new Promise((resolve, reject) => {

        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");

        script.src =
            "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => resolve(true);

        script.onerror = () => {
            reject(
                new Error(
                    "Razorpay SDK could not be loaded."
                )
            );
        };

        document.head.appendChild(script);
    });
}


/* =========================================================
   CREATE RAZORPAY ORDER
   ========================================================= */

async function createRazorpayOrder(
    amount,
    receipt
) {

    const response = await fetch(
        `${RAZORPAY_BACKEND_URL}/api/create-order`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                amount: Number(amount),
                receipt: String(receipt)
            })
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Unable to create payment order."
        );
    }

    return data.order;
}


/* =========================================================
   VERIFY RAZORPAY PAYMENT
   ========================================================= */

async function verifyRazorpayPayment(
    paymentData
) {

    const response = await fetch(
        `${RAZORPAY_BACKEND_URL}/api/verify-payment`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(
                paymentData
            )
        }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {

        throw new Error(
            data.message ||
            "Payment verification failed."
        );
    }

    return data;
}


/* =========================================================
   GET UPI ID
   ========================================================= */

function getUpiId() {

    const direct =
        localStorage.getItem(UPI_KEY);

    if (
        direct &&
        direct.trim()
    ) {
        return direct.trim();
    }


    const adminSettings =
        safeJSON(
            localStorage.getItem(
                "vjoraAdminSettings"
            ),
            {}
        );


    if (
        adminSettings &&
        adminSettings.upiId
    ) {

        return String(
            adminSettings.upiId
        ).trim();
    }


    const storeSettings =
        safeJSON(
            localStorage.getItem(
                "vjoraStoreSettings"
            ),
            {}
        );


    if (
        storeSettings &&
        storeSettings.upiId
    ) {

        return String(
            storeSettings.upiId
        ).trim();
    }


    return "";
}


/* =========================================================
   UPDATE UPI CHECKOUT INFO
   ========================================================= */

function updateUPICheckoutInfo() {

    const paymentInfo =
        document.getElementById(
            "upiPaymentInfo"
        );

    if (!paymentInfo) {
        return;
    }


    paymentInfo.innerHTML = `
        <strong>Secure Online Payment</strong>
        <br>
        UPI, Cards, Netbanking and more
        <br>
        <small>
            Payment securely processed by Razorpay.
        </small>
    `;
}


/* =========================================================
   BUY NOW
   ========================================================= */

function buyNow(productId) {

    const product =
        getProducts().find(
            p => p.id === productId
        );


    if (!product) {

        showToast(
            "Product not found."
        );

        return;
    }


    const stock =
        Math.max(
            0,
            Number(product.stock) || 0
        );


    if (stock <= 0) {

        showToast(
            "Product is out of stock."
        );

        return;
    }


    const buyNowItem = {
        id: product.id,
        qty: 1
    };


    sessionStorage.setItem(
        PENDING_BUY_NOW_KEY,
        JSON.stringify(
            buyNowItem
        )
    );


    const user =
        safeJSON(
            localStorage.getItem(
                USER_KEY
            ),
            null
        );


    if (!user) {

        sessionStorage.setItem(
            PENDING_CHECKOUT_KEY,
            "true"
        );


        document
            .getElementById(
                "accountBtn"
            )
            ?.click();


        showToast(
            "Please login to continue checkout."
        );

        return;
    }


    openCheckout(
        buyNowItem,
        true
    );
}


/* =========================================================
   GET CHECKOUT ITEMS
   ========================================================= */

function getCheckoutItems() {

    const pendingBuyNow =
        safeJSON(
            sessionStorage.getItem(
                PENDING_BUY_NOW_KEY
            ),
            null
        );


    if (
        pendingBuyNow &&
        pendingBuyNow.id
    ) {

        return [
            {
                id: pendingBuyNow.id,

                qty: Math.max(
                    1,
                    Number(
                        pendingBuyNow.qty
                    ) || 1
                )
            }
        ];
    }


    return getCart();
}


/* =========================================================
   OPEN CHECKOUT
   ========================================================= */

function openCheckout(
    directItems = null,
    isBuyNow = false
) {

    const items =
        Array.isArray(directItems) &&
        directItems.length
            ? directItems
            : getCheckoutItems();


    if (!items.length) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    const user =
        safeJSON(
            localStorage.getItem(
                USER_KEY
            ),
            null
        );


    if (!user) {

        if (isBuyNow) {

            sessionStorage.setItem(
                PENDING_BUY_NOW_KEY,
                JSON.stringify(items)
            );

        } else {

            sessionStorage.setItem(
                PENDING_CHECKOUT_KEY,
                "true"
            );
        }


        document
            .getElementById(
                "accountBtn"
            )
            ?.click();


        showToast(
            "Please login to continue checkout."
        );

        return;
    }


    const name =
        document.getElementById(
            "customerName"
        );

    const email =
        document.getElementById(
            "customerEmail"
        );


    if (
        name &&
        !name.value
    ) {

        name.value =
            user.name || "";
    }


    if (
        email &&
        !email.value
    ) {

        email.value =
            user.email || "";
    }


    updateUPICheckoutInfo();


    openModal(
        document.getElementById(
            "checkoutModal"
        )
    );
}


/* =========================================================
   BUILD ORDER ITEMS
   ========================================================= */

function buildOrderItems(items) {

    const products =
        getProducts();

    const orderItems = [];


    for (
        const checkoutItem
        of items
    ) {

        const product =
            products.find(
                p =>
                    p.id ===
                    checkoutItem.id
            );


        if (!product) {

            return {
                error:
                    "A product in your order is no longer available."
            };
        }


        const qty =
            Math.max(
                1,
                Number(
                    checkoutItem.qty
                ) || 1
            );


        const stock =
            Math.max(
                0,
                Number(
                    product.stock
                ) || 0
            );


        if (
            stock < qty
        ) {

            return {
                error:
                    `${product.name} has only ${stock} item(s) available.`
            };
        }


        orderItems.push({

            id:
                product.id,

            name:
                product.name,

            price:
                Number(
                    product.price
                ) || 0,

            qty,

            image:
                product.image || ""

        });
    }


    if (!orderItems.length) {

        return {
            error:
                "No products selected."
        };
    }


    return {
        items:
            orderItems
    };
}


/* =========================================================
   FINALIZE LOCAL ORDER
   ========================================================= */

function finalizeLocalOrder(
    orderData
) {

    const products =
        getProducts();


    const orderItems =
        orderData.items;


    /* Check stock again */

    for (
        const item
        of orderItems
    ) {

        const product =
            products.find(
                p =>
                    p.id ===
                    item.id
            );


        if (!product) {

            showToast(
                "A product is no longer available."
            );

            return false;
        }


        const stock =
            Number(
                product.stock
            ) || 0;


        if (
            stock <
            Number(item.qty)
        ) {

            showToast(
                `${product.name} is no longer available in the required quantity.`
            );

            return false;
        }
    }


    /* Reduce stock only after
       successful payment / COD */

    for (
        const item
        of orderItems
    ) {

        const product =
            products.find(
                p =>
                    p.id ===
                    item.id
            );


        product.stock =
            Math.max(
                0,
                Number(
                    product.stock
                ) -
                Number(
                    item.qty
                )
            );
    }


    saveProducts(
        products
    );


    const orderId =
        "VJ" +
        Date.now()
            .toString()
            .slice(-8);


    const order = {

        orderId,

        userEmail:
            orderData.user.email,

        userName:
            orderData.user.name,

        name:
            orderData.name,

        email:
            orderData.user.email,

        phone:
            orderData.phone,

        address:
            orderData.address,

        city:
            orderData.city,

        pincode:
            orderData.pincode,

        payment:
            orderData.payment,

        items:
            orderItems,

        total:
            orderData.total,

        status:
            "Order Placed",

        date:
            new Date()
                .toLocaleString(
                    "en-IN"
                ),

        razorpayPaymentId:
            orderData.razorpayPaymentId ||
            "",

        razorpayOrderId:
            orderData.razorpayOrderId ||
            ""
    };


    const orders =
        getOrders();


    orders.push(
        order
    );


    saveOrders(
        orders
    );


    const pendingBuyNow =
        safeJSON(
            sessionStorage.getItem(
                PENDING_BUY_NOW_KEY
            ),
            null
        );


    if (!pendingBuyNow) {

        saveCart([]);

    } else {

        sessionStorage.removeItem(
            PENDING_BUY_NOW_KEY
        );
    }


    sessionStorage.removeItem(
        PENDING_CHECKOUT_KEY
    );


    updateCartUI();


    closeModal(
        document.getElementById(
            "checkoutModal"
        )
    );


    const successOrderId =
        document.getElementById(
            "successOrderId"
        );


    if (successOrderId) {

        successOrderId.textContent =
            orderId;
    }


    renderProducts(
        getProducts(),
        "Popular Products"
    );


    renderNewArrivals();


    openModal(
        document.getElementById(
            "successModal"
        )
    );


    return true;
}


/* =========================================================
   RAZORPAY PAYMENT
   ========================================================= */

async function launchOnlinePayment(
    orderData
) {

    try {

        showToast(
            "Opening secure payment..."
        );


        await loadRazorpayScript();


        const receipt =
            "vjora_" +
            Date.now();


        const razorpayOrder =
            await createRazorpayOrder(
                orderData.total,
                receipt
            );


        const options = {

            key:
                "rzp_test_TZp2ZbyUbvmH0l",

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency ||
                "INR",

            name:
                "VJoraShop",

            description:
                "VJoraShop Order Payment",

            order_id:
                razorpayOrder.id,


            prefill: {

                name:
                    orderData.name,

                email:
                    orderData.user.email,

                contact:
                    orderData.phone
            },


            notes: {

                store:
                    "VJoraShop"
            },


            theme: {

                color:
                    "#071a33"
            },


            handler:
                async function (
                    response
                ) {

                    try {

                        showToast(
                            "Verifying payment..."
                        );


                        await verifyRazorpayPayment({

                            razorpay_order_id:
                                response.razorpay_order_id,

                            razorpay_payment_id:
                                response.razorpay_payment_id,

                            razorpay_signature:
                                response.razorpay_signature

                        });


                        const success =
                            finalizeLocalOrder({

                                ...orderData,

                                razorpayPaymentId:
                                    response.razorpay_payment_id,

                                razorpayOrderId:
                                    response.razorpay_order_id

                            });


                        if (!success) {
                            return;
                        }


                        showToast(
                            "Payment successful. Order placed."
                        );

                    } catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );


                        showToast(
                            error.message ||
                            "Payment verification failed."
                        );
                    }
                },


            modal: {

                ondismiss:
                    function () {

                        showToast(
                            "Payment cancelled."
                        );
                    }
            }

        };


        const razorpay =
            new Razorpay(
                options
            );


        razorpay.on(
            "payment.failed",
            function () {

                showToast(
                    "Payment failed. Order was not placed."
                );
            }
        );


        razorpay.open();


    } catch (error) {

        console.error(
            "Razorpay error:",
            error
        );


        showToast(
            error.message ||
            "Unable to open online payment."
        );
    }
}


/* =========================================================
   PLACE ORDER
   ========================================================= */

async function placeOrder(
    event
) {

    event.preventDefault();


    const currentUser =
        safeJSON(
            localStorage.getItem(
                USER_KEY
            ),
            null
        );


    if (!currentUser) {

        showToast(
            "Please login before placing order."
        );

        return;
    }


    const checkoutItems =
        getCheckoutItems();


    if (!checkoutItems.length) {

        showToast(
            "Your cart is empty."
        );

        return;
    }


    const nameEl =
        document.getElementById(
            "customerName"
        );

    const phoneEl =
        document.getElementById(
            "customerPhone"
        );

    const addressEl =
        document.getElementById(
            "customerAddress"
        );

    const cityEl =
        document.getElementById(
            "customerCity"
        );

    const pincodeEl =
        document.getElementById(
            "customerPincode"
        );

    const paymentEl =
        document.getElementById(
            "paymentMethod"
        );


    if (
        !nameEl ||
        !phoneEl ||
        !addressEl ||
        !cityEl ||
        !pincodeEl ||
        !paymentEl
    ) {

        showToast(
            "Checkout form is incomplete."
        );

        return;
    }


    const name =
        nameEl.value.trim();

    const phone =
        phoneEl.value.trim();

    const address =
        addressEl.value.trim();

    const city =
        cityEl.value.trim();

    const pincode =
        pincodeEl.value.trim();

    const payment =
        paymentEl.value;


    if (
        !name ||
        !phone ||
        !address ||
        !city ||
        !pincode ||
        !payment
    ) {

        showToast(
            "Please fill all details."
        );

        return;
    }


    if (
        !/^\d{10}$/.test(phone)
    ) {

        showToast(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }


    if (
        !/^\d{6}$/.test(pincode)
    ) {

        showToast(
            "Please enter a valid 6-digit PIN code."
        );

        return;
    }


    const result =
        buildOrderItems(
            checkoutItems
        );


    if (result.error) {

        showToast(
            result.error
        );

        return;
    }


    const orderItems =
        result.items;


    const total =
        orderItems.reduce(
            (
                sum,
                item
            ) =>
                sum +
                Number(item.price) *
                Number(item.qty),
            0
        );


    const orderData = {

        user:
            currentUser,

        name,

        phone,

        address,

        city,

        pincode,

        payment,

        items:
            orderItems,

        total
    };


    /* =====================================================
       ONLINE PAYMENT
       ===================================================== */

    if (
        String(payment)
            .toUpperCase() ===
        "UPI"
    ) {

        await launchOnlinePayment(
            orderData
        );

        return;
    }


    /* =====================================================
       CASH ON DELIVERY
       ===================================================== */

    if (
        String(payment)
            .toUpperCase() ===
        "CASH ON DELIVERY"
    ) {

        finalizeLocalOrder(
            orderData
        );

        return;
    }


    showToast(
        "Please select a valid payment method."
    );
}


/* =========================================================
   END RAZORPAY PAYMENT + CHECKOUT
   ========================================================= */
/* =========================================================
   ORDERS
   ========================================================= */

function openOrders() {

    const ordersContent =
        document.getElementById(
            "ordersContent"
        );

    if (!ordersContent) return;


    const user =
        safeJSON(
            localStorage.getItem(USER_KEY),
            null
        );


    if (!user) {

        ordersContent.innerHTML = `

            <span class="section-label">
                MY ORDERS
            </span>

            <h2>
                Login Required
            </h2>

            <p>
                Please login to view your orders.
            </p>

            <button
                type="button"
                class="primary-btn"
                id="ordersLoginBtn"
                style="margin-top:20px;"
            >
                Login
            </button>

        `;


        document
            .getElementById("ordersLoginBtn")
            ?.addEventListener(
                "click",
                () => {

                    closeModal(
                        document.getElementById(
                            "ordersModal"
                        )
                    );

                    openModal(
                        document.getElementById(
                            "accountModal"
                        )
                    );

                    renderAccount();
                }
            );


        openModal(
            document.getElementById(
                "ordersModal"
            )
        );

        return;
    }


    const orders =
        getOrders()
            .filter(
                order =>
                    String(
                        order.email ||
                        order.userEmail ||
                        ""
                    ).toLowerCase() ===
                    String(user.email || "")
                        .toLowerCase()
            )
            .reverse();


    if (!orders.length) {

        ordersContent.innerHTML = `

            <span class="section-label">
                MY ORDERS
            </span>

            <h2>
                No Orders Yet
            </h2>

            <p>
                Your placed orders will appear here.
            </p>

        `;

    } else {

        ordersContent.innerHTML = `

            <span class="section-label">
                MY ORDERS
            </span>

            <h2>
                Your Orders
            </h2>

            <div>
                ${orders.map(orderCard).join("")}
            </div>

        `;
    }


    openModal(
        document.getElementById(
            "ordersModal"
        )
    );
}


/* =========================================================
   ORDER CARD
   ========================================================= */

function orderCard(order) {

    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    const productsText =
        items
            .map(
                item =>
                    `${escapeHTML(item.name)}
                     × ${Number(item.qty) || 0}`
            )
            .join(", ");


    return `

        <div class="order-card">

            <div class="order-top">

                <span class="order-id">
                    ${escapeHTML(order.orderId)}
                </span>

                <span class="order-status">
                    ${escapeHTML(
                        order.status || "Order Placed"
                    )}
                </span>

            </div>


            <div class="order-products">
                ${productsText}
            </div>


            <div class="order-bottom">

                <span>
                    ${escapeHTML(
                        order.date || ""
                    )}
                </span>

                <strong>
                    ${money(order.total)}
                </strong>

            </div>


            ${
                order.status !== "Cancelled" &&
                order.status !== "Delivered"
                    ? `
                        <button
                            type="button"
                            class="outline-btn"
                            style="
                                margin-top:12px;
                                color:#e53935;
                            "
                            data-cancel-order="${escapeHTML(
                                order.orderId
                            )}"
                        >
                            Cancel Order
                        </button>
                      `
                    : ""
            }

        </div>

    `;
}


/* =========================================================
   CANCEL ORDER
   ========================================================= */

function cancelOrder(orderId) {

    const orders =
        getOrders();


    const order =
        orders.find(
            o => o.orderId === orderId
        );


    if (!order) {

        showToast(
            "Order not found."
        );

        return;
    }


    if (
        order.status === "Cancelled" ||
        order.status === "Delivered"
    ) {

        showToast(
            "This order cannot be cancelled."
        );

        return;
    }


    const products =
        getProducts();


    const items =
        Array.isArray(order.items)
            ? order.items
            : [];


    items.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );


        if (product) {

            product.stock =
                Number(product.stock || 0) +
                Number(item.qty || 0);
        }
    });


    order.status =
        "Cancelled";


    saveProducts(products);

    saveOrders(orders);


    showToast(
        "Order cancelled."
    );


    openOrders();


    renderProducts(
        getProducts(),
        "Popular Products"
    );

    renderNewArrivals();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function goHome() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    showAllProducts();
}


function scrollToSection(id) {

    document
        .getElementById(id)
        ?.scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================================================
   DEALS
   ========================================================= */

function showDeals() {

    const products =
        getProducts()
            .filter(
                product =>
                    Number(product.oldPrice) >
                    Number(product.price)
            )
            .sort(
                (a, b) => {

                    const aOld =
                        Number(a.oldPrice) || 0;

                    const aPrice =
                        Number(a.price) || 0;

                    const bOld =
                        Number(b.oldPrice) || 0;

                    const bPrice =
                        Number(b.price) || 0;


                    const aDiscount =
                        aOld > 0
                            ? (aOld - aPrice) / aOld
                            : 0;

                    const bDiscount =
                        bOld > 0
                            ? (bOld - bPrice) / bOld
                            : 0;


                    return (
                        bDiscount -
                        aDiscount
                    );
                }
            );


    renderProducts(
        products,
        "🔥 Best Deals"
    );


    if (clearFilterBtn) {
        clearFilterBtn.style.display =
            "inline-block";
    }


    scrollToSection(
        "products"
    );
}


/* =========================================================
   CONTACT
   ========================================================= */

function submitContact(event) {

    event.preventDefault();

    showToast(
        "Message sent successfully."
    );

    event.target.reset();
}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */


/* Logo */

document
    .getElementById("logoBtn")
    ?.addEventListener(
        "click",
        goHome
    );


document
    .getElementById("footerLogoBtn")
    ?.addEventListener(
        "click",
        goHome
    );


/* Home */

document
    .getElementById("homeBtn")
    ?.addEventListener(
        "click",
        goHome
    );


document
    .getElementById("footerHomeBtn")
    ?.addEventListener(
        "click",
        goHome
    );


/* Search */

searchBtn?.addEventListener(
    "click",
    searchProducts
);


searchInput?.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            searchProducts();
        }

    }
);


/* Categories */

document
    .querySelectorAll(
        "[data-nav-category]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterCategory(
                    button.dataset.navCategory
                );

            }
        );

    });


document
    .querySelectorAll(
        ".category-card"
    )
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                filterCategory(
                    card.dataset.category
                );

            }
        );

    });


/* =========================================================
   PRODUCT BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-action]"
            );


        if (!button) return;


        const id =
            button.dataset.id;

        const action =
            button.dataset.action;


        if (action === "cart") {

            addToCart(id);

            return;
        }


        if (action === "wishlist") {

            toggleWishlist(id);

            return;
        }


        if (action === "view") {

            openProductDetails(id);

            return;
        }


        if (action === "buy-now") {

            buyNow(id);

            return;
        }

    }
);


/* =========================================================
   CART BUTTONS
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-cart-action]"
            );


        if (!button) return;


        const id =
            button.dataset.id;

        const action =
            button.dataset.cartAction;


        if (action === "plus") {

            updateCartQuantity(
                id,
                1
            );

            return;
        }


        if (action === "minus") {

            updateCartQuantity(
                id,
                -1
            );

            return;
        }


        if (action === "remove") {

            removeFromCart(id);

        }

    }
);


/* =========================================================
   DETAILS ADD TO CART
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-details-cart]"
            );


        if (!button) return;


        addToCart(
            button.dataset.detailsCart
        );


        closeModal(
            document.getElementById(
                "detailsModal"
            )
        );

    }
);


/* =========================================================
   DETAILS BUY NOW
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-details-buy]"
            );


        if (!button) return;


        closeModal(
            document.getElementById(
                "detailsModal"
            )
        );


        buyNow(
            button.dataset.detailsBuy
        );

    }
);


/* =========================================================
   CANCEL ORDER
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-cancel-order]"
            );


        if (!button) return;


        const orderId =
            button.dataset.cancelOrder;


        if (
            confirm(
                "Are you sure you want to cancel this order?"
            )
        ) {

            cancelOrder(orderId);

        }

    }
);


/* =========================================================
   ACCOUNT
   ========================================================= */

document
    .getElementById("accountBtn")
    ?.addEventListener(
        "click",
        () => {

            renderAccount();

            openModal(
                document.getElementById(
                    "accountModal"
                )
            );

        }
    );


/* =========================================================
   WISHLIST
   ========================================================= */

document
    .getElementById("wishlistBtn")
    ?.addEventListener(
        "click",
        () => {

            const list =
                getWishlist();


            const products =
                getProducts().filter(
                    product =>
                        list.includes(
                            product.id
                        )
                );


            renderProducts(
                products,
                "❤️ My Wishlist"
            );


            if (clearFilterBtn) {
                clearFilterBtn.style.display =
                    "inline-block";
            }


            scrollToSection(
                "products"
            );

        }
    );


/* =========================================================
   CART
   ========================================================= */

document
    .getElementById("cartBtn")
    ?.addEventListener(
        "click",
        () => {

            updateCartUI();

            openModal(
                cartOverlay
            );

        }
    );


/* =========================================================
   CLOSE CART
   ========================================================= */

document
    .getElementById("closeCartBtn")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                cartOverlay
            );

        }
    );


/* =========================================================
   CLOSE DETAILS
   ========================================================= */

document
    .getElementById("closeDetailsBtn")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                document.getElementById(
                    "detailsModal"
                )
            );

        }
    );


/* =========================================================
   CLOSE ACCOUNT
   ========================================================= */

document
    .getElementById("closeAccountBtn")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                document.getElementById(
                    "accountModal"
                )
            );

        }
    );


/* =========================================================
   CLOSE ORDERS
   ========================================================= */

document
    .getElementById("closeOrdersBtn")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                document.getElementById(
                    "ordersModal"
                )
            );

        }
    );


/* =========================================================
   CLOSE CHECKOUT
   ========================================================= */

document
    .getElementById("closeCheckoutBtn")
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                document.getElementById(
                    "checkoutModal"
                )
            );

        }
    );


/* =========================================================
   CHECKOUT
   ========================================================= */

document
    .getElementById("checkoutBtn")
    ?.addEventListener(
        "click",
        () => {

            const cartData =
                getCart();


            if (!cartData.length) {

                showToast(
                    "Your cart is empty."
                );

                return;
            }


            const user =
                safeJSON(
                    localStorage.getItem(
                        USER_KEY
                    ),
                    null
                );


            if (!user) {

                sessionStorage.setItem(
                    PENDING_CHECKOUT_KEY,
                    "true"
                );


                closeModal(
                    document.getElementById(
                        "cartOverlay"
                    )
                );


                document
                    .getElementById(
                        "accountBtn"
                    )
                    ?.click();


                showToast(
                    "Please login to continue checkout."
                );

                return;
            }


            openCheckout(
                null,
                false
            );

        }
    );


/* =========================================================
   CHECKOUT FORM
   ========================================================= */

document
    .getElementById("checkoutForm")
    ?.addEventListener(
        "submit",
        placeOrder
    );


/* =========================================================
   ORDERS
   ========================================================= */

document
    .getElementById("footerOrdersBtn")
    ?.addEventListener(
        "click",
        openOrders
    );


/* =========================================================
   FOOTER ACCOUNT
   ========================================================= */

document
    .getElementById("footerAccountBtn")
    ?.addEventListener(
        "click",
        () => {

            renderAccount();

            openModal(
                document.getElementById(
                    "accountModal"
                )
            );

        }
    );


/* =========================================================
   CONTACT
   ========================================================= */

document
    .getElementById("contactNavBtn")
    ?.addEventListener(
        "click",
        () => {

            scrollToSection(
                "contactSection"
            );

        }
    );


document
    .getElementById("footerContactBtn")
    ?.addEventListener(
        "click",
        () => {

            scrollToSection(
                "contactSection"
            );

        }
    );


document
    .getElementById("contactForm")
    ?.addEventListener(
        "submit",
        submitContact
    );


/* =========================================================
   SHOP NOW
   ========================================================= */

document
    .getElementById("shopNowBtn")
    ?.addEventListener(
        "click",
        () => {

            scrollToSection(
                "products"
            );

        }
    );


/* =========================================================
   DEALS
   ========================================================= */

document
    .getElementById("dealsBtn")
    ?.addEventListener(
        "click",
        showDeals
    );


document
    .getElementById("dealsSectionBtn")
    ?.addEventListener(
        "click",
        showDeals
    );


document
    .getElementById("dealsSectionBtn2")
    ?.addEventListener(
        "click",
        showDeals
    );


/* =========================================================
   NEW ARRIVALS
   ========================================================= */

document
    .getElementById("newArrivalsBtn")
    ?.addEventListener(
        "click",
        () => {

            scrollToSection(
                "new-arrivals"
            );

        }
    );


document
    .getElementById(
        "newArrivalsSectionBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            scrollToSection(
                "new-arrivals"
            );

        }
    );


/* =========================================================
   CLEAR FILTER
   ========================================================= */

clearFilterBtn?.addEventListener(
    "click",
    showAllProducts
);


emptyResetBtn?.addEventListener(
    "click",
    showAllProducts
);


/* =========================================================
   SUCCESS - CONTINUE SHOPPING
   ========================================================= */

document
    .getElementById(
        "successContinueBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                document.getElementById(
                    "successModal"
                )
            );

            goHome();

        }
    );


/* =========================================================
   SUCCESS - VIEW ORDERS
   ========================================================= */

document
    .getElementById(
        "successOrdersBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            closeModal(
                document.getElementById(
                    "successModal"
                )
            );

            openOrders();

        }
    );


/* =========================================================
   CLOSE MODAL ON BACKGROUND CLICK
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            closeModal(
                event.target
            );

        }

    }
);


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }


        document
            .querySelectorAll(
                ".modal-overlay"
            )
            .forEach(modal => {

                if (
                    modal.style.display ===
                    "flex"
                ) {

                    closeModal(modal);

                }

            });

    }
);


/* =========================================================
   STORAGE SYNC
   ========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key === PRODUCT_KEY ||
            event.key === CART_KEY ||
            event.key === WISHLIST_KEY ||
            event.key === ORDER_KEY ||
            event.key === UPI_KEY
        ) {

            renderProducts(
                getProducts(),
                "Popular Products"
            );

            renderNewArrivals();

            updateCartUI();

            updateWishlistUI();

        }

    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

function init() {

    getProducts();

    renderProducts(
        getProducts(),
        "Popular Products"
    );

    renderNewArrivals();

    updateCartUI();

    updateWishlistUI();
}


init();
