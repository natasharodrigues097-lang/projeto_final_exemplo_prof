// ================================
// CONTADOR ANIMADO
// ================================

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

    const updateCounter = () => {

        const target = +counter.dataset.target;
        const count = +counter.innerText;

        const increment = target / 100;

        if (count < target) {

            counter.innerText =
                Math.ceil(count + increment);

            setTimeout(updateCounter, 20);

        } else {

            counter.innerText = target;

        }

    }

    updateCounter();

});

// ================================
// SCROLL ANIMATION
// ================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add('show');

        }

    });

});

document.querySelectorAll('section').forEach(section => {

    section.classList.add('fade-in');

    observer.observe(section);

});

// ================================
// NAVBAR SCROLL
// ================================

window.addEventListener('scroll', () => {

    const nav =
        document.querySelector('.custom-navbar');

    if (window.scrollY > 50) {

        nav.style.background =
            "#8d2d00";

    } else {

        nav.style.background =
            "rgba(24,13,8,.85)";

    }

});

// ================================
// LOJA: carrinho e filtros
// ================================

const cart = [];

function formatCurrency(value){
    return 'R$ ' + Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function updateCartCount(){
    const countEl = document.getElementById('cart-count');
    if(!countEl) return;
    const totalQty = cart.reduce((s,i)=>s+i.qty,0);
    countEl.innerText = totalQty;
}

function renderCart(){
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if(!container || !totalEl) return;
    container.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = 'd-flex justify-content-between align-items-center mb-2';
        row.innerHTML = `<div><strong>${item.name}</strong><div class="text-muted small">${item.qty} x ${formatCurrency(item.price)}</div></div><div><strong>${formatCurrency(item.qty*item.price)}</strong></div>`;
        container.appendChild(row);
        total += item.qty * item.price;
    });
    totalEl.innerText = formatCurrency(total);
}

function addToCart(name, price){
    const existing = cart.find(i=>i.name===name);
    if(existing) existing.qty += 1;
    else cart.push({ name, price: Number(price), qty: 1 });
    updateCartCount();
    renderCart();
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e)=>{
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        addToCart(name, price);
        const offcanvasEl = document.getElementById('cartOffcanvas');
        if(offcanvasEl){
            const bs = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
            bs.show();
        }
    });
});

document.getElementById('checkout-btn')?.addEventListener('click', ()=>{
    if(cart.length===0){ alert('Seu carrinho está vazio.'); return; }
    // fluxo curto: exibir resumo
    const total = cart.reduce((s,i)=>s+i.qty*i.price,0);
    alert(`Total: ${formatCurrency(total)}\nObrigado pela preferência!`);
});

// filtros de categorias
document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.product-item').forEach(item=>{
            if(filter==='all' || item.dataset.category === filter) item.style.display = '';
            else item.style.display = 'none';
        });
    });
});
