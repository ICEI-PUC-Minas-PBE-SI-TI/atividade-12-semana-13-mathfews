const cardSection = document.getElementById('card-section')
function createCard(obj) {
    const card = document.createElement('div')
    card.classList.add('card')
    const name = document.createElement('h2')
    name.textContent = obj.title
    const description = document.createElement('p')
    const ulTags = document.createElement('ul')
    obj.tags.forEach(tag => {
        const liTag = document.createElement('li')
        liTag.textContent = tag
        ulTags.appendChild(liTag)
    })
    description.appendChild(ulTags)
    description.textContent = obj.description
    card.appendChild(name)
    card.appendChild(description)
    return card
}
async function fetchData() {
    const response = await fetch('books')
    const data = await response.json()
    await data.forEach(obj => {
        card = createCard(obj)
        cardSection.appendChild(card)
    })
}
fetchData()