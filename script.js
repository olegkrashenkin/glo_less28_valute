'use strict'

const inputIn = document.getElementById('in')
const inputOut = document.getElementById('out')
const btn = document.querySelector('.arrow')
const selectIn = document.getElementById('sel-in')
const selectOut = document.getElementById('sel-out')

const cur = { in: ['RUB', 0], out: ['USD', 1] }

const getData = () => {
    fetch('https://www.cbr-xml-daily.ru/daily_json.js')
        .then(res => res.json())
        .then(data => {
            selectIn.querySelectorAll('option').forEach(el => {
                data['Valute'][el.value] ? el.value = data['Valute'][el.value]['Value'] : el.value = 1
            })
            selectOut.querySelectorAll('option').forEach(el => {
                data['Valute'][el.value] ? el.value = data['Valute'][el.value]['Value'] : el.value = 1
            })
        })
        .catch(err => console.log(err.message))
}

const animate = ({ timing, draw, duration }) => {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}

const showConvertValue = (value) => {
    animate({
        duration: 150,
        timing(timeFraction) {
            return timeFraction;
        },
        draw(progress) {
            inputOut.value = (progress * value).toFixed(2);
        }
    });
}

const convert = () => {
    let tmp

    switch (cur.in[0]) {
        case 'RUB':
            return showConvertValue(+inputIn.value / +selectOut.options[selectOut.selectedIndex].value)
        case 'USD':
            if (cur.out[0] === 'RUB') {
                tmp = +inputIn.value * +selectIn.options[selectIn.selectedIndex].value
            } else if (cur.out[0] === 'EUR') {
                tmp = +inputIn.value * +selectIn.options[selectIn.selectedIndex].value
                    / +selectOut.options[selectOut.selectedIndex].value
            } else {
                tmp = inputIn.value
            }
            return showConvertValue(tmp)
        case 'EUR':
            if (cur.out[0] === 'RUB') {
                tmp = +inputIn.value * +selectIn.options[selectIn.selectedIndex].value
            } else if (cur.out[0] === 'USD') {
                tmp = +inputIn.value * +selectIn.options[selectIn.selectedIndex].value
                    / +selectOut.options[selectOut.selectedIndex].value
            } else {
                tmp = inputIn.value
            }
            return showConvertValue(tmp)
    }
}

const isChange = (event, changeVar) => {
    changeVar[0] = event.target.options[event.target.selectedIndex].textContent
    changeVar[1] = event.target.selectedIndex
}

const firstValidate = (event) => {
    event.target.value = event.target.value.replace(/[^\d\.]/g, '')
}

const lastValidate = () => {
    inputIn.value = parseFloat(inputIn.value.replace(/\.{2,}/g, '.').replace(/^\./g, '').replace(/\.$/g, ''))
    convert()
}

getData()

inputIn.addEventListener('input', (e) => firstValidate(e))

selectIn.addEventListener('change', (e) => isChange(e, cur.in))

selectOut.addEventListener('change', (e) => isChange(e, cur.out))

btn.addEventListener('click', () => lastValidate())