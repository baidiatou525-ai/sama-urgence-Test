document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. NAVBAR & RESPONSIVE MOBILE
    // ==========================================
    const navbar = document.querySelector(".navbar");
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        const icon = hamburger.querySelector("i");
        if(navMenu.classList.contains("open")) {
            icon.classList.replace("fa-bars", "fa-xmark");
        } else {
            icon.classList.replace("fa-xmark", "fa-bars");
        }
    });

    // Fermeture du menu mobile lors du clic sur un lien
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            hamburger.querySelector("i").classList.replace("fa-xmark", "fa-bars");
        });
    });

    // ==========================================
    // 2. TOGGLE MODE SOMBRE
    // ==========================================
    const themeToggle = document.getElementById("theme-toggle");
    const htmlElement = document.documentElement;

    // Charger le thème précédemment sauvegardé
    const savedTheme = localStorage.getItem("theme") || "light";
    htmlElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        
        htmlElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        updateThemeIcon(newTheme);
        
        // Mettre à jour les couleurs des graphiques si nécessaire
        updateChartsTheme();
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector("i");
        if (theme === "dark") {
            icon.classList.replace("fa-moon", "fa-sun");
        } else {
            icon.classList.replace("fa-sun", "fa-moon");
        }
    }

    // ==========================================
    // 3. ANIMATION DE DÉFILEMENT (SCROLL REVEAL)
    // ==========================================
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                
                // Si l'élément contient des compteurs à animer
                const numbers = entry.target.querySelectorAll(".stat-number");
                if(numbers.length > 0) {
                    numbers.forEach(num => animateCounter(num));
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // Fonction d'animation des compteurs
    function animateCounter(el) {
        const target = +el.getAttribute("data-target");
        const count = +el.innerText;
        const speed = target / 100; // Ajustement de la vitesse

        if (count < target) {
            el.innerText = Math.ceil(count + speed);
            setTimeout(() => animateCounter(el), 20);
        } else {
            el.innerText = target.toLocaleString();
        }
    }

    // ==========================================
    // 4. CHART.JS GRAPHIC SETUP
    // ==========================================
    const ctxAnalytics = document.getElementById('analyticsChart').getContext('2d');
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    
    let analyticsChart = new Chart(ctxAnalytics, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            datasets: [{
                label: 'Alertes Reçues',
                data: [65, 78, 52, 95, 110, 140, 125],
                borderColor: '#ff334b',
                backgroundColor: 'rgba(255, 51, 75, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(0,0,0,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    let pieChart = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: ['Urgentes', 'Modérées', 'Bénignes'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } }
        }
    });

    function updateChartsTheme() {
        const isDark = htmlElement.getAttribute("data-theme") === "dark";
        const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
        
        analyticsChart.options.scales.y.grid.color = gridColor;
        analyticsChart.update();
    }
    updateChartsTheme();

    // ==========================================
    // 5. INTÉGRATION CARTE LEAFLET INTERACTIVE
    // ==========================================
    // Centré initialement sur Dakar (Sénégal)
    const map = L.map('map').setView([14.7167, -17.4677], 13);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Simulation de points de secours actifs
    const locations = [
        { name: "Hôpital Principal de Dakar", coords: [14.6644, -17.4332], type: "hopital" },
        { name: "CHNU de Fann", coords: [14.6934, -17.4728], type: "hopital" },
        { name: "Base Ambulance SAMU - Mermoz", coords: [14.7089, -17.4812], type: "samu" }
    ];

    locations.forEach(loc => {
        const marker = L.marker(loc.coords).addTo(map);
        marker.bindPopup(`<b>${loc.name}</b><br><span style="color:#ff334b;">Opérationnel 24/7</span>`);
    });

    // ==========================================
    // 6. RACCORDEMENT DES ACTIONS EXISTANTES
    // ==========================================
    document.querySelector(".alert-trigger").addEventListener("click", () => {
        alert("🚨 Alerte d'urgence envoyée avec succès ! Votre position est transmise aux autorités.");
    });

    document.querySelector(".emergency-call").addEventListener("click", () => {
        window.location.href = "tel:1515";
    });
});
