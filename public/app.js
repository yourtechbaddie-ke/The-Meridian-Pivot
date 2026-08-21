document.addEventListener("DOMContentLoaded", () => {
    const inventoryGrid = document.getElementById("inventory-grid");
    const totalItems = document.getElementById("total-items");
    const categoriesCount = document.getElementById("categories-count");

    // Fetch from GraphQL API
    async function fetchInventory() {
        const response = await fetch('/api/inventory', { method: 'POST', body: JSON.stringify({ query: '{ getAllItems { item_id, name, category } }' }), headers: { 'Content-Type': 'application/json' } });
        const data = await response.json();
        const items = data.data.getAllItems;
        renderInventory(items);
        totalItems.innerText = items.length;
        categoriesCount.innerText = new Set(items.map(item => item.category)).size;
    }

    function renderInventory(items) {
        inventoryGrid.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `<img src="images/${item.item_id}.jpg" class="product-img" alt="${item.name}" onerror="this.src='public/product.images'">
                             <h3>${item.name}</h3>
                             <p>${item.category}</p>`;
            inventoryGrid.appendChild(card);
        });
    }

    fetchInventory();
});
