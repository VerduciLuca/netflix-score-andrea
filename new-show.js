function sendData(event){
    event.preventDefault();

    const form = document.forms['create'];
    // const title = form ['title'].value;
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

    DBService.createShow(newShow).then(show => window.location = './index.html')
}