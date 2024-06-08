//endpoints
const baseURL ="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const fallbackURL = 'https://2024-03-06.currency-api.pages.dev/v1/currencies/eur.json';  // Fallback API URL

let fromCurr= document.querySelector('.from select');
let toCurr= document.querySelector('.to select');
const dropdowns = document.querySelectorAll('select');
const btn = document.querySelector('form button');
const msg = document.querySelector('.msg');
const reverse= document.querySelector('.reverse');
let finAmount = document.querySelector('.finAmount');

reverse.addEventListener('click', ()=>{
    let temp= toCurr.value;
    toCurr.value=fromCurr.value;
    fromCurr.value=temp;
    updateFlag(toCurr);
    updateFlag(fromCurr)
});
const updateExchangeRate=async ()=>{
    let amount = document.querySelector('.img input')
    let amountValue= amount.value;
    if(!amountValue || amountValue<1){
        amountValue=1;
        amount.value ="1";
    }
    try {
        const URL = `${baseURL}/${fromCurr.value.toLowerCase()}.json`;
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        let finalAmt = amountValue * rate;
        msg.innerText = `${amountValue} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
        finAmount.innerText= finalAmt;        
    } catch (error) {
        console.log('E: ',error);
        // Fallback URL
        try {
            let fallbackResponse = await fetch(fallbackURL);
            if (!fallbackResponse.ok) { 
                //ok results in boolean whether respomse was successful or not
                throw new Error('Fallback network response was not ok');
                //throws a new error object
            }
            let data = await fallbackResponse.json();
            let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
            let finalAmt = amountValue * rate;
            msg.innerText=`${amountValue} ${fromCurr.value} = ${finalAmt} ${toCurr.value}`;
            finAmount.innerText = finalAmt;
        } catch (fallbackError) {
            console.log('Fallback error: ', fallbackError);
            // Handle fallback failure
        }
    }
};
window.addEventListener('load', ()=>{
    updateExchangeRate();
});
for(let select of dropdowns){
    for (let currCode in countryList){
        let newOption = document.createElement('option');
        newOption.innerText= currCode;
        newOption.value = currCode;
        if(select.name==='from' && currCode === 'USD'){
            newOption.selected ="selected"
        } else if(select.name==='to' && currCode === 'INR'){
            newOption.selected ="selected"
        }
        select.append(newOption);
    }
    select.addEventListener('change', (e)=>{
        updateFlag(e.target);  

    })
};
const updateFlag =(element)=>{
    let currCode= element.value;
    let countryCode = countryList[currCode];
    let newSrc =`https://flagsapi.com/${countryCode}/flat/64.png`
    let img =element.parentElement.nextElementSibling.querySelector('img');
    img.src = newSrc;
};
btn.addEventListener('click', (e)=>{
    e.preventDefault();
    updateExchangeRate();
});