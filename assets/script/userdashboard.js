/* current signed in user */
let currentuser = JSON.parse(localStorage.getItem("userloggedin"));
let users = JSON.parse(localStorage.getItem("userslist")) || [];

const balance = document.querySelector(".balance-section");
const send = document.querySelector(".send-section");
const request = document.querySelector(".request-section");
const transaction = document.querySelector(".transaction-section");
const signoutbtn = document.getElementById("signoutbtn");
const sendsection = document.querySelector(".send-form");
const balancesection = document.querySelector(".balance-section");

signoutbtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("userloggedin", JSON.stringify({}));
  window.location.replace("/pages/signin.html");
});

/* navigation */
const navigateSPA = (key) => {
  switch (key) {
    case "balance":
      balance.classList.remove("hide");
      send.classList.add("hide");
      request.classList.add("hide");
      transaction.classList.add("hide");
      break;
    case "send":
      balance.classList.add("hide");
      send.classList.remove("hide");
      request.classList.add("hide");
      transaction.classList.add("hide");
      break;
    case "request":
      balance.classList.add("hide");
      send.classList.add("hide");
      request.classList.remove("hide");
      transaction.classList.add("hide");
      break;
    case "transaction":
      balance.classList.add("hide");
      send.classList.add("hide");
      request.classList.add("hide");
      transaction.classList.remove("hide");
      break;
    default:
      break;
  }
};

const navItems = Array.from(document.querySelectorAll(".user-nav")[0].children);

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    navigateSPA(e.target.parentElement.id);
  });
});

/* user functions */

const validateAccount = (acc) => {
  let valid = false;
  users.forEach((user) => {
    if (user.account_number === acc) {
      valid = true;
    }
  });
  return valid;
};

/* Send Money */
const SendMoney = (accnum, amount) => {
  if (currentuser.balance < amount) {
    console.log("insufficient funds");
    return;
  }

  if (!validateAccount(accnum)) {
    console.log("invalid account number");
    return;
  }

  let temp = [];
  users.forEach((user) => {
    if (user.account_number === currentuser.account_number) {
      tempuser = { ...user, balance: parseFloat(user.balance) - amount };
      temp.push(tempuser);
      currentuser = tempuser;
      return;
    }
    if (user.account_number === accnum) {
      temp.push({ ...user, balance: parseFloat(user.balance) + amount });
      return;
    }
    temp.push(user);
  });

  users = temp;
  localStorage.setItem("userslist", JSON.stringify(users));
  localStorage.setItem("userloggedin", JSON.stringify(currentuser));
};

sendsection.innerHTML = `<label for="accountno">Enter user account number: <input type="number" id="accountno"
          /></label>
          <label for="amount"
            >Enter amount to send: <input type="number" id="amount"
          /></label>
          <button type="submit" id="sendbtn">Send</button>`;

sendsection.addEventListener("submit", (e) => {
  e.preventDefault();
  SendMoney(parseFloat(e.target[0].value), parseFloat(e.target[1].value));
});

/* Balance */
balancesection.innerHTML = `<h1>
Hello ${currentuser.username.toUpperCase()}, <br />
Your current account balance is \$${currentuser.balance}.
</h1>`;
