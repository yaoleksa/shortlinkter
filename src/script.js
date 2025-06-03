document.getElementById('button').addEventListener('click', () => {
    const APIcall = new XMLHttpRequest();
    const result = document.getElementById('result');
    const resultLabel = document.getElementById('result-label');
    APIcall.open('POST', 'http://127.0.0.1:5000');
    APIcall.onloadend = () => {
        console.log();
        resultLabel.innerText = "Cut down link: ";
        result.setAttribute('href', APIcall.responseText);
        result.innerText = APIcall.responseText;
    }
    APIcall.send(JSON.stringify({
        "link": document.getElementById('input').value
    }));
});