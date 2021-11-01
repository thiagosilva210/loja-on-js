const form = document.getElementById("form-cadastro");
const loginBtn = document.getElementById("loginBtn-submit");
const fields = document.querySelectorAll("#form-cadastro [name]");
//create account logic
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let values = getValues();
  if (!values) {
    alert("Preencha todos os campos adequadamente");
    return false;
  } else {
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
  }
});

//Conferir se os valores preenchem os requisitos
function getValues() {
  let user = {};
  let isValid = true;
  //const fields = document.querySelectorAll("#form-cadastro [name]");
  const password1 = document.getElementById("password").value;
  const password2 = document.getElementById("password2").value;

  fields.forEach(function (field, index) {
    if (
      ["username", "CEP", "endereco", "email", "password"].indexOf(field.name) >
        -1 &&
      !field.value
    ) {
      setErrorFor(field, "This space cannot be blank");
      isValid = false;
    }

    if (field.name === "email") {
      if (!isEmail(field.value)) {
        setErrorFor(field, "Not a valid email");
        isValid = false;
      }
    }

    if (field.name === "password") {
      if (password1 !== password2) {
        setErrorFor(field, "Password does not match");
        isValid = false;
      } else {
        setSuccessFor(field);
      }
    }
    user[field.name] = field.value;

    if (isValid) {
      setSuccessFor(field);
    }
  });

  if (!isValid) {
    return false;
  } else {
    return true;
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
