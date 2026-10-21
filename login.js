const loginForm = document.querySelector("#loginForm");
const mensagem = document.querySelector("#mensagem");
const botao = loginForm.querySelector("button[type=submit]");

// mesma origem do servidor; se o front ficar em outro domínio, coloque a URL da API aqui
const EM_DESENVOLVIMENTO = ["localhost", "127.0.0.1"].includes(location.hostname);
const API_URL = EM_DESENVOLVIMENTO ? `http://${location.hostname}:3000` : "";

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    console.log("1 - Formulário enviado");

    const usuario = document.querySelector("#usuario").value.trim();
    const senha = document.querySelector("#senha").value;

    console.log("2 - Campos lidos");
    console.log("3 - API:", API_URL);

    botao.disabled = true;
    mensagem.textContent = "Verificando acesso...";

    console.log("4 - Preparando requisição");

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ usuario, senha })
        });

        const resultado = await resposta.json().catch(() => ({}));

        console.log("Resposta da API:", resposta.status, resultado);

        if (!resposta.ok) {
            mensagem.textContent =
                resultado.mensagem || "Não foi possível entrar.";
            return;
        }

        console.log("Login aceito. Redirecionando...");

       window.location.href = "./agendamentos.html";
    } catch (erro) {
        console.error("Erro no login:", erro);
        mensagem.textContent =
            "Não foi possível conectar. Tente novamente em instantes.";
    } finally {
        botao.disabled = false;
    }
});