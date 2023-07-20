class AppController {

    constructor(){
        this.shows = [];
    }

    init(){
        this.render()
        DBService.getAllShows().then(shows=>{
            this.shows=shows
            this.renderShows();
        })
    }
    
    render(){
        
        const appContainer = document.getElementById('app');

        appContainer.innerHTML = `
        <header>
            <h1>MOCKFLIX</h1>
            <div id="link-div">
        <a href="./index.html"> lista <a> <br>
        <a href="./new-show.html"> nuova serie <a>
            </div>
        </header>

        <main>
        <div id="btn-div">

        </div>
            
            <div id="show-container">

        
            </div>
        </main>

        <footer>
            <p>i diritti di questa applicazione sono tutti miei non ci provare neanche a rubarli</p>
        </footer>
        `;


    }   

    renderShows(){

        const btnDiv = document.getElementById('btn-div')
        btnDiv.innerHTML=''

        const sortUpButton = document.createElement('button')
        sortUpButton.appendChild(document.createTextNode('Ordina per upvotes'))
        sortUpButton.addEventListener('click',()=>this.sortByUpvotes())
        btnDiv.appendChild(sortUpButton)

        const sortDownButton = document.createElement('button')
        sortDownButton.appendChild(document.createTextNode('Ordina per downvotes'))
        sortDownButton.addEventListener('click',()=>this.sortByDownvotes())
        btnDiv.appendChild(sortDownButton)


        const showsContainer = document.getElementById('show-container')
        showsContainer.innerHTML= ''
        for (let i = 0; i < this.shows.length; i++) {
            const show = this.shows[i];

            const listElement = document.createElement('div')
            const titleNode = document.createTextNode(show.title)
            listElement.classList.add('list-element')
            
            listElement.appendChild(titleNode)

            const upvotesSpan = document.createElement('span')
            upvotesSpan.appendChild(document.createTextNode(show.upvotes))
            listElement.appendChild(upvotesSpan)

            const upButton = document.createElement('button')
            upButton.appendChild(document.createTextNode('👍'))
            upButton.addEventListener('click',()=>this.upvoteShow(show))
            listElement.appendChild(upButton)

            const downvotesSpan = document.createElement('span')
            downvotesSpan.appendChild(document.createTextNode(show.downvotes))
            listElement.appendChild(downvotesSpan)

            const downButton = document.createElement('button')
            downButton.appendChild(document.createTextNode('👎'))
            downButton.addEventListener('click',()=>this.downvoteShow(show))
            listElement.appendChild(downButton)

            showsContainer.appendChild(listElement)
            
        }
    }

    upvoteShow(show){
        DBService.upvote(show).then(show=>{
            this.renderShows();
        })
    }

    downvoteShow(show){
        DBService.downvote(show).then(show=>{
            this.renderShows()
        })
    }

    sortByUpvotes(){
        this.shows.sort((s1,s2) => s1.upvotes - s2.upvotes);
        this.renderShows()
    }

    sortByDownvotes() {
        this.shows.sort((s1,s2) => s1.downvotes - s2.downvotes);
        this.renderShows()
    }

}