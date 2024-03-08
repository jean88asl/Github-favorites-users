import { GithubUser } from "./GitHubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.container = this.root.querySelector('.container')
        this.load()
        this.onadd()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorities:')) || []
    }    

    save() {
        localStorage.setItem('@github-favorities:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExist = this.entries.find(entry => entry.login === username)

            if (userExist) {
                throw new Error('The user is already registered!')
            }

            const user = await GithubUser.search(username) 
            console.log(user)

            if (user.login === undefined) {
                throw new Error('User not found') 
            }

            this.container.style.display = 'none'
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        } catch (error) { 
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries

        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search #input-search')

            this.add(value.trim())
        }
    }

    update() {
        this.removeAllTr()

        if (this.entries.length === 0) {
            this.container.style.display = 'flex'
        } 

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `image of ${user.login}`
            row.querySelector('.user a').href = `http://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').innerText = user.public_repos
            row.querySelector('.followers').innerText = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Remove this user?')

                if (isOk) this.delete(user)
            }
            this.tbody.append(row)
        })
    }
   
    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/jean88asl.png" alt="image of jean88asl">
            <a href="http://" target="_blank" rel="noopener noreferrer">
                <p>
                    Jeander Augusto 
                </p>
                <span>/jean88asl</span>
            </a>
        </td>
        <td class="repositories">
            123
        </td>
        <td class="followers">
            1564
        </td>
        <td>
            <button class="remove">remover</button>
        </td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
            .forEach(tr => {
                tr.remove()
            })
    }
}