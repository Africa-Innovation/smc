document.addEventListener('DOMContentLoaded', function() {
    // Gestion du panier
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartBadge = document.getElementById('cart-badge');
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartItemsContainer = document.getElementById('cart-items-container');
     
    
    // Mettre à jour le badge du panier
    function updateCartBadge() {
        cartBadge.textContent = cart.length;
    }
    
    // Ajouter un produit au panier
    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseInt(this.dataset.price);
            
            cart.push({ product, price });
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
            
            // Feedback visuel
            this.innerHTML = '<i class="fas fa-check me-2"></i>Ajouté';
            this.classList.remove('btn-primary');
            this.classList.add('btn-success');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-cart-plus me-2"></i>Ajouter au panier';
                this.classList.remove('btn-success');
                this.classList.add('btn-primary');
            }, 2000);
            
            // Activer le bouton WhatsApp si c'est le premier article
            if (cart.length === 1) {
                whatsappBtn.disabled = false;
            }
        });
    });
    
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
                <div class="cart-item">
                    <div>
                        <h6>${item.product}</h6>
                    </div>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
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
    }
    
    // Initialiser le panier
    updateCartBadge();
    
    // Afficher les articles quand le modal s'ouvre
    const cartModal = document.getElementById('cartModal');
    cartModal.addEventListener('show.bs.modal', displayCartItems);
    
    // Commander via WhatsApp
    whatsappBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        let message = "Bonjour SMC BUSINESS,\n\nJe souhaite commander les produits suivants :\n\n";
        
        cart.forEach(item => {
            message += `- ${item.product}\n`;
        });
        
        message += "\nMerci de me contacter pour finaliser la commande.\n\nCordialement,";
        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/+971568403468?text=${encodedMessage}`);
    });
    
    // Gestion du formulaire de contact
    // Gestion du formulaire de contact
const contactForm = document.getElementById('contactForm');
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
    
    // Bouton Retour en haut
    const backToTopButton = document.querySelector('.back-to-top');
    
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

    // script.js
// Initialisation du carousel avec options
const infoCarousel = new bootstrap.Carousel('#infoCarousel', {
    interval: 5000, // Change toutes les 5 secondes
    pause: 'hover'  // Pause au survol
});

// Vous pouvez aussi ajouter des animations
document.querySelectorAll('.carousel-item').forEach((item, index) => {
    item.dataset.bsInterval = index === 0 ? '5000' : '6000';
});
// Transition fluide
document.querySelector('#infoCarousel').addEventListener('slide.bs.carousel', function () {
    this.querySelector('.carousel-inner').style.transition = 'transform 0.8s ease';
});
});

