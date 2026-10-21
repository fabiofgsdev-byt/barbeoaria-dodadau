
const EM_DESENVOLVIMENTO = ["localhost", "127.0.0.1"].includes(location.hostname);

const API_URL = EM_DESENVOLVIMENTO
    ? `http://${location.hostname}:3000`
    : "";

const list = document.querySelector("#list");
const sair = document.querySelector("#sair");
const limparAgenda = document.querySelector("#limpar");

// Verifica a sessão real da API
async function verificarSessao() {
    try {
        const resposta = await fetch(`${API_URL}/sessao`, {
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível verificar a sessão.");
        }

        const sessao = await resposta.json();

        if (!sessao.autenticado) {
            window.location.href = "login.html";
            return false;
        }

        return true;
    } catch (erro) {
        console.error("Erro ao verificar sessão:", erro);
        list.textContent = "Não foi possível verificar seu acesso.";
        return false;
    }
}

// Encerra a sessão no servidor
sair.addEventListener("click", async function () {
    sair.disabled = true;

    try {
        const resposta = await fetch(`${API}/logout`, {
            method: "POST",
            credentials: "include"
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível encerrar a sessão.");
        }

        window.location.href = "login.html";
    } catch (erro) {
        console.error("Erro ao sair:", erro);
        alert("Não foi possível sair. Tente novamente.");
        sair.disabled = false;
    }
});

// Busca os agendamentos protegidos
async function carregarAgendamentos() {
    try {
        const resposta = await fetch(`${API_URL}/agendamentos`, {
            credentials: "include"
        });

        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!resposta.ok) {
            throw new Error("Falha ao buscar agendamentos.");
        }

        const agendamentos = await resposta.json();

        list.innerHTML = "";

        if (agendamentos.length === 0) {
            list.textContent = "Nenhum agendamento encontrado.";
            return;
        }

        agendamentos.forEach(function (agendamento) {
            const div = document.createElement("div");
            div.classList.add("agendamento");

            const titulo = document.createElement("h3");
            titulo.textContent = agendamento.nome;

            const telefone = document.createElement("p");
            telefone.textContent = `WhatsApp: ${agendamento.telefone}`;

            const servico = document.createElement("p");
            servico.textContent = `Serviço: ${agendamento.servico}`;

            const data = document.createElement("p");
            data.textContent = `Data: ${String(agendamento.data).slice(0, 10)}`;

            const horario = document.createElement("p");
            horario.textContent =
                `Horário: ${String(agendamento.horario).slice(0, 5)}`;

            const botaoExcluir = document.createElement("button");
            botaoExcluir.type = "button";
            botaoExcluir.classList.add("excluir");
            botaoExcluir.textContent = "Excluir";

            botaoExcluir.addEventListener("click", async function () {
                const confirmar = confirm(
                    `Deseja excluir o agendamento de ${agendamento.nome}?`
                );

                if (!confirmar) return;

                botaoExcluir.disabled = true;

                try {
                    const resposta = await fetch(
                        `${API}/agendamentos/${agendamento.id}`,
                        {
                            method: "DELETE",
                            credentials: "include"
                        }
                    );

                    if (resposta.status === 401) {
                        window.location.href = "login.html";
                        return;
                    }

                    if (!resposta.ok) {
                        throw new Error("Não foi possível excluir.");
                    }

                    await carregarAgendamentos();
                } catch (erro) {
                    console.error("Erro ao excluir:", erro);
                    alert("Erro ao excluir o agendamento.");
                    botaoExcluir.disabled = false;
                }
            });

            div.append(
                titulo,
                telefone,
                servico,
                data,
                horario,
                botaoExcluir
            );

            list.appendChild(div);
        });
    } catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro);
        list.textContent = "Não foi possível carregar os agendamentos.";
    }
}

// Limpa a agenda inteira
limparAgenda.addEventListener("click", async function () {
    const confirmar = confirm(
        "Tem certeza de que deseja apagar toda a agenda?"
    );

    if (!confirmar) return;

    limparAgenda.disabled = true;

    try {
        const resposta = await fetch(`${API}/agendamentos`, {
            method: "DELETE",
            credentials: "include"
        });

        if (resposta.status === 401) {
            window.location.href = "login.html";
            return;
        }

        if (!resposta.ok) {
            throw new Error("Não foi possível limpar a agenda.");
        }

        alert("Agenda limpa com sucesso!");
        await carregarAgendamentos();
    } catch (erro) {
        console.error("Erro ao limpar agenda:", erro);
        alert("Erro ao limpar a agenda.");
    } finally {
        limparAgenda.disabled = false;
    }
});

// Só carrega a agenda depois de confirmar a sessão
async function iniciarPagina() {
    const autenticado = await verificarSessao();

    if (autenticado) {
        await carregarAgendamentos();
    }
}

iniciarPagina();
