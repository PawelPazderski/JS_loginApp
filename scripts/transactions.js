const tableMobile = document.getElementById("transactions-table-mobile");
const tableDesktop = document.getElementById("transactions-table-desktop");
const desktopTableTypeHead = document.getElementById("desktop-table-type-head");
const mobileTableTypeHead = document.getElementById("mobile-table-type-head");
const desktopTableSearchHead = document.getElementById("desktop-table-search-head");
const mobileTableSearchHead = document.getElementById("mobile-table-search-head");
const resetTable = document.getElementById("reset-table");
const resetTableDesktop = document.getElementById("reset-table-desktop");
const resetWrapper = document.querySelector(".reset-wrapper")
const resetWrapperDesktop = document.querySelector(".reset-wrapper-desktop")

desktopTableTypeHead.addEventListener("click", showTypeModal);
mobileTableTypeHead.addEventListener("click", showTypeModal);
desktopTableSearchHead.addEventListener("click", showSearchModal);
mobileTableSearchHead.addEventListener("click", showSearchModal);
resetTable.addEventListener("click", showAllTransactions)
resetTableDesktop.addEventListener("click", showAllTransactions)

const icons = {
    1: `<i class="fa-solid fa-sack-dollar"></i>`,
    2: `<i class="fa-solid fa-cart-shopping"></i>`,
    3: `<i class="fa-solid fa-handshake-simple"></i>`,
    4: `<i class="fa-solid fa-money-check-dollar"></i>`
};

//main function for data print
function printData(props) {
    const data = props;

    tableDesktop.children[1].innerHTML = '';
    tableMobile.children[1].innerHTML = '';

    //DATA FOR MOBILE
    //sorting data by transaction date
    let sortedTransactions = {};

    data.transactions.forEach((item) => {
        if (!sortedTransactions[item.date]) {
            sortedTransactions[item.date] = [item];
        } else {
            sortedTransactions[item.date] = [...sortedTransactions[item.date], item];
        }
    });

    const sortedTransactionsArr = Object.values(sortedTransactions);

    //printing data for mobile
    for(let item of sortedTransactionsArr) {
        const rowMobileDate = document.createElement('tr');
        rowMobileDate.innerHTML=`
            <td colspan = 3 style="text-align: left; font-size: .7rem; line-height: .5rem; cursor: default">
                <strong>${item[0].date}</>
            </td>
        `
        tableMobile.children[1].appendChild(rowMobileDate)
        for(let i in item) {
            const rowMobile = document.createElement("tr");
            const addInforowMobile = document.createElement("tr");
            addInforowMobile.classList.add("d-none", "add-info");
            rowMobile.dataset.id = i;

            rowMobile.innerHTML = `
                <td class="mobile-main-row">${icons[item[i].type]}</td>
                <td class="mobile-main-row" translate="no">${item[i].description}</td>
                <td class="mobile-main-row">${item[i].amount.toFixed(2).replace(".", ",")}</td>
                `;

            addInforowMobile.innerHTML=`
                <td colspan = 3>
                    <div class="add-info-text">
                        <div class="add-info-text-left">
                            <div><strong>${data.transacationTypes[item[i].type]}</strong></div>
                            <div>${item[i].date} ${item[i].type % 2 === 0 ? item[i].localization : ""}</div>
                        </div>
                        <div>
                            <div style="text-align: right"><strong>Saldo:</strong></div>
                            ${item[i].balance.toFixed(2).replace(".", ",")}
                        </div>
                    </div>
                </td>
            `;
            //adding functions to show / hide additional information
            tableMobile.children[1].appendChild(rowMobile).addEventListener('click', showDetail);
            tableMobile.children[1].appendChild(addInforowMobile).addEventListener('click', hideDetail);
        }
        
    }

    //printing data for desktop
    for (let i in data.transactions) {
        const rowDesktop = document.createElement("tr");

        rowDesktop.innerHTML=`
            <td>${data.transactions[i].date}</td>
            <td>${icons[data.transactions[i].type]}</td>
            <td translate="no">
                ${data.transactions[i].description}
                <div style="font-size:.8rem; display:flex; justify-content:space-between">
                    <div>
                        <strong>${data.transacationTypes[data.transactions[i].type]}</strong>
                    </div>
                    ${data.transactions[i].type % 2 === 0 
                        ?
                        `<div style="font-size:.8rem;">
                            <i class="fa-solid fa-location-dot"></i>
                            <strong>${data.transactions[i].localization}</strong>
                        </div>` 
                        : 
                        ""
                    }
                </div>
            </td>
            <td>${data.transactions[i].amount.toFixed(2).replace(".", ",")}</td>
            <td>${data.transactions[i].balance.toFixed(2).replace(".", ",")}</td>
        `
        tableDesktop.children[1].appendChild(rowDesktop)
    }
}

//resetting transaction table - print all user transactions and hide reset button
function showAllTransactions() {
    printData(dbTransactions);
    resetWrapper.classList.add("d-none")
    resetWrapperDesktop.classList.add("d-none")
}

//filter by type
//modal
function showTypeModal(){
    const bg = document.createElement("div");
    const el = document.createElement("div");
    el.classList.add("myAlert", "modal-alert");
    bg.classList.add("myAlert-bg");
    //close modal on clicking background
    bg.addEventListener("click", closeModal);

    //inputs to choose type
    const inputs = Object.entries(dbTransactions.transacationTypes).map((el, i) => (
        `<label for="type1" class="check-container">
            ${el[1]}<input type="checkbox" id="typeCheckboxID${i+1}" name="checkbox${i+1}" value=${el[0]}>
            <span class="checkmark">
        </label>`
        )
    )

    el.innerHTML = `
        <img src="./assets/body_illustration_dollar.svg" style="width: 50px; height:50px; margin-bottom:1rem" translate="no"/>    
        <span>Pokaż transakcje</span>
        <form id="filter-transactions-form" onsubmit="event.preventDefault(); filterTypes(event)">
            ${inputs.join(" ")}
            <div class="filter-button">
            <button type="submit">Gotowe</button>
            </div
        </form>
    `;
    document.body.appendChild(el);
    document.body.appendChild(bg);
}

//filter function
function filterTypes() {
    const typeInputs = document.querySelectorAll("#filter-transactions-form input")
    const checked = Array.from(typeInputs).filter(el=>el.checked===true).map(el=>+el.value)
    const filteredTransactions = [];

    //fill array with transactions that match the type / types selected in modal
    for (let item of dbTransactions.transactions) {
        if (checked.includes(item.type)) {
            filteredTransactions.push(item)
        } 
    }

    //if option chosen present filtered transactions
    if(filteredTransactions.length) {
        tableDesktop.children[1].innerHTML = '';
        tableMobile.children[1].innerHTML = '';
        printData({
            ...dbTransactions,
            transactions: filteredTransactions
        })
        //if filtered list is shorter than whole transaction list show reset button
        if (filteredTransactions.length != dbTransactions.transactions.length) {
            resetWrapper.classList.remove("d-none")
            resetWrapperDesktop.classList.remove("d-none")
        }
        closeModal()
    } else {
        closeModal()
        tempAlert("Nie wybrano żadnej opcji", 2000)
    }
}

//searching option (includes: descryption, type, localization)
//modal
function showSearchModal() {
    const bg = document.createElement("div");
    const el = document.createElement("div");
    el.classList.add("myAlert", "modal-alert");
    bg.classList.add("myAlert-bg");
    //close modal on clicking background
    bg.addEventListener("click", closeModal);

    el.innerHTML = `
        <img src="./assets/body_illustration_dollar.svg" style="width: 50px; height:50px; margin-bottom:1rem" translate="no"/>    
        <span>Wyszukaj w opisach transakcji</span>
        <form id="search-transactions-form" onsubmit="event.preventDefault(); searchDescription(event)">
            <input type="text" id="search" name="search" placeholder="&#xF002; Wpisz szukane słowo">
            <div class="search-button">
            <button type="submit">Znajdź</button>
            </div
        </form>
    `;
    document.body.appendChild(el);
    document.body.appendChild(bg);
}

//search function
function searchDescription() {
    let foundSearched = [];
    const searchInputValue = document.getElementById("search").value;
    let types = [];

    //verify input - accept single word only
    if (!/^[a-ząćężśźłóń]+$/i.test(searchInputValue)) {
        document.getElementById("search").value="";
        tempAlert("Wpisz jedno szukane słowo", 2000);
        return
    }

    //searching descriptions and localizations (transaction expenses show localization only)
    for (let item of dbTransactions.transactions) {
        if (item.description.toLowerCase().includes(searchInputValue.toLowerCase()) || item.localization.toLowerCase().includes(searchInputValue.toLowerCase()) && item.type != 1 && item.type != 3) {
            foundSearched.push(item)
        }
    }

    //searching through transaction types description
    for (let item of Object.entries(dbTransactions.transacationTypes)) {
        if (item[1].toLowerCase().includes((searchInputValue.toLowerCase()))){
            types.push(+item[0])
        }
    }

    if(types.length) {
        foundSearched = dbTransactions.transactions.filter(el=>types.includes(el.type))
    }

    if (foundSearched.length) {
        tableDesktop.children[1].innerHTML = '';
        tableMobile.children[1].innerHTML = '';
        printData({
            ...dbTransactions,
            transactions: foundSearched
        })
        if (foundSearched.length != dbTransactions.transactions.length) {
            resetWrapper.classList.remove("d-none")
            resetWrapperDesktop.classList.remove("d-none")
        }
        closeModal()
    } else {
        tempAlert("Nie znaleziono", 2000);
        document.getElementById("search").value = "";
    }
}

//closing modal
function closeModal() {
    document.querySelector(".myAlert").parentElement.removeChild(document.querySelector(".myAlert"))
    document.querySelector(".myAlert-bg").parentElement.removeChild(document.querySelector(".myAlert-bg"))
}

//additional functions for mobile view
//show transaction details - one can be open at a time
function showDetail(e) {
    const allAddInfo = document.querySelectorAll(".add-info");

    for (let item of allAddInfo) {
        item.classList.add("d-none");
        item.previousElementSibling.classList.remove("info-open")
    }

    e.currentTarget.classList.add("info-open");
    e.currentTarget.nextElementSibling.classList.remove("d-none")
}

//close detail 
function hideDetail(e) {
    e.currentTarget.classList.add("d-none");
    e.currentTarget.previousElementSibling.classList.remove("info-open")
}


