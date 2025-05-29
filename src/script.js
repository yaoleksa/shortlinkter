document.getElementById('button').addEventListener('click', () => {
    const APIcall = new XMLHttpRequest();
    APIcall.open('POST', 'http://127.0.0.1:5000');
    APIcall.send({
        "link": document.getElementById('input').value
    });
    console.log(APIcall);
});