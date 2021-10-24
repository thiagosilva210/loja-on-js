const form = document.getElementById("form-cadastro");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

const CEP = document.getElementById("CEP");
const endereco = document.getElementById("endereco");

const loginBtn = document.getElementById("loginBtn-submit");

let validName;
let validEmail;
let validPassword;
let validConfirmPassword;
let validCEP;
let validEndereco;

//create account logic
form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs();

  if (
    validName &&
    validEmail &&
    validPassword &&
    validConfirmPassword &&
    validEndereco &&
    validCEP
  ) {
    let listaUser = JSON.parse(localStorage.getItem("listaUser") || "[]");

    listaUser.push({
      nameCad: username.value,
      emailCad: email.value,
      passwordCad: password.value,

      CEPCad: CEP.value,
      enderecoCad: endereco.value,
    });

    localStorage.setItem("listaUser", JSON.stringify(listaUser));

    alert("usuario registrado com sucesso");
  } else {
    alert("Preencha todos os campos adequadamente");
  }
});

//Check the validity of the values sended
function checkInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value.trim();
  const password2Value = password2.value.trim();
  const CEPValue = CEP.value.trim();
  const enderecoValue = endereco.value.trim();

  if (usernameValue === "") {
    setErrorFor(username, "Username cannot be blank");
    validName = false;
  } else {
    setSuccessFor(username);
    validName = true;
  }

  if (CEPValue === "") {
    setErrorFor(CEP, "cep cannot be blank");
    validCEP = false;
  } else {
    setSuccessFor(CEP);
    validCEP = true;
  }

  if (enderecoValue === "") {
    setErrorFor(endereco, "cep cannot be blank");
    validEndereco = false;
  } else {
    setSuccessFor(endereco);
    validEndereco = true;
  }

  if (emailValue === "") {
    setErrorFor(email, "Email cannot be blank");
    validEmail = false;
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, "Not a valid email");
    validEmail = false;
  } else {
    setSuccessFor(email);
    validEmail = true;
  }

  if (passwordValue === "") {
    setErrorFor(password, "Password cannot be blank");
    validPassword = false;
  } else {
    setSuccessFor(password);
    validPassword = true;
  }

  if (password2Value === "") {
    setErrorFor(password2, "Password cannot be blank");
    validPassword = false;
  } else if (passwordValue !== password2Value) {
    setErrorFor(password2, "Password does not match");
    validPassword = false;
  } else {
    setSuccessFor(password2);
    validConfirmPassword = true;
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");
  formControl.className = "form-control error";
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

//login logic
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let emailLogin = document.getElementById("emailLogin");
  let passwordLogin = document.getElementById("passwordLogin");

  let listaUser = [];

  let userValid = {
    username: "",
    email: "",
    password: "",

    CEP: "",
    endereco: "",
  };

  listaUser = JSON.parse(localStorage.getItem("listaUser"));

  listaUser.forEach((item) => {
    if (
      emailLogin.value == item.emailCad &&
      passwordLogin.value == item.passwordCad
    ) {
      userValid = {
        username: item.nameCad,
        email: item.emailCad,
        password: item.passwordCad,

        CEP: item.CEPCad,
        endereco: item.enderecoCad,
      };
    }
  });

  if (
    emailLogin.value === userValid.email &&
    passwordLogin.value === userValid.password &&
    emailLogin.value != "" &&
    passwordLogin.value != ""
  ) {
    let token = Math.random().toString(16).substring(2);
    localStorage.setItem("token", token);

    localStorage.setItem("userLogado", JSON.stringify(userValid));
    window.location.href = "index.html";
  } else {
    setErrorFor(emailLogin, "");
    setErrorFor(passwordLogin, "email ou senha incorretos");
  }
});
//end login logic

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login");
  const createAccountForm = document.querySelector("#createAccount");

  document
    .querySelector("#linkCreateAccount")
    .addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.add("form--hidden");
      createAccountForm.classList.remove("form--hidden");
    });

  document.querySelector("#linkLogin").addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.classList.remove("form--hidden");
    createAccountForm.classList.add("form--hidden");
  });
});
