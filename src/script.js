const buttons = document.getElementsByClassName('button');
const urlInput = document.getElementById('input');

buttons[0].addEventListener('click', () => {
    const APIcall = new XMLHttpRequest();
    const result = document.getElementById('result');
    const resultLabel = document.getElementById('result-label');
    APIcall.open('POST', 'http://127.0.0.1:5000');
    APIcall.onloadend = () => {
        resultLabel.innerText = "Cut down link: ";
        result.setAttribute('href', APIcall.responseText);
        result.innerText = APIcall.responseText;
    }
    APIcall.send(JSON.stringify({
        "link": urlInput.value
    }));
});

buttons[1].addEventListener('click', () => {
    urlInput.value = null;
});