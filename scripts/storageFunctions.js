const mainContainer=document.getElementById("main-container");
const userName = document.querySelector(".user-name");
const transactionsSection = document.querySelector(".transactions-section");

let dbUsers = [];
let dbTransactions = null;

//transactions to be randomly added on user registration
const myDB = [
        {date: "2022-11-14", type: 3, amount: 4750.86, balance: 7671.33, description: "Wynagrodzenie z tytułu zrealizowanego zlecenia"},
        {date: "2022-11-13", type: 4, amount: -450.06, balance: 1970.25, description: "Bilety na bal przebierańców"},
        {date: "2022-11-13", type: 1, amount: 958.45, balance: 2928.66, description: "Zwrot zaliczka wyjazd"},
        {date: "2022-11-07", type: 2, amount: -71.56, balance: 3221.55, description: "Żabka"},
        {date: "2022-11-07", type: 2, amount: -150.56, balance: 3150.95, description: "Aldi"},
        {date: "2022-11-06", type: 4, amount: -958.45, balance: 4179.85, description: "Zaliczka wyjazd"},
        {date: "2022-11-05", type: 2, amount: -1231.56, balance: 5410.25, description: "Euro AGD"}
];
//localizations to be randomly added as extra data to transaction
const localizations = ["Poznań", "Gdańsk", "Kraków", "Elbląg", "Sopot", "Bydgoszcz", "Zakopane"];

//getting data from API after account register, adding random number (2-7) of transactions from local DB - in order to create unique list for user 
//adding new key: localization to each element of transaction group (which is chosen randomly for each transaction)
async function getData() {
    const response = await fetch("https://api.npoint.io/38edf0c5f3eb9ac768bd");

    if(!response.ok) {
        throw new Error(`Error: ${response.status}`)
    }

    dbTransactions = await response.json()
        .then(dbTransactions => { 
            const pickNumberOfTransactions = Math.floor(Math.random()*(myDB.length-2) + 2)
            const randomItems = myDB.sort(() => Math.random() - Math.random()).slice(0, pickNumberOfTransactions)

            return ({
            ...dbTransactions,
            transactions: [...dbTransactions.transactions, ...randomItems].sort((a,b)=> new Date(b.date) - new Date(a.date)).map(el=>({
                ...el,
                localization: localizations[Math.floor(Math.random()*localizations.length)]
            }))
        })})
        return dbTransactions
}

//checking for user and serving data when user logged in
async function checkLocalStorage() {
    for (let item of regInputs) {
        if (item.value) return 
    }

    const user = localStorage.getItem("loggedUser");
    dbUsers = JSON.parse(localStorage.getItem("users"));

    if (user === null || user === "" || !user){
        leftMenu.classList.remove("d-none");
        rightMenu.classList.add("d-none");
        transactionsSection.classList.add("d-none");
        mainContainer.dataset.loggedIn="false";
        
        for(let item of leftMenu.children) {
            item.classList.remove("d-none")
        }
        return
    }

    if(user) {
        leftMenu.classList.add("d-none");
        rightMenu.classList.remove("d-none");
        transactionsSection.classList.remove("d-none");
        mainContainer.dataset.loggedIn="true";
        userName.innerHTML = user;

        const dbUserTransactions = dbUsers.filter(el=>el.name===user)[0].bank;
        dbTransactions = dbUserTransactions;

        printCharts(dbUserTransactions);
        printData(dbUserTransactions);
    }
}

//ADDING USER TO LOCAL STORAGE AFTER REGISTRATION
function saveToLocalStorage(newObject) {
    let dataFromLocalStorage = [];

    if (localStorage.getItem( "users" ) != null ) {
        dataFromLocalStorage = JSON.parse(localStorage.getItem( "users" ));

        //check if user exists or if email or its alias is already used in users base
        for(let i=0 ; i<dataFromLocalStorage.length ; i++) {
            if (dataFromLocalStorage[i].name === newObject.name) {
                tempAlert('Użytkownik istnieje', 2000)
                return
            }
            if (dataFromLocalStorage[i].email === newObject.email || isAliasOfDB(dataFromLocalStorage[i].email, newObject.email)) {
                tempAlert('Podany adres email został już użyty!', 2000)
                return
            }
        }
        
        dataFromLocalStorage.push(newObject);
        localStorage.setItem( "users" , JSON.stringify(dataFromLocalStorage));
        } else {
        dataFromLocalStorage.push(newObject);
        localStorage.setItem( "users" , JSON.stringify(dataFromLocalStorage));
    }
    localStorage.setItem("loggedUser", newObject.name)
    tempAlert(`Witaj, ${newObject.name}`, 2000)
    registerView.classList.add("d-none");
    clearForm()
}