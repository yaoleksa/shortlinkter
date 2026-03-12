document.getElementById('submit').addEventListener('click', () => {
    const req = new XMLHttpRequest();
    req.open('POST', 'https://shortlinkter-a9da816b3360.herokuapp.com/', true);
    req.send({
        link: document.getElementById('input').innerText
    });
    req.onload = () => {
        console.log(req.response);
    }
});