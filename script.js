document.addEventListener('DOMContentLoaded', () => {
    // Efeito de rolagem para as seções
    const sections = document.querySelectorAll('main section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Quando 10% da seção é visível
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            } else {
                // Você pode reiniciar o estilo se quiser que elas animem cada vez que entram
                // entry.target.style.opacity = '0';
                // entry.target.style.transform = 'translateY(20px)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0'; // Inicialmente invisível
        section.style.transform = 'translateY(20px)'; // Inicialmente um pouco abaixo
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Rolagem suave para os links do menu (se você adicionar um)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Lógica para as Abas na seção de Desenvolvimento
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    function showTab(tabId) {
        // Remove 'active' de todos os botões e conteúdos
        tabButtons.forEach(button => button.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Adiciona 'active' ao botão clicado e ao conteúdo correspondente
        document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    // Adiciona event listener para cada botão de aba
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            showTab(tabId);
        });
    });

    // Mostra a primeira aba por padrão ao carregar a página
    showTab('overview');
});