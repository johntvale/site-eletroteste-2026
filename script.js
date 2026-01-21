document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // 2. LÓGICA DO SLIDER
    // =========================================================
    const sliderContent = document.getElementById('slider-content');
    const sliderControls = document.getElementById('slider-controls');
    let currentSlide = 0;
    let slideInterval;

    function renderSlide(index) {
        if (!sliderContent || PRODUCT_DATA.sliderData.length === 0) return;
        const product = PRODUCT_DATA.sliderData[index];
        const sliderBaseText = `Olá. Tenho interesse no produto ${product.title}. Poderia me enviar um orçamento?`;
        const whatsAppSliderLink = `https://wa.me/5592994240029?text=${encodeURIComponent(sliderBaseText)}`;
        // **********************************************************
        sliderContent.innerHTML = `
            <div class="slide-text fade-in">
                <h1>${product.title}</h1>
                <p>${product.subtitle}</p>
                <a href="${whatsAppSliderLink}" class="btn-cta"><i class="fab fa-whatsapp"></i> Solicitar cotação</a>
            </div>
            <div class="slide-image fade-in">
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <img src="${product.brand}" alt="Marca ${product.brand}" class="brand-logo">
            </div>
        `;
        updateDots(index);
    }

    function createControls() {
        if (!sliderControls) return;
        sliderControls.innerHTML = ''; 
        PRODUCT_DATA.sliderData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('control-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlide = index;
                renderSlide(currentSlide);
                resetTimer();
            });
            sliderControls.appendChild(dot);
        });
    }

    function updateDots(index) {
        const dots = document.querySelectorAll('.control-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    }

    function startSlider() {
        slideInterval = setInterval(() => {
            currentSlide++;
            if (currentSlide >= PRODUCT_DATA.sliderData.length) currentSlide = 0;
            renderSlide(currentSlide);
        }, 5000);
    }

    function resetTimer() {
        clearInterval(slideInterval);
        startSlider();
    }

    if (sliderContent && PRODUCT_DATA.sliderData.length > 0) {
        createControls();
        renderSlide(0);
        startSlider();
    }

    // =========================================================
    // 3. MENU MOBILE & SMOOTH SCROLL
    // =========================================================
    const menuIcon = document.querySelector('.menu-mobile');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuIcon && navLinks) {
        menuIcon.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuIcon.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuIcon.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // =========================================================
    // 4. ACCORDION DINÂMICO (PRODUTOS)
    // =========================================================
    const colLeft = document.getElementById('coluna-esquerda');
    const colRight = document.getElementById('coluna-direita');

    if (colLeft && colRight && typeof PRODUCT_DATA !== 'undefined') {
        initProducts(PRODUCT_DATA);
    } else {
        console.warn("PRODUCT_DATA não encontrado ou containers ausentes.");
    }

    function initProducts(data) {
        const categories = {};
        data.products.forEach(product => {
            if (!categories[product.category]) categories[product.category] = [];
            categories[product.category].push(product);
        });
        renderAccordions(categories);
    }

    function renderAccordions(categories) {
        const categoryNames = Object.keys(categories);
        
        categoryNames.forEach((catName, index) => {
            const products = categories[catName];
            const details = document.createElement('details');
            details.className = 'accordion-item';
            
            // Renderização limpa usando classes (sem style inline nas imagens)
            details.innerHTML = `
                <summary>${catName} <i class="fas fa-chevron-down"></i></summary>
                
                <div class="accordion-content-selected-wrapper" style="display: none;"></div>

                <div class="accordion-content product-list-grid">
                    ${products.map(prod => `
                        <img 
                            src="${prod.image}" 
                            alt="${prod.name}" 
                            title="${prod.name}" 
                            data-id="${prod.id}"
                            loading="lazy"
                            class="product-thumb clickable-product" 
                        >
                    `).join('')}
                </div>
            `;

            setupAccordionEvents(details, products);

            if (index % 2 === 0) colLeft.appendChild(details);
            else colRight.appendChild(details);
        });

        setupGlobalAccordionBehavior();
    }

    function setupAccordionEvents(details, products) {
        const highlightWrapper = details.querySelector('.accordion-content-selected-wrapper');
        const listImages = details.querySelectorAll('.clickable-product');
        let currentSelectedId = null;

        listImages.forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation(); 
                e.preventDefault();
                const clickedId = img.getAttribute('data-id');

                if (currentSelectedId === clickedId) {
                    clearSelection();
                } else {
                    selectProduct(clickedId);
                }
            });
        });

        details.addEventListener('toggle', () => {
            if (!details.open) clearSelection();
        });

        function selectProduct(id) {
            currentSelectedId = id;
            const product = products.find(p => p.id === parseInt(id) || p.id === id);

            if (product) {
                const baseText = `Olá. Tenho interesse no produto ${product.name}. Poderia me enviar um orçamento?`;
                const whatsAppLink = `https://wa.me/5592994240029?text=${encodeURIComponent(baseText)}`;

                // HTML limpo usando classes para o detalhe do produto
                highlightWrapper.innerHTML = `
                    <div class="product-selected-view fade-in">
                        <img src="${product.image}" alt="${product.name}" loading="lazy" class="product-selected-img">
                        <div class="product-selected-info">
                            <h4 class="product-selected-title">${product.name}</h4>
                            <p class="product-selected-desc">${product.description}</p>
                            <a href="${whatsAppLink}" target="_blank" class="btn-cta btn-small">
                                <i class="fab fa-whatsapp"></i> Solicitar Orçamento
                            </a>
                        </div>
                    </div>
                `;
                
                highlightWrapper.style.display = 'block';
                
                // Gerenciamento visual da seleção via CLASSE '.active'
                listImages.forEach(img => {
                    if (img.getAttribute('data-id') === String(id)) {
                        img.classList.add('active');
                    } else {
                        img.classList.remove('active');
                    }
                });
            }
        }

        function clearSelection() {
            currentSelectedId = null;
            highlightWrapper.innerHTML = '';
            highlightWrapper.style.display = 'none';
            // Remove classe active de todos
            listImages.forEach(img => img.classList.remove('active'));
        }
    }

    function setupGlobalAccordionBehavior() {
        const allDetails = document.querySelectorAll("details");
        allDetails.forEach((targetDetail) => {
            targetDetail.addEventListener("click", (e) => {
                if (e.target.tagName === 'SUMMARY' || e.target.closest('summary')) {
                    allDetails.forEach((detail) => {
                        if (detail !== targetDetail) detail.removeAttribute("open");
                    });
                }
            });
        });
    }

    // =========================================================
    // 5. CARDS DE PRODUTOS EM OFERTA
    // =========================================================
    function renderCardsPromo() {
        const offersData = PRODUCT_DATA.offersData;
        const container = document.getElementsByClassName('grid-promocoes')[0];

        container.innerHTML = offersData.map(produto => {
            const baseOfferText = `Olá. Gostaria de garantir o meu ${produto.title} com a condição especial do site.`;
            const whatsappOfferLink = `https://wa.me/5592994240029?text=${encodeURIComponent(baseOfferText)}`;

            return `
                <div class="card-promo">
                    <img src="${produto.image}" loading="lazy" alt="${produto.title}">
                    <h3>${produto.title}</h3>
                    <p class="preco-antigo">${produto.old_price}</p>
                    <p class="preco-novo">${produto.offer_price}</p>
                    <a href="${whatsappOfferLink}" target="_blank" class="btn-cta btn-small">
                        <i class="fab fa-whatsapp"></i> Comprar Agora
                    </a>
                </div>
            `
        }).join('');
    }
    renderCardsPromo();

    // =========================================================
    // 6. FORMULÁRIO DE CONTATO
    // =========================================================
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            const data = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    alert('Mensagem enviada com sucesso!');
                    form.reset();
                } else {
                    alert('Erro ao enviar. Verifique os dados.');
                }
            } catch (error) {
                alert('Erro de conexão.');
            } finally {
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
            }
        });
    }
});
