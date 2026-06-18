const possibleColors = ["default", "blue", "purple", "yellow"]

const cubeIcon = document.getElementById('cube-icon')

cubeIcon.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme')
    document.documentElement.style.transition = "all 0.8s ease-in-out"
    let nextTheme = possibleColors[possibleColors.indexOf(currentTheme) + 1] || 'default'
    document.documentElement.setAttribute('data-theme', nextTheme)
})


async function fetchBook(id) {
    try {
        const response = await fetch(`http://localhost:3000/books/${id}`);
        if (!response.ok) throw new Error('Livro não encontrado'); // funcionou :D
        // todo: estudar mais sobre isso de fetch, throw e etc
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}
function renderDetails(book) {
    const container = document.getElementById('details-section');
    let genreHtml = '';
    if (book.categoria) {
        book.categoria.forEach(cat => {
            genreHtml += `<span class="badge" style="background-color: transparent; padding: 2px; padding-left: 8px;padding-right: 8px; border: 1px solid rgba(0, 0, 0, 0.2); border-radius: 10px; color: #00000084; margin-right: 0.5rem;">${cat}</span>`;
        });
    }

    container.innerHTML = `
        <div class="details-grid">
            <div class="details-cover-side" style="background-image: url(${book.image}); background-size: cover; background-position: center;">
                <div class="cover-glow"></div>
            </div>
            <div class="details-info-side">
                <div class="modal-header-info">
                    <div class="modal-genres" style="margin-bottom: 0.75rem;">${genreHtml}</div>
                    <h2 style="font-family: var(--font-display); font-size: 2.5rem; line-height: 1.2; margin-bottom: 0.25rem; font-weight: 700;">${book.title}</h2>
                    <p class="book-author-name" style="font-size: 1.1rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">${book.author || 'Autor Desconhecido'}</p>
                </div>
                
                <div class="modal-stats" style="margin: 1.5rem 0;">
                    <div class="stat-card">
                        <span class="stat-icon"><i class="fa-solid fa-star" style="color: var(--accent-color);"></i></span>
                        <div class="stat-details">
                            <span class="stat-value">${book.nota ? book.nota.toFixed(1) : 'N/A'}</span>
                            <span class="stat-label">Nota</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-icon"><i class="fa-solid fa-calendar-days"></i></span>
                        <div class="stat-details">
                            <span class="stat-value">${book.year || 'N/A'}</span>
                            <span class="stat-label">Ano</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <span class="stat-icon"><i class="fa-solid fa-heart"></i></span>
                        <div class="stat-details">
                            <span class="stat-value">${book.favoritados || 0}</span>
                            <span class="stat-label">Favoritos</span>
                        </div>
                    </div>
                </div>

                <div class="modal-description-box" style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.5rem;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-secondary);">Sinopse</h3>
                    <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); text-align: justify;">${book.descriptionCheia || book.descriptionCurta || 'Sem sinopse disponível.'}</p>
                </div>
            </div>
        </div>
    `;
}
async function init() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        renderDetails(null);
        return;
    }
    const book = await fetchBook(id);
    renderDetails(book);
}
init();