"use strict";

// ---------Elements-------
const app = document.querySelector(".app");
const welcomeEl = document.querySelector(".welocome");
const userInput = document.querySelector(".login__user");
const passwordInput = document.querySelector(".login__password");
const transferInputTo = document.querySelector(".transfer__input");
const transferInputValue = document.querySelector(".transfer__input__value");
const loanInput = document.querySelector(".loan__input");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".transfer__btn");
const btnloan = document.querySelector(".loan__btn");
const btnRegister = document.querySelector(".register");

const balanceValue = document.querySelector(".balance__value");
const summaryValueIn = document.querySelector(".summary__value--in");
const summaryValueOut = document.querySelector(".summary__value--out");
const containerMovements = document.querySelector(".movements");

//--------------------------

//---Test accounts---

const account1 = {
  name: "john",
  password: 123,
  movements: [200, 300, -300, 1000, 1200, -250, -1300],
};

const account2 = {
  name: "mary",
  password: 321,
  movements: [400, 120, 200, -1000, 1100, -1250, 2460],
};

let accounts = [account1, account2];

// -----------------------------

const getLocalStorage = function () {
  const data = JSON.parse(localStorage.getItem("accounts"));

  if (!data) return;
  accounts = data;
};

const setLocalStorage = function () {
  localStorage.setItem("accounts", JSON.stringify(accounts));
};

getLocalStorage();

const displayMovements = function (acc) {
  containerMovements.innerHTML = "";

  acc.movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movements__${type}">
    <div class="movement__type movement__type--${type}">
      <strong>${i + 1}</strong> ${type}
    </div>
    <div class="movement__value">${mov}$</div>
  </div>`;

    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

const currentBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (prev, cur) {
    return prev + cur;
  }, 0);
  balanceValue.textContent = acc.balance + "$";
};

const summaryInOut = function (acc) {
  summaryValueIn.textContent =
    acc.movements
      .filter(function (mov) {
        return mov > 0;
      })
      .reduce(function (prev, cur) {
        return prev + cur;
      }, 0) + "$";

  summaryValueOut.textContent =
    acc.movements
      .filter((mov) => mov < 0)
      .reduce((prev, cur) => prev + cur, 0) + "$";
};

const updateUI = function (acc) {
  displayMovements(acc);

  currentBalance(acc);

  summaryInOut(acc);

  setLocalStorage();
};

let currentUser;

btnRegister.addEventListener("click", function (e) {
  e.preventDefault();
  let userInputLower = userInput.value;
  if (!isNaN(+userInput.value)) {
    alert("Username must be string");
    return;
  }
  userInputLower = userInput.value.toLowerCase();

  const userFind = accounts.find((acc) => acc.name === userInputLower);

  if (userFind) {
    alert("user name already exist");
    return;
  }
  if (userInputLower && passwordInput.value) {
    const account = {
      name: userInputLower,
      password: Number(passwordInput.value),
      movements: [1000],
    };
    accounts.push(account);
    setLocalStorage();
  } else {
    alert("Both user and password must be filled");
  }
  userInput.value = passwordInput.value = "";
});

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentUser = accounts.find((acc) => acc.name === userInput.value);
  if (!currentUser) {
    alert("Username doesn't exist");
    return;
  }

  if (currentUser.password === +passwordInput.value && passwordInput.value) {
    app.style.opacity = 100;
    updateUI(currentUser);
    welcomeEl.innerHTML = `Welcome, ${
      currentUser.name[0].toUpperCase() + currentUser.name.slice(1)
    }!`;
  } else {
    alert("wrong username or password");
  }
  userInput.value = passwordInput.value = "";
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +transferInputValue.value;
  const receiverUser = accounts.find(
    (acc) => acc.name === transferInputTo.value
  );
  if (!receiverUser) {
    alert("Receiver account does not exist");
    transferInputTo.value = transferInputValue.value = "";
    return;
  }
  if (amount < 0) {
    alert("Amount must be greater than 0");
    transferInputTo.value = transferInputValue.value = "";
    return;
  }

  if (amount > currentUser.balance) {
    alert("Balance must be bigger than the transfer value");
    transferInputTo.value = transferInputValue.value = "";
    return;
  }

  if (receiverUser === currentUser) {
    alert("You cannot transfer money to yourself");
    transferInputTo.value = transferInputValue.value = "";
    return;
  }

  currentUser.movements.push(-amount);
  receiverUser.movements.push(amount);
  updateUI(currentUser);

  transferInputTo.value = transferInputValue.value = "";
});

btnloan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +loanInput.value;
  if (amount < 0) {
    alert("Amount must be bigger than 0");
    loanInput.value = "";
    return;
  }

  if (currentUser.movements.some((mov) => mov > 0.1 * amount)) {
    currentUser.movements.push(amount);
  } else {
    alert("You must have a deposit greater than 10% of the loan amount");
  }
  updateUI(currentUser);

  loanInput.value = "";
});
