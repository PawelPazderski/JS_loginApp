//nav items
const leftMenu = document.querySelector(".nav-left-items");
const rightMenu = document.querySelector(".nav-right-items");
const registerNavButton = document.querySelector(".nav-register-button");
const loginNavButton = document.querySelector(".nav-login-button");
//register and login containers
const registerView = document.querySelector(".register-container");
const loginView = document.querySelector(".login-container");
//register form items
const regName = document.getElementById("register-name");
const regPassword = document.getElementById("register-password");
const regEmail = document.getElementById("register-email");
const regEmailConfirm = document.getElementById("register-confirm-email");
const regInputs = document.querySelectorAll(".register-container input");
const regErrors = document.querySelectorAll(".form-error");
//login form items
const logName = document.getElementById("login-name");
const logPassword = document.getElementById("login-password");
const showPassword = document.querySelector(".show-password");
//managing register / login views
registerNavButton.addEventListener("click", handleRegisterView);
loginNavButton.addEventListener("click", handleLoginView);
//password items on login view - managing password input view password/text
logPassword.addEventListener("input", showPasswordValueIcon);
showPassword.addEventListener("click", showPasswordValue);

document.querySelector(".nav-logo").addEventListener('click', () => location.reload() )

//starting with local storage check if the user exists / is logged in
checkLocalStorage()

//MANAGING REGISTER / LOGIN VIEWS
function handleRegisterView(e) {
    e.preventDefault()
    registerNavButton.classList.add("d-none");
    loginNavButton.classList.remove("d-none");
    registerView.classList.remove("d-none");
    loginView.classList.add("d-none");
    clearForm()
}

function handleLoginView(e) {
    e.preventDefault()
    loginNavButton.classList.add("d-none");
    registerNavButton.classList.remove("d-none");
    loginView.classList.remove("d-none");
    registerView.classList.add("d-none");
    clearForm()
}

//clear both forms and removing alerts from register form
function clearForm() {
    regName.value = "";
    regPassword.value = "";
    regEmail.value = "";
    regEmailConfirm.value = "";
    logName.value = "";
    logPassword.value = "";
    for ( let item of regErrors ) {
        item.classList.add("d-none")
    }
    showPassword.classList.add("d-none");
    showPassword.innerHTML=`<i class="fa-solid fa-eye"></i>`;
    logPassword.setAttribute("type", "password")
}

//ADDITIONAL FUNCTIONS
//customized alert
function tempAlert(msg, duration) {
    const bg = document.createElement("div");
    const el = document.createElement("div");
    el.classList.add("myAlert");
    bg.classList.add("myAlert-bg")
    el.innerHTML = `
        <img src="./assets/body_illustration_dollar.svg" style="width: 50px; height:50px; margin-bottom:1rem"/>    
        <span>${msg}<span/>
    `;
    setTimeout(function () {
        el.parentElement.removeChild(el);
        bg.parentElement.removeChild(bg);
    }, duration);
    document.body.appendChild(el);
    document.body.appendChild(bg);
}







