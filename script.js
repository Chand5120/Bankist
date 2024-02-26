"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Shivan Parvathi",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Perumal Aandal",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Bhuji Kumaran",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Lal Bahadur Shastri",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

// create UserName
function createUserName(account) {
  accounts.forEach((account) => {
    account.userName = account.owner
      .split(" ")
      .map((elem) => elem[0].toLowerCase())
      .join("");
  });
}

createUserName(accounts);

// Display transactions
function displayTransactions(account, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? [...account.movements].sort((a, b) => a - b)
    : account.movements;
  movs.forEach((elem, index) => {
    const str = `<div class="movements__row">
                    <div class="movements__type movements__type--${
                      elem < 0 ? "withdrawal" : "deposit"
                    }">${index} ${elem < 0 ? "withdrawal" : "deposit"}</div>
                    <div class="movements__date">3 days ago</div>
                    <div class="movements__value">${Math.abs(elem)}€</div>
                </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", str);
  });
}

// to display currentbalance
function displayCurrentBalance(account) {
  let balance1 = account.movements.reduce((acc, elem) => acc + elem, 0);
  account.balance = balance1;
  labelBalance.textContent = balance1 + "€";
}

// stats
function stats(account) {
  labelSumIn.textContent =
    account.movements
      .filter((elem) => elem > 0)
      .reduce((acc, elem) => acc + elem, 0) + "€";

  labelSumOut.textContent =
    Math.abs(
      account.movements
        .filter((elem) => elem < 0)
        .reduce((acc, elem) => acc + elem, 0)
    ) + "€";

  labelSumInterest.textContent =
    account.movements
      .filter((elem) => elem >= 1)
      .map((elem) => elem * (account.interestRate / 100))
      .reduce((acc, elem) => acc + elem, 0) + "€";
}

// to display data
function updateUI(currentAccount) {
  displayTransactions(currentAccount);
  displayCurrentBalance(currentAccount);
  stats(currentAccount);
}

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayTransactions(account1, sorted);
});

// Login
let currentUser;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  let account = accounts.find(
    (elem) => inputLoginUsername.value === elem.userName
  );

  currentUser = account;
  if (account?.pin == +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${currentUser.owner}`;
    updateUI(account);
    containerApp.style.opacity = "100";
  } else {
    console.log('Incorrect credentials');
  }

  inputLoginPin.value = "";
  inputLoginUsername.value = "";
  inputLoginPin.blur();
  inputLoginUsername.blur();
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  let recepientAcc = accounts.find(
    (elem) => elem.userName === inputTransferTo.value
  );
  let amount = +inputTransferAmount.value;

  if (amount > 0 && recepientAcc && amount <= currentUser.balance) {
    recepientAcc.movements.push(amount);
    currentUser.movements.push(-amount);
    updateUI(currentUser);
  } else {
    console.log("Recipient not found");
  }

  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
});
