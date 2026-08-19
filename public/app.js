// public/app.js
async function fetchGraphQL(query, variables) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });
    return response.json();
}

const GET_ALL_ITEMS = `
    query {
        getAllItems {
            item_id
            name
            category
            fabric
            price
            stock
            status
        }
    }
`;

const GET_ITEM_BY_ID = `
    query getItem($id: String!) {
        getItem(id: $id) {
            item_id
            name
            category
            fabric
            price
            stock
            status
        }
    }
`;

const GET_BY_CATEGORY = `
    query getByCategory($category: String!) {
        getByCategory(category: $category) {
            item_id
            name
        }
    }
`;

const GET_OUT_OF_STOCK = `
    query {
        getOutOfStock {
            item_id
            name
        }
    }
`;

const GET_LOW_STOCK = `
    query {
        getLowStock {
            item_id
            name
        }
    }
`;

function showSkeletons() {
    document.querySelector('.inventory-grid').classList.add('loading');
}

function hideSkeletons() {
    document.querySelector('.inventory-grid').classList.remove('loading');
}

function renderInventory(items) {
    const inventoryGrid = document.querySelector('.inventory-grid');
    inventoryGrid.innerHTML = '';
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">${item.name}</div>
            <div class="card-body">
                <div class="card-detail">SKU: ${item.item_id}</div>
                <div class="card-detail">Category: ${item.category}</div>
                <div class="card-detail">Fabric: ${item.fabric}</div>
                <div class="card-detail">Price: $${item.price.toFixed(2)}</div>
                <div class="card-detail">Stock: ${item.stock}</div>
                <span class="status-badge">${item.status}</span>
            </div>
        `;
        inventoryGrid.appendChild(card);

        if (item.status === 'LOW STOCK') {
            card.classList.add('low-stock');
        } else if (item.status === 'OUT OF STOCK') {
            card.classList.add('out-of-stock');
        }

        // staggered animation
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Observe for revealing animations
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    cards.forEach(card => observer.observe(card));
}

function renderCarousel(items) {
    const carousel = document.querySelector('.carousel');
    carousel.innerHTML = '';
    items.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';
        carouselItem.innerHTML = `
            <h3>${item.name}</h3>
            <p>$${item.price.toFixed(2)}</p>
        `;
        carousel.appendChild(carouselItem);
    });
}

function updateStats(items) {
    const totalItems = document.querySelector('.stats-bar .number[data-count]');
    totalItems.setAttribute('data-count', items.length);
    // Count up animations
    totalItems.innerText = 0;
    countUp(totalItems, items.length);
}

function countUp(element, target) {
    const duration = 2000;
    const increment = target / (duration / 100);
    let current = 0;

    const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(interval);
            current = target;
        }
        element.innerText = Math.floor(current);
    }, 100);
}

function updateGraphQLPanel(queryName) {
    let cacheStatus = document.querySelector('.cache-status');
    let lastSync = document.querySelector('.last-sync');
    lastSync.innerText = new Date().toLocaleTimeString();
}

document.addEventListener('DOMContentLoaded', async () => {
    showSkeletons();
    try {
        const data = await fetchGraphQL(GET_ALL_ITEMS);
        renderInventory(data.data.getAllItems);
        hideSkeletons();
        renderCarousel(data.data.getAllItems.slice(0, 8));
        updateStats(data.data.getAllItems);
    } catch (error) {
        console.error("Fetch failed: ", error);
    }
});

document.querySelector('.hamburger').onclick = function() {
    document.querySelector('.side-drawer').classList.toggle('open');
};

document.querySelector('.close-btn').onclick = function() {
    document.querySelector('.side-drawer').classList.remove('open');
};

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
    }
});
