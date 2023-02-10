const registrationForm = document.querySelector(".register-form");
registrationForm.addEventListener("submit", handleRegister);

//regex for name validation
//first regex to validate length, one digit and define allowed symbols
const regexNameOne = new RegExp(/^(?=.*?\d)[a-z0-9\-\_\[\]\\\\\/ąćężśźłóń]{6,16}$/i);
//second regex to loop through the string and get the number of letters in it
const regexNameTwo = new RegExp(/[a-ząćężśźłóń]/i);

async function handleRegister(e) {
    e.preventDefault();
    //inputs validation
    //name
    if(validateNameExtra(regName.value)) {
        regName.parentElement.nextElementSibling.classList.add("d-none")
    } else {
        regName.parentElement.nextElementSibling.classList.remove("d-none");
        regName.addEventListener("input", checkNameInput);
    }
    //password
    if(/.{6,}/.test(regPassword.value)) {
        regPassword.parentElement.nextElementSibling.classList.add("d-none")
    } else {
        regPassword.parentElement.nextElementSibling.classList.remove("d-none");
        regPassword.addEventListener("input", checkPasswordInput);
    }
    //email
    if (validateEmail(regEmail.value)) {
        regEmail.parentElement.nextElementSibling.classList.add("d-none")
    } else {
        regEmail.parentElement.nextElementSibling.classList.remove("d-none");
        regEmail.addEventListener("input", checkEmailInput);
    }
    //email confirm
    if (regEmail.value!=regEmailConfirm.value || !regEmailConfirm.value.length) {
        regEmailConfirm.parentElement.nextElementSibling.classList.remove("d-none");
        regEmailConfirm.addEventListener("input", checkEmailConfirmInput);
    } else {
        regEmailConfirm.parentElement.nextElementSibling.classList.add("d-none")
    }
    //check if there are any alerts
    if(document.querySelectorAll(".register-form .d-none").length != document.querySelectorAll(".register-form input").length) {
        tempAlert("Wypełnij poprawnie formularz!",2000)
        return
    }

    const dataToStore = await getData().catch(error => {
        throw new Error(error.message)
    });

    saveToLocalStorage({name: regName.value, password: crypt('OURsecret', regPassword.value), email: regEmail.value, bank: dataToStore})
    checkLocalStorage();
    regName.removeEventListener("input", checkNameInput);
    regPassword.removeEventListener("input", checkPasswordInput);
    regEmail.removeEventListener("input", checkEmailInput);
    regEmailConfirm.removeEventListener("input", checkEmailConfirmInput);
}

//name validation 6-16 characters, minimum one digit, minimum 5 letters, allowed: letters(polish allowed), digits and - _ [ ] \ / 
function validateNameExtra(str){
    let lettersArr = [];
    for(let item of str) {
        if (regexNameTwo.test(item)) {
            lettersArr.push(item)
        }
    }
    if (regexNameOne.test(str) && lettersArr.length >= 5) {
        return true
    }
    return false
}

//validation functions added after failing registration attempt - in order to remove error information when input validated successfully on input change
function checkNameInput(e) {
    if(validateNameExtra(e.currentTarget.value)){
        e.target.parentElement.nextElementSibling.classList.add("d-none")
    } else {
        e.target.parentElement.nextElementSibling.classList.remove("d-none")
    }
}

function checkPasswordInput(e) {
    if(/.{6,}/.test(regPassword.value)) {
        e.target.parentElement.nextElementSibling.classList.add("d-none")
    } else {
        e.target.parentElement.nextElementSibling.classList.remove("d-none")
    }
}

function checkEmailInput(e) {
    if (validateEmail(e.target.value)) {
        e.target.parentElement.nextElementSibling.classList.add("d-none")
    } else {
        e.target.parentElement.nextElementSibling.classList.remove("d-none")
    }
}

function checkEmailConfirmInput(e) {
    if (regEmail.value!=e.target.value || !e.target.value.length) {
        e.target.parentElement.nextElementSibling.classList.remove("d-none")
    } else {
        e.target.parentElement.nextElementSibling.classList.add("d-none")
    }
}

//code and decode password fuctions
function crypt(salt, text) {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};

function decrypt(salt, encoded) {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
};









