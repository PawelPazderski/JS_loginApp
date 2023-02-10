const loginForm = document.querySelector(".login-form");
const logoutButton = document.querySelector(".nav-logout-button");

loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);

//regex for mail validation
const regexMail = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/);

//LOGIN
function handleLogin(e) {
    e.preventDefault();
    //both inputs must be filled
    if (!logName.value.length || !logPassword.value.length) {
        tempAlert("Podaj nazwę lub Email i hasło", 2000);
        return
    }
    //if db is empty switch to register
    if(dbUsers === null ) {
        tempAlert(regexMail.test(logName.value) ? "Nie ma takiego użytkownika. Możesz zarejestrować konto dla podanego adresu email" : "Nie ma takiego użytkownika. Zarejestruj konto", 2000);
        switchToRegister()
        return
    }
    //check db and login user if data is correct - name/email/email alias (email@xyz.yz = email+alias@xyz.yz) + password
    for (let i=0 ; i<dbUsers.length ; i++) {
        if ((dbUsers[i].name === logName.value && decrypt("OURsecret", dbUsers[i].password) === logPassword.value) || (dbUsers[i].email === logName.value && decrypt("OURsecret", dbUsers[i].password) === logPassword.value) || isAliasOfDB(dbUsers[i].email, logName.value) && decrypt("OURsecret", dbUsers[i].password) === logPassword.value) {
            tempAlert(`Miło Cię znowu widzieć, ${dbUsers[i].name}`, 2000)
            localStorage.setItem('loggedUser', dbUsers[i].name);
            checkLocalStorage();
            clearForm();
            loginView.classList.add("d-none");
            return
        }
    }
    //invalid password information - name/mail/alias data is correct + invalid password
    for (let i=0 ; i<dbUsers.length ; i++) { 
        if ((dbUsers[i].name === logName.value && decrypt("OURsecret", dbUsers[i].password) != logPassword.value) || (dbUsers[i].email === logName.value && decrypt("OURsecret", dbUsers[i].password) != logPassword.value) || isAliasOfDB(dbUsers[i].email, logName.value) && decrypt("OURsecret", dbUsers[i].password) != logPassword.value){
            tempAlert("Błędne hasło", 2000);
            return
        }
    }
    //if logging by email and not found in db - info that email can be used to register 
    for (let i=0 ; i<dbUsers.length ; i++) { 
        if (dbUsers[i].name != logName.value && regexMail.test(logName.value)) {
            tempAlert("Nie ma takiego użytkownika. Możesz zarejestrować konto dla podanego adresu email", 2000);
            switchToRegister()
            return
        }
    }
    //user not found - switch to register
    tempAlert(`${validateNameExtra(logName.value) ? "Nie ma takiego użytkownika. Zarejestruj konto" : "Zarejestruj konto" }`, 2000);
    switchToRegister()
}

//LOGOUT
function handleLogout() {
    localStorage.setItem('loggedUser', '');
    tempAlert("Wylogowano", 2000);
    clearData();
    checkLocalStorage();
    //destroying charts
    for (let id in Chart.instances) {
        Chart.instances[id].destroy();
    }
}

//clearing data and tables after logging out
function clearData() {
    dbTransactions = null;
    tableMobile.children[1].innerHTML="";
    tableDesktop.children[1].innerHTML="";
    resetWrapper.classList.add("d-none");
    resetWrapperDesktop.classList.add("d-none");
}

//validate if text is proper email value using regex
function validateEmail(mail) {
    return regexMail.test(mail)
}

//check if email is alias of the one in database, also if registered on email alias (which is possible) accept email without alias
function isAliasOfDB(str, alias) {
    const splitStr = str.split('@');
    const splitStrLocal = splitStr[0].split('+');
    const splitAlias = alias.split('@');
    const splitAliasAdress = splitAlias[0].split("+");

    if (splitStr[1] != splitAlias[1]) return false

    return splitStr[0] === splitAliasAdress[0] || splitStrLocal[0] === splitAliasAdress[0] || splitStrLocal[0] === splitAlias[0]
}

//direct user to register view when user not found or email not found in database
function switchToRegister() {
    loginView.classList.add("d-none");
    loginNavButton.classList.remove("d-none");
    registerView.classList.remove("d-none");
    registerNavButton.classList.add("d-none");
    //fill input - name if value given while logging in attempt is name not found in db & passes validation / mail if given value is email not found in db
    //if name is not valid open register without filling any input
    (validateEmail(logName.value)) ? regEmail.value = logName.value : (validateNameExtra(logName.value)) ? regName.value = logName.value : null;
}

//MANAGING PASSWORD DISPLAY VIEW IN LOGIN FORM
//display icon if value in input
function showPasswordValueIcon(e) {
    if (e.target.value) {
        showPassword.classList.remove("d-none")
    } else {
        showPassword.classList.add("d-none")
    }
}

//changing icon and input type passsword/text
function showPasswordValue(e) {
    const inputElement = e.target.parentElement.previousElementSibling;

    if (inputElement.getAttribute("type") === "password") {
        inputElement.setAttribute("type", "text");
        e.target.parentElement.innerHTML= `<i class="fas fa-eye-slash"></i>`
    } else {
        inputElement.setAttribute("type", "password");
        e.target.parentElement.innerHTML= `<i class="fa-solid fa-eye"></i>`
    }
}



