const cardSection = document.getElementById('card-section')
const searchInput = document.getElementById('search-input')
const modal = document.getElementById('book-modal')
const modalCloseBtn = document.getElementById('modal-close-btn')

let allBooks = []
let activeCategory = 'all'
let searchQuery = ''

function getCoverGradient(obj) {
    if (obj.categoria && obj.categoria.length > 0) {
        const cat = obj.categoria[0].toLowerCase();
        if (cat.includes('ficção') || cat.includes('distopia')) {
            return 'var(--cover-gradient-1)';
        } else if (cat.includes('romance')) {
            return 'var(--cover-gradient-2)';
        } else if (cat.includes('fantasia')) {
            return 'var(--cover-gradient-3)';
        } else if (cat.includes('aventura') || cat.includes('clássico')) {
            return 'var(--cover-gradient-4)';
        }
    }
    
    const grads = [
        'var(--cover-gradient-1)', 
        'var(--cover-gradient-2)', 
        'var(--cover-gradient-3)', 
        'var(--cover-gradient-4)'
    ];
    return grads[obj.id % grads.length];
}

function createCard(obj) {
    const card = document.createElement('div')
    card.classList.add('card')
    
    const coverGradient = getCoverGradient(obj)
    
    const cover = document.createElement('img')
    cover.classList.add('card-cover')
    cover.href = obj.image
    
    const coverTitle = document.createElement('div')
    coverTitle.classList.add('cover-title')
    coverTitle.textContent = obj.title
    cover.appendChild(coverTitle)
    
    const coverIcon = document.createElement('i')
    coverIcon.className = 'fa-solid fa-book-open cover-book-icon'
    cover.appendChild(coverIcon)
    
    card.appendChild(cover)
    
    const content = document.createElement('div')
    content.classList.add('card-content')
    
    const infoArea = document.createElement('div')
    infoArea.classList.add('card-info')
    
    const author = document.createElement('span')
    author.classList.add('card-author')
    author.textContent = obj.author || 'Autor Desconhecido'
    infoArea.appendChild(author)
    
    const name = document.createElement('h2')
    name.classList.add('card-title-main')
    name.textContent = obj.title
    infoArea.appendChild(name)
    
    const description = document.createElement('p')
    description.classList.add('card-description')
    description.textContent = obj.descriptionCurta
    
    const ulTags = document.createElement('ul')
    if (obj.categoria) {
        obj.categoria.forEach(categoria => {
            const liTag = document.createElement('li')
            liTag.textContent = categoria
            ulTags.appendChild(liTag)
        })
    }
    description.appendChild(ulTags)
    infoArea.appendChild(description)
    content.appendChild(infoArea)
    
    const meta = document.createElement('div')
    meta.classList.add('card-meta')
    
    const rating = document.createElement('span')
    rating.classList.add('meta-rating')
    rating.innerHTML = `<i class="fa-solid fa-star"></i> ${obj.nota ? obj.nota.toFixed(1) : 'N/A'}`
    meta.appendChild(rating)
    
    const stats = document.createElement('div')
    stats.classList.add('meta-stats')
    
    const yearSpan = document.createElement('span')
    yearSpan.innerHTML = `<i class="fa-regular fa-calendar"></i> ${obj.year || ''}`
    stats.appendChild(yearSpan)
    
    const heartSpan = document.createElement('span')
    heartSpan.innerHTML = `<i class="fa-regular fa-heart"></i> ${obj.favoritados || 0}`
    stats.appendChild(heartSpan)
    
    meta.appendChild(stats)
    content.appendChild(meta)
    cover.style.cursor = 'pointer'
    cover.addEventListener('click', () => {
        openModal(obj, coverGradient)
    })

    const button = document.createElement("button")
    button.classList.add('card-button')
    button.innerHTML = `<span>Ver Detalhes</span> <i class="fa-solid fa-arrow-right"></i>`
    button.addEventListener('click', (e) => {
        e.stopPropagation()
        window.location.href = `details.html?id=${obj.id}`
    })
    content.appendChild(button)
 
    card.appendChild(content)
    
    return card
}

function renderCards(books) {
    if (!cardSection) return
    cardSection.innerHTML = ''
    
    if (books.length === 0) {
        const noResults = document.createElement('div')
        noResults.classList.add('no-results')
        noResults.innerHTML = `
            <i class="fa-solid fa-magnifying-glass"></i>
            <h3>Nenhum livro encontrado</h3>
            <p>Tente buscar por outros termos ou verifique se digitou corretamente.</p>
        `
        cardSection.appendChild(noResults)
        return
    }
    
    books.forEach((book) => {
        const card = createCard(book)
        cardSection.appendChild(card)
    })
}

function getCategories(books) {
    const categoriesSet = new Set()
    books.forEach(book => {
        if (book.categoria) {
            book.categoria.forEach(c => categoriesSet.add(c))
        }
    })
    return Array.from(categoriesSet)
}

function renderCategoryFilters(categories) {
    const filterContainer = document.getElementById('category-filters')
    if (!filterContainer) return
    
    filterContainer.innerHTML = ''
    
    const allTab = document.createElement('button')
    allTab.classList.add('filter-tab')
    if (activeCategory === 'all') allTab.classList.add('active')
    allTab.textContent = 'Todos'
    allTab.addEventListener('click', () => {
        activeCategory = 'all'
        renderPage()
    })
    filterContainer.appendChild(allTab)
    
    categories.forEach(category => {
        const tab = document.createElement('button')
        tab.classList.add('filter-tab')
        if (activeCategory === category) tab.classList.add('active')
        tab.textContent = category
        tab.addEventListener('click', () => {
            activeCategory = category
            renderPage()
        })
        filterContainer.appendChild(tab)
    })
}

function renderPage() {
    const filtered = allBooks.filter(book => {
        const matchesCategory = activeCategory === 'all' || 
            (book.categoria && book.categoria.includes(activeCategory))
            
        const matchesSearch = searchQuery === '' || 
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (book.author && book.author.toLowerCase().includes(searchQuery.toLowerCase()))
            
        return matchesCategory && matchesSearch
    })
    
    renderCards(filtered)
    
    const categories = getCategories(allBooks)
    renderCategoryFilters(categories)
}

function openModal(book, coverGradient) {
    if (!modal) return
    
    const modalCover = document.getElementById('modal-cover')
    if (modalCover) {
        modalCover.style.background = coverGradient
    }
    
    const modalTags = document.getElementById('modal-tags')
    if (modalTags) {
        modalTags.innerHTML = ''
        if (book.categoria) {
            book.categoria.forEach(cat => {
                const badge = document.createElement('span')
                badge.classList.add('badge')
                badge.textContent = cat
                modalTags.appendChild(badge)
            })
        }
    }
    
    document.getElementById('modal-title').textContent = book.title
    document.getElementById('modal-author').textContent = book.author || 'Autor Desconhecido'
    document.getElementById('modal-rating').textContent = book.nota ? book.nota.toFixed(1) : 'N/A'
    document.getElementById('modal-year').textContent = book.year || 'N/A'
    document.getElementById('modal-favorites').textContent = book.favoritados || 0
    document.getElementById('modal-description').textContent = book.descriptionCheia || book.descriptionCurta || 'Sem sinopse disponível.'
    
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
}

function closeModal() {
    if (!modal) return
    modal.classList.add('hidden')
    document.body.style.overflow = ''
}

async function fetchItems() {
    try {
        const response = await fetch('/books')
        if (!response.ok) throw new Error('Falha ao buscar dados do servidor.')
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
        return []
    }
}

async function init() {
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value
            renderPage()
        })
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal)
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal()
        })
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal()
    })
    
    allBooks = await fetchItems()
    renderPage()
}

init()