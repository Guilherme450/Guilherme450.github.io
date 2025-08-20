// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const mobileMenu = document.querySelector('.mobile-menu');
const sidebar = document.querySelector('.sidebar');
const closeSidebar = document.querySelector('.close-sidebar');
const sidebarLinks = document.querySelectorAll('.sidebar-links a');
const resumeSectionLinks = document.querySelectorAll('.resume-section-link');
const resumeSections = document.querySelectorAll('.resume-section');
const contactForm = document.getElementById('contactForm');
const languageSelect = document.getElementById('language-select');

// i18n
async function loadLanguage(lang) {
    const response = await fetch(`locales/${lang}.json`);
    const translations = await response.json();
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = translations[key];
    });
}

languageSelect.addEventListener('change', (e) => {
    loadLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'pt';
    languageSelect.value = savedLanguage;
    loadLanguage(savedLanguage);

    new Splide('.splide', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '1rem',
        pagination: false,
        breakpoints: {
            768: {
                perPage: 1,
            },
            991: {
                perPage: 2,
            }
        }
    }).mount();
});


// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.innerHTML = body.classList.contains('dark-mode') ?
        '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// Mobile Menu
mobileMenu.addEventListener('click', () => {
    sidebar.classList.add('active');
});

closeSidebar.addEventListener('click', () => {
    sidebar.classList.remove('active');
});

sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});

// Resume Tabs
resumeSectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        resumeSectionLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const sectionId = link.getAttribute('data-section');

        resumeSections.forEach(section => {
            section.classList.remove('active');
        });

        document.getElementById(sectionId).classList.add('active');
    });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');

function checkReveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', checkReveal);
window.addEventListener('resize', checkReveal);
window.addEventListener('load', checkReveal);

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '';
        header.style.boxShadow = '';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Selecionar elementos importantes
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Criar elemento de status se não existir
    let statusDiv = document.getElementById('form-status');
    if (!statusDiv) {
        statusDiv = document.createElement('div');
        statusDiv.id = 'form-status';
        statusDiv.className = 'mt-3';
        contactForm.appendChild(statusDiv);
    }

    // Função para atualizar o status
    const updateStatus = (type, message) => {
        const statusClasses = {
            sending: 'sending',
            success: 'success',
            error: 'error'
        };

        statusDiv.innerHTML = `<p class="${statusClasses[type]}">${message}</p>`;
        statusDiv.style.display = 'block';
    };

    // Função para validar formulário
    const validateForm = (formData) => {
        if (!formData.name.trim()) return 'Por favor, informe seu nome.';

        if (!formData.email.trim()) return 'Por favor, informe seu e-mail.';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Por favor, informe um e-mail válido.';

        if (!formData.message.trim()) return 'Por favor, escreva uma mensagem.';

        return null; // Sem erros
    };

    // Manipulador do evento de envio do formulário
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Desativar botão durante o envio
        submitButton.disabled = true;

        // Coletar dados do formulário
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Validar dados
        const validationError = validateForm(formData);
        if (validationError) {
            updateStatus('error', validationError);
            submitButton.disabled = false;
            return;
        }

        // Mostrar mensagem de carregamento
        updateStatus('sending', 'Enviando mensagem...');

        try {
            // Enviar o email usando EmailJS
            const response = await emailjs.send(
                'service_3vw38w3',
                'template_w9w5l1j',
                formData
            );

            console.log('Email enviado com sucesso:', response.status, response.text);
            updateStatus('success', 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            updateStatus('error', 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
        } finally {
            // Reativar botão após o envio
            submitButton.disabled = false;
        }
    });
});