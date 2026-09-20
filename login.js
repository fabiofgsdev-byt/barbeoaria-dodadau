const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const usuario = document.querySelector("#usuario").value;
    const senha = document.querySelector("#senha").value;

    if (usuario === "dadau" && senha === "1234") {

          sessionStorage.setItem("logado", "true");

        window.location.href = "agendamentos.html";

         


    } else {

        document.querySelector("#mensagem").textContent =
            "Usuário ou senha incorretos.";

    }

});