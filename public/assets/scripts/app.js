const cardSection = document.getElementById('card-section')
function createCard(obj) {
    const card = document.createElement('div')
    card.classList.add('card')
    const name = document.createElement('h2')
    name.textContent = obj.title
    const description = document.createElement('p')
    const ulTags = document.createElement('ul')
    obj.genres.forEach(genre => {
        const liTag = document.createElement('li')
        liTag.textContent = genre
        ulTags.appendChild(liTag)
    })
    description.appendChild(ulTags)
    description.textContent = obj.description
    card.appendChild(name)
    card.appendChild(description)
    const button = document.createElement("button")
    button.textContent = "Ver Detalhes"
    card.appendChild(button)
    return card
}

async function fetchData() {
    const response = await fetch('books')
    const data = await response.json()
    data.forEach((book) => {
        const card = createCard(book)
        cardSection.appendChild(card)
    })
}

fetchData()