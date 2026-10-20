/* ==========================================================================
   CONFIGURACIÓN PRINCIPAL DE LA BARBERÍA
   ========================================================================== */
const CONFIG = {
    // Número de WhatsApp con código de país (ej. 521XXXXXXXXXX para México)
    whatsappNumber: '5210000000000',
    nombreBarberia: '[NOMBRE DE LA BARBERÍA]'
};

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar componentes
    initMobileMenu();
    initServiceCalculator();
    initYear();
});

/* ==========================================================================
   1. MENÚ MÓVIL RESPONSIVO
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

/* ==========================================================================
   2. CALCULADORA DE SERVICIOS Y AGENDADOR POR WHATSAPP
   ========================================================================== */
function initServiceCalculator() {
    const serviceCards = document.querySelectorAll('.service-card');
    const selectedList = document.getElementById('selectedList');
    const totalPriceEl = document.getElementById('totalPrice');
    const bookingForm = document.getElementById('bookingForm');

    if (!serviceCards.length || !selectedList || !totalPriceEl || !bookingForm) return;

    let selectedServices = [];

    // Manejar selección de servicios
    serviceCards.forEach(card => {
        const checkbox = card.querySelector('.service-checkbox');

        card.addEventListener('click', (e) => {
            // Evitar doble evento si se hace clic directamente en el checkbox
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'), 10);

            if (checkbox.checked) {
                card.classList.add('selected');
                selectedServices.push({ name, price });
            } else {
                card.classList.remove('selected');
                selectedServices = selectedServices.filter(item => item.name !== name);
            }

            updateSummary();
        });
    });

    // Actualizar el resumen visual y el total
    function updateSummary() {
        selectedList.innerHTML = '';

        if (selectedServices.length === 0) {
            selectedList.innerHTML = '<li class="empty-msg">No has seleccionado ningún servicio.</li>';
            totalPriceEl.textContent = '$0 MXN';
            return;
        }

        let total = 0;
        selectedServices.forEach(item => {
            total += item.price;
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.name}</span><span>$${item.price} MXN</span>`;
            selectedList.appendChild(li);
        });

        totalPriceEl.textContent = `$${total} MXN`;
    }

    // Envío del formulario hacia WhatsApp
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (selectedServices.length === 0) {
            alert('Por favor, selecciona al menos un servicio antes de agendar tu cita.');
            return;
        }

        const name = document.getElementById('clientName').value.trim();
        const barber = document.getElementById('barberSelect').value;
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;

        // Calcular total final
        const total = selectedServices.reduce((sum, item) => sum + item.price, 0);

        // Construir lista de servicios para el texto
        const servicesText = selectedServices.map(s => `• ${s.name} ($${s.price} MXN)`).join('\n');

        // Mensaje formateado para WhatsApp
        const message = `¡Hola! Me gustaría agendar una cita en ${CONFIG.nombreBarberia}.\n\n` +
            `👤 *Nombre:* ${name}\n` +
            `💈 *Barbero:* ${barber}\n` +
            `📅 *Fecha:* ${date}\n` +
            `⏰ *Hora:* ${time}\n\n` +
            `✂ *Servicios seleccionados:*\n${servicesText}\n\n` +
            `💰 *Total estimado:* $${total} MXN`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;

        // Abrir WhatsApp en pestaña nueva
        window.open(whatsappUrl, '_blank');
    });
}

/* ==========================================================================
   3. AÑO AUTOMÁTICO EN PIE DE PÁGINA
   ========================================================================== */
function initYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}