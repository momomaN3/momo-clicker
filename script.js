// Game State
let state = {
    momos: 0,
    momoPerSecond: 0,
    clickPower: 1
};

const upgrades = [
    { id: 'water', name: "Aaron's Water", cost: 15, type: 'click', power: 1, count: 0, icon: '💧', desc: '+1 Per Click' },
    { id: 'flour', name: "Morris's Flour", cost: 100, type: 'mps', power: 1, count: 0, icon: '🌾', desc: '+1 Per Second' },
    { id: 'butcher', name: "Jacob's Butcher", cost: 600, type: 'click', power: 6, count: 0, icon: '🥩', desc: '+6 Per Click' },
    { id: 'factory', name: "Nathan's NK Factory", cost: 3500, type: 'mps', power: 15, count: 0, icon: '🏭', desc: '+15 Per Second' },
    { id: 'ceo', name: 'Chase CEO', cost: 15000, type: 'click', power: 75, count: 0, icon: '💼', desc: '+75 Per Click' }
];

const momoCountEl = document.getElementById('momo-count');
const mpcCountEl = document.getElementById('mpc-count');
const mpsCountEl = document.getElementById('mps-count');
const mainMomoEl = document.getElementById('main-momo');
const shopContainerEl = document.getElementById('shop-container');

function init() {
    renderShop();
    updateUI();
    
    // Core game passive ticks every 100ms
    setInterval(() => {
        state.momos += (state.momoPerSecond / 10);
        updateUI();
    }, 100);
}

function updateUI() {
    momoCountEl.textContent = Math.floor(state.momos).toLocaleString();
    mpcCountEl.textContent = state.clickPower.toLocaleString();
    mpsCountEl.textContent = state.momoPerSecond.toFixed(1);
    
    upgrades.forEach(item => {
        const card = document.getElementById(`card-${item.id}`);
        if (card) {
            if (state.momos >= item.cost) {
                card.classList.remove('disabled');
            } else {
                card.classList.add('disabled');
            }
        }
    });
}

function renderShop() {
    shopContainerEl.innerHTML = '';
    upgrades.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card disabled';
        card.id = `card-${item.id}`;
        card.innerHTML = `
            <div class="item-icon">${item.icon}</div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-effect">${item.desc}</div>
                <div class="item-cost" id="cost-${item.id}">Cost: ${item.cost} momos</div>
            </div>
            <div class="item-count" id="count-${item.id}">0</div>
        `;
        
        card.addEventListener('click', () => buyUpgrade(item));
        shopContainerEl.appendChild(card);
    });
}

// Mouse Click Action
mainMomoEl.addEventListener('click', (e) => {
    state.momos += state.clickPower;
    createClickParticle(e.clientX, e.clientY);
    updateUI();
});

// Spacebar Action
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        state.momos += state.clickPower;
        
        // Quick press visual wiggle
        mainMomoEl.style.transform = 'scale(0.95)';
        setTimeout(() => mainMomoEl.style.transform = 'none', 50);

        // Center calculation for keyboard hits
        const rect = mainMomoEl.getBoundingClientRect();
        const randX = rect.left + (rect.width / 2) + (Math.random() * 60 - 30);
        const randY = rect.top + (rect.height / 2);
        createClickParticle(randX, randY);
        
        updateUI();
    }
});

function createClickParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = `+${state.clickPower}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 600);
}

// Purchase logic supporting distinct types
function buyUpgrade(item) {
    if (state.momos >= item.cost) {
        state.momos -= item.cost;
        item.count++;
        
        item.cost = Math.ceil(item.cost * 1.15);
        
        // Dynamically routing item effects based on structure setting
        if (item.type === 'click') {
            state.clickPower += item.power;
        } else if (item.type === 'mps') {
            state.momoPerSecond += item.power;
        }
        
        document.getElementById(`cost-${item.id}`).textContent = `Cost: ${item.cost} momos`;
        document.getElementById(`count-${item.id}`).textContent = item.count;
        
        updateUI();
    }
}

init();
