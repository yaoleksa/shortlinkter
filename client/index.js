document.getElementById('submit').addEventListener('click', () => {
    const req = new XMLHttpRequest();
    req.open('POST', 'https://shortlinkter-a9da816b3360.herokuapp.com/', true);
    req.send({
        link: document.getElementById('input').innerText
    });
    req.onload = () => {
        if(req.status !== 201) {
            document.getElementById('result-label').innerText = req.statusText;
        }
        const result = document.getElementById('result');
        result.setAttribute('href', req.response);
        result.innerText = req.response;
    }
});