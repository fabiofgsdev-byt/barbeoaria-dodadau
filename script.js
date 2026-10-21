
const formAgendamento = document.querySelector("#formAgendamento");
const campoData = document.querySelector("#date");
const campoHorario = document.querySelector("#time");
const campoServico = document.querySelector("#service");

// Endereços da API
const API_AGENDAMENTOS = "http://localhost:3000/agendamentos";
const API_HORARIOS = "http://localhost:3000/horarios-disponiveis";

// Data mínima: hoje
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");

campoData.min = `${ano}-${mes}-${dia}`;

const ABERTURA = 9 * 60;
const FECHAMENTO = 21 * 60;

// Duração dos serviços em minutos
const duracoes = {
    "Corte": 50,
    "Cabelo": 50,
    "Barba": 50,
    "Só barba": 50,
    "Corte + Barba": 90,
    "Cabelo + Barba": 90,
    "Corte e Barba": 90,
    "Luzes": 90,
    "Alisamento": 90
};

function obterDuracao(servico) {
    return duracoes[servico] || 50;
}

function paraMinutos(horario) {
    const partes = horario.split(":");
    return Number(partes[0]) * 60 + Number(partes[1]);
}

function formatarHorario(minutos) {
    const horas = String(Math.floor(minutos / 60)).padStart(2, "0");
    const minutosRestantes = String(minutos % 60).padStart(2, "0");

    return `${horas}:${minutosRestantes}`;
}

// Atualiza os horários quando a data ou o serviço mudar
campoData.addEventListener("change", carregarHorarios);
campoServico.addEventListener("change", carregarHorarios);

async function carregarHorarios() {
    campoHorario.innerHTML = "";

    const dataEscolhida = campoData.value;
    const servicoEscolhido = campoServico.value;

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione um horário";
    campoHorario.appendChild(opcaoInicial);

    if (!dataEscolhida || !servicoEscolhido) {
        const aviso = document.createElement("option");
        aviso.value = "";
        aviso.textContent = "Escolha a data e o serviço primeiro";
        aviso.disabled = true;
        campoHorario.appendChild(aviso);
        return;
    }

    try {
        // Consulta somente os horários ocupados da data selecionada
        const resposta = await fetch(
            `${API_HORARIOS}?data=${encodeURIComponent(dataEscolhida)}`
        );

        if (!resposta.ok) {
            throw new Error("Falha ao consultar os horários");
        }

        const agendamentos = await resposta.json();

        const agendamentosDoDia = agendamentos.map(function (agendamento) {
            const inicio = paraMinutos(
                String(agendamento.horario).slice(0, 5)
            );

            return {
                inicio: inicio,
                fim: inicio + obterDuracao(agendamento.servico)
            };
        });

        const duracaoEscolhida = obterDuracao(servicoEscolhido);

        // Oferece horários de início a cada 10 minutos
        for (
            let inicio = ABERTURA;
            inicio + duracaoEscolhida <= FECHAMENTO;
            inicio += 10
        ) {
            const fim = inicio + duracaoEscolhida;

            const conflito = agendamentosDoDia.some(
                function (agendamento) {
                    return inicio < agendamento.fim &&
                           fim > agendamento.inicio;
                }
            );

            const horario = formatarHorario(inicio);
            const option = document.createElement("option");

            option.value = horario;

            if (conflito) {
                option.textContent = `${horario} — Horário indisponível`;
                option.disabled = true;
                option.style.color = "#dc2626";
            } else {
                option.textContent = `${horario} — Disponível`;
                option.style.color = "#16a34a";
            }

            campoHorario.appendChild(option);
        }

    } catch (erro) {
        console.error("Erro ao buscar horários:", erro);

        campoHorario.innerHTML = "";

        const erroOption = document.createElement("option");
        erroOption.value = "";
        erroOption.textContent = "Erro ao carregar horários";
        erroOption.disabled = true;

        campoHorario.appendChild(erroOption);

        alert("Não foi possível carregar os horários.");
    }
}

// Envia o agendamento para a API
formAgendamento.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.querySelector("#name").value.trim();
    const telefone = document.querySelector("#phone").value.trim();
    const servico = campoServico.value;
    const data = campoData.value;
    const horario = campoHorario.value;

    if (!nome || !telefone || !servico || !data || !horario) {
        alert("Preencha todos os campos e selecione um horário disponível.");
        return;
    }

    const agendamento = {
        nome,
        telefone,
        servico,
        data,
        horario
    };

    try {
        const resposta = await fetch(API_AGENDAMENTOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(agendamento)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.mensagem || "Erro ao salvar agendamento"
            );
        }

        const confirmacao = document.querySelector("#confirmacao");

        confirmacao.textContent =
            `Agendamento confirmado! ${resultado.nome}, ` +
            `serviço: ${resultado.servico}, ` +
            `data: ${resultado.data}, horário: ${resultado.horario}.`;

        alert("Horário confirmado!");

        formAgendamento.reset();
        await carregarHorarios();

    } catch (erro) {
        console.error("Erro ao agendar:", erro);
        alert("Não foi possível realizar o agendamento: " + erro.message);
    }
});
