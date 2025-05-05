// Loader Animation
window.addEventListener('load', function() {
    // Wait for everything to load
    setTimeout(function() {
        document.body.classList.add('loaded');
        
        // Remove loader from DOM after animation completes
        setTimeout(function() {
            const loader = document.querySelector('.loader-container');
            if (loader) {
                loader.remove();
            }
        }, 500); // Match this with the CSS transition time
    }, 1000); // Minimum display time
});

// Fallback in case load event doesn't fire
setTimeout(function() {
    document.body.classList.add('loaded');
}, 5000); // Maximum wait time

document.addEventListener('DOMContentLoaded', function() {
    // Configuration des produits avec leurs options
    const productsConfig = {
        "iPhone 12 Pro Max": {
            storage: ["128GB", "256GB", "512GB"],
            colors: ["Rose", "Bleu", "Noir"],
            defaultImage: "assets/boutique/iPhone 12 Pro Max.jpeg"
        },
        "iPhone 13": {
            storage: ["128GB", "256GB"],
            colors: ["Bleu", "Noir", "Blanc"],
            defaultImage: "assets/boutique/iPhone 13.jpeg"
        },
        "iPhone 13 Pro": {
            storage: ["128GB", "256GB", "512GB"],
            colors: ["Gris", "Argent", "Or"],
            defaultImage: "assets/boutique/iPhone 13 Pro.jpeg"
        },
        "iPhone 15": {
            storage: ["128GB", "256GB", "512GB"],
            colors: ["Noir", "Bleu", "Rose"],
            defaultImage: "assets/boutique/iphone15.jpeg"
        },
        "iPhone 16": {
            storage: ["256GB", "512GB", "1TB"],
            colors: ["White", "Noir", "Bleu"],
            defaultImage: "assets/boutique/iphone16.jpeg"
        },
        "iPhone 16 Pro Max": {
            storage: ["256GB", "512GB", "1TB"],
            colors: ["White", "Noir", "Bleu"],
            defaultImage: "assets/boutique/Iphone 16 Pro Max - 256GB.jpeg"
        }
    };

    // Gestion du panier
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBadge = document.getElementById('cart-badge');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItemsContainer = document.getElementById('cart-items-container');
    
    // Mettre à jour le badge du panier
    function updateCartBadge() {
        const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartBadge.textContent = totalItems;
    }
    
    // Ajouter un produit au panier
    function addToCart(product, details, quantity = 1) {
        // Vérifier si le produit existe déjà dans le panier
        const existingItemIndex = cart.findIndex(item => 
            item.product === product && item.details === details
        );
        
        if (existingItemIndex >= 0) {
            // Incrémenter la quantité si le produit existe déjà
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Ajouter un nouvel article
            cart.push({ 
                product, 
                details,
                quantity 
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        
        // Activer le bouton WhatsApp si c'est le premier article
        if (cart.length === 1) {
            whatsappBtn.disabled = false;
        }
        
        return existingItemIndex >= 0;
    }
    
    // Afficher le contenu du panier dans le modal
    function displayCartItems() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartItemsContainer.innerHTML = '';
            return;
        }
        
        emptyCartMessage.style.display = 'none';
        
        let itemsHTML = '';
        
        cart.forEach((item, index) => {
            itemsHTML += `
                <div class="cart-item d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h6 class="mb-1">${item.product}</h6>
                        <small class="text-muted">${item.details}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <div class="quantity-controls me-3">
                            <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-index="${index}" ${item.quantity <= 1 ? 'disabled' : ''}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2">${item.quantity || 1}</span>
                            <button class="btn btn-sm btn-outline-secondary increase-quantity" data-index="${index}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = itemsHTML;
        
        // Gérer la suppression d'articles
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartBadge();
                displayCartItems();
                
                if (cart.length === 0) {
                    whatsappBtn.disabled = true;
                }
            });
        });
        
        // Gérer l'augmentation de la quantité
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                cart[index].quantity = (cart[index].quantity || 1) + 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartBadge();
                displayCartItems();
            });
        });
        
        // Gérer la diminution de la quantité
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartBadge();
                    displayCartItems();
                }
            });
        });
    }
    
    // Initialiser le panier
    updateCartBadge();
    
    // Afficher les articles quand le modal s'ouvre
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', displayCartItems);
    }
    
    // Commander via WhatsApp
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            if (cart.length === 0) return;
            
            let message = "Bonjour SMC BUSINESS,\n\nJe souhaite commander les produits suivants :\n\n";
            
            cart.forEach(item => {
                const quantity = item.quantity || 1;
                message += `- ${item.product} (${item.details}) × ${quantity}\n`;
            });
            
            message += "\nMerci de me contacter pour finaliser la commande.\n\nCordialement,";
            
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/+971568403468?text=${encodedMessage}`);
        });
    }
    
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Créer le corps du message
            const body = `Nom: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
            
            // Ouvrir le client mail par défaut
            window.location.href = `mailto:smoumouni547@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
            
            // Réinitialiser le formulaire
            this.reset();
            
            // Message de confirmation (optionnel)
            alert('Votre client mail va s\'ouvrir. Merci de nous envoyer votre message.');
        });
    }
    
    // Bouton Retour en haut
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Animation au défilement
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.product-card, .card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialiser l'animation
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Initialisation du carousel avec options
    const infoCarousel = document.querySelector('#infoCarousel');
    if (infoCarousel) {
        new bootstrap.Carousel(infoCarousel, {
            interval: 5000,
            pause: 'hover'
        });

        // Transition fluide
        infoCarousel.addEventListener('slide.bs.carousel', function() {
            this.querySelector('.carousel-inner').style.transition = 'transform 0.8s ease';
        });
    }

    // Filtrage des produits
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filtrer les produits
            document.querySelectorAll('.product-item').forEach(item => {
                if (filter === 'all' || item.dataset.category.includes(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Gestion du modal Quick View
    const productModal = document.getElementById('productModal');
    if (productModal) {
        const modalProductTitle = document.getElementById('modalProductTitle');
        const modalProductDetails = document.getElementById('modalProductDetails');
        const modalProductImage = document.getElementById('modalProductImage');
        const storageOptions = document.getElementById('storageOptions');
        const colorOptions = document.getElementById('colorOptions');
        const quantityDisplay = productModal.querySelector('.quantity-display');
        const modalAddBtn = productModal.querySelector('.btn-add-to-cart');

        // Helper pour obtenir les codes couleur
        function getColorCode(color) {
            const colors = {
                "Rose": "#FF9AA2",
                "Bleu": "#B5EAD7",
                "Noir": "#000000",
                "Blanc": "#FFFFFF",
                "Gris": "#767d6c",
                "Vert": "#B5EAD7",
                "Argent": "#C0C0C0",
                "Or": "#FFD700",
                "White": "#FFFFFF"
            };
            return colors[color] || "#CCCCCC";
        }

        // Gestion du modal Quick View
        document.querySelectorAll('.btn-quick-view').forEach(button => {
            button.addEventListener('click', function() {
                const productName = this.dataset.product;
                const productConfig = productsConfig[productName];
                
                // Mettre à jour les informations de base
                modalProductTitle.textContent = productName;
                modalProductImage.src = productConfig.defaultImage;
                
                // Générer les options de stockage
                storageOptions.innerHTML = '';
                productConfig.storage.forEach(option => {
                    storageOptions.innerHTML += `
                        <button type="button" class="btn btn-outline-dark storage-option" data-value="${option}">
                            ${option}
                        </button>
                    `;
                });
                
                // Sélectionner la première option par défaut
                storageOptions.querySelector('.storage-option').classList.add('active');
                
                // Générer les options de couleur
                colorOptions.innerHTML = '';
                productConfig.colors.forEach(color => {
                    const colorCode = getColorCode(color);
                    colorOptions.innerHTML += `
                        <button type="button" class="btn btn-color color-option" 
                                data-value="${color}" 
                                style="background-color: ${colorCode}"
                                title="${color}">
                        </button>
                    `;
                });
                
                // Sélectionner la première couleur par défaut
                colorOptions.querySelector('.color-option').classList.add('active');
                
                // Mettre à jour les détails du produit
                updateModalProductDetails();
                
                // Réinitialiser la quantité
                quantityDisplay.textContent = '1';
                
                // Stocker le produit courant dans le modal
                productModal.dataset.currentProduct = productName;
            });
        });

        // Mise à jour des détails du produit dans le modal
        function updateModalProductDetails() {
            const selectedStorage = storageOptions.querySelector('.storage-option.active').dataset.value;
            const selectedColor = colorOptions.querySelector('.color-option.active').dataset.value;
            modalProductDetails.textContent = `${selectedStorage} - ${selectedColor}`;
        }

        // Gestion des sélections d'options
        productModal.addEventListener('click', function(e) {
            // Sélection du stockage
            if (e.target.classList.contains('storage-option')) {
                storageOptions.querySelectorAll('.storage-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                updateModalProductDetails();
            }
            
            // Sélection de la couleur
            if (e.target.classList.contains('color-option')) {
                colorOptions.querySelectorAll('.color-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                updateModalProductDetails();
            }
            
            // Augmenter la quantité
            if (e.target.closest('.increase-quantity')) {
                let quantity = parseInt(quantityDisplay.textContent);
                quantityDisplay.textContent = quantity + 1;
            }
            
            // Diminuer la quantité
            if (e.target.closest('.decrease-quantity')) {
                let quantity = parseInt(quantityDisplay.textContent);
                if (quantity > 1) {
                    quantityDisplay.textContent = quantity - 1;
                }
            }
            
            // Ajouter au panier
            if (e.target.closest('.btn-add-to-cart')) {
                const productName = productModal.dataset.currentProduct;
                const quantity = parseInt(quantityDisplay.textContent);
                const selectedStorage = storageOptions.querySelector('.storage-option.active').dataset.value;
                const selectedColor = colorOptions.querySelector('.color-option.active').dataset.value;
                const details = `${selectedStorage} - ${selectedColor}`;
                
                const isExisting = addToCart(productName, details, quantity);
                
                // Feedback visuel
                const btn = e.target.closest('.btn-add-to-cart');
                btn.innerHTML = '<i class="fas fa-check me-2"></i>Ajouté';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-success');
                
                setTimeout(() => {
                    const modalInstance = bootstrap.Modal.getInstance(productModal);
                    modalInstance.hide();
                    
                    setTimeout(() => {
                        btn.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Ajouter au panier';
                        btn.classList.remove('btn-success');
                        btn.classList.add('btn-primary');
                    }, 300);
                }, 1000);
            }
        });
    }

    // Initialiser les boutons "Ajouter au panier" dans la boutique
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const details = this.closest('.card-body').querySelector('.product-details').textContent;
            addToCart(product, details);
            
            // Feedback visuel
            this.innerHTML = '<i class="fas fa-check me-2"></i>Ajouté';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Ajouter au panier';
                this.classList.remove('btn-success');
                this.classList.add('btn-primary');
            }, 2000);
        });
    });

    // Animation d'apparition des produits
    function animateProducts() {
        const products = document.querySelectorAll('.product-item');
        
        products.forEach((product, index) => {
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Initialiser les animations
    window.addEventListener('load', animateProducts);
    
});