
  const data = Array.from({ length: 100 })
  .map((_, i) => `Item ${(i + 1)}`)


// ==================================================================================  //




let perPage = 5
const state = {
    page: 1,                                                     //pagina atual
    perPage,                                                   //quantidades de itens por pagina
    totalPage: Math.ceil(data.length / perPage),              //total de paginas
    maxVisibleButtons: 5
}
const html = {
    get(element) {
        return document.querySelector(element)
    }
}


const controls = {
    next() {
        state.page++    //indo para próxima pagina... 

        const lastPage = state.page > state.totalPage
        if (lastPage) {
            state.page--                //se chagar na ultima pagina ira diminuir uma pagina, ficando na mesma pag
        }
    },
    prev() {
        state.page--                //volta a pagina

        if(state.page < 1) {        
            state.page++        //se na 1° pagina clicar para voltar ira add +1, assim nao a menos que 1
        }
    },
    goTo(page) {
        state.page = +page

        if (page > state.totalPage) {
            state.page = state.totalPage       //se o page for maior que o state.totalpage coloque a ultima pagina
        }
    },
    createListeners() {
        html.get('.first').addEventListener('click', () => {
            controls.goTo(1)
            update()
        })

        html.get('.last').addEventListener('click', () => {
            controls.goTo(state.totalPage)
            update()
        })

        html.get('.next').addEventListener('click', () => {
            controls.next()
            update()
        })

        html.get('.prev').addEventListener('click', () => {
            controls.prev(1)
            update()
        })
    }
}

const list = {
    create(item) {        
        const div = document.createElement('div')
        div.classList.add('item')
        div.innerHTML = item

        html.get('.list').appendChild(div)
    },
    update() {
        html.get('.list').innerHTML = ""

        let page = state.page - 1
        let start = page * state.perPage
        let end = start + state.perPage
        
        const paginatedItems = data.slice(start, end)

        paginatedItems.forEach(list.create)
    }
}

const buttons = {
    element: html.get('.pagination .numbers'),
    create(number) {
        const button = document.createElement('div')

        button.innerHTML = number

        if(state.page == number) {              //para mostra que pagina está
            button.classList.add('active')
        }

        button.addEventListener('click', (event) => {
            const page = event.target.innerText

            controls.goTo(page)
            update()
        })
        
        buttons.element.appendChild(button)
        
    },
    update() {
        buttons.element.innerHTML = ""
        const { maxLeft, maxRight } = buttons.calculateMaxVisible()

       for(let page = maxLeft; page <= maxRight; page++) {
            buttons.create(page)
        }

    },
    calculateMaxVisible() {
        const { maxVisibleButtons } = state
        let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
        let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))

        if (maxLeft < 1) {
            maxLeft = 1
            maxRight = maxVisibleButtons
        }

        if (maxRight > state.totalPage) {
            maxLeft = state.totalPage - ( maxVisibleButtons - 1)
            maxRight = state.totalPage

            if(maxLeft < 1) maxLeft = 1
        }

        return {maxLeft, maxRight}
    }
}

function update() {
    list.update()
    buttons.update()
}

function init() {
    update()
    controls.createListeners()
}

init()