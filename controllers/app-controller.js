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

        const newShowButton = document.createElement('button');
        newShowButton.appendChild(document.createTextNode('Nuova serie'));
        newShowButton.addEventListener('click', () => this.openDialog());
        appContainer.appendChild(newShowButton);



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
            this.sortByUpvotes();
            this.renderShows();
            
        })
    }

    downvoteShow(show){
        DBService.downvote(show).then(show=>{
            this.sortByDownvotes()
            this.renderShows();
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

    openDialog() {
        const dialogContainer = document.createElement('div');
        dialogContainer.id = 'dialog-container';
        dialogContainer.innerHTML = `
            <div id="dialog-content">
                <button id="close-btn" onclick="appController.closeDialog()">X</button>
                <h2>Inserisci un nuovo show</h2>
                <form id="create-form" name="create" onsubmit="appController.sendData(event)">
                    <div>
                    <label for="title">Inserisci il titolo</label>
                    <input type="text" name="title" id="title">
                </div>
                <div>
                    <label for="author">Inserisci l'autore</label>
                    <input type="text" name="author" id="author">
                </div>
                <div>
                    <label for="imageUrl">Inserisci il link all'immagine</label>
                    <input type="text" name="imageUrl" id="imageUrl">
                </div>
                <div>
                    <label for="isOver">È conclusa?</label>
                    <input type="checkbox" name="isOver" id="isOver">
                </div>
                <input style="visibility: hidden;" type="number" name="upvotes" id="upvotes" value="0">
                <input style="visibility: hidden;" type="number" name="downvotes" id="downvotes" value="0">
                <button type="submit">Invia</button>
                </form>
            </div>
        `
        ;
        document.body.appendChild(dialogContainer);

        const closeBtn = document.getElementById('close-btn')
        this.closeBtn.addEventListener('click', () => this.closeDialog()) 
    }

    closeDialog() {
        const dialogContainer = document.getElementById('dialog-container');
        if (dialogContainer) {
            dialogContainer.remove();
            this.render()
        }
    }

    sendData(event){
        event.preventDefault();
    
        const form = document.forms['create'];
        const title = form ['title'].value;
        const formData = new FormData(form)
    
        let isOverBool = formData.get('isOver') === 'on'? true : false
    
        const newShow = {
            title: formData.get('title'),
            author: formData.get('author'),
            imageUrl: formData.get('imageUrl'),
            isOver: isOverBool,
            upvotes:0,
            downvotes:0,
        }
    
        this.shows.push(newShow)
        this.closeDialog()
        this.renderShows()
    }


}