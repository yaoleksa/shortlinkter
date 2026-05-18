const input = document.getElementById('input');
document.getElementById('clear').addEventListener('click', () => {
    input.value = '';
});
document.getElementById('submit').addEventListener('click', () => {
    const req = new XMLHttpRequest();
    const inputURL = input.value;
    if(inputURL.length < 1) {
        alert('Input cannot be empty!');
        return;
    }
    req.open('POST', 'https://shortlinkter-a9da816b3360.herokuapp.com/', true);
    req.send(JSON.stringify({
        "link": `${inputURL}`
    }));
    req.onload = () => {
        if(req.status !== 201) {
            document.getElementById('result-label').innerText = req.statusText;
        }
        const result = document.getElementById('result');
        result.setAttribute('href', req.response);
        result.innerText = req.response;
    };
    req.onerror = err => console.error(err.message);
});