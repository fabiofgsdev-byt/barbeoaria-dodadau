const formAgendamento = document.querySelector("#formAgendamento");

const campoData = document.querySelector("#date");
const campoHorario = document.querySelector("#time");


campoData.addEventListener("change", function () {

    campoHorario.innerHTML = "";

    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos")
    ) || [];

    const dataEscolhida = campoData.value;

    const agendamentosDoDia = agendamentos.filter(function (agendamento) {
        return agendamento.data === dataEscolhida;
    });

    const horariosOcupados = agendamentosDoDia.map(function (agendamento) {
        return agendamento.horario;
    });

    const horarios = [
        "08:00",
        "08:40",
        "09:20",
        "10:00",
        "10:40",
        "11:20",
        "12:00",
        "12:40",
        "13:20",
        "14:00",
        "14:40",
        "15:20",
        "16:00",
        "16:40",
        "17:20"
    ];

    horarios.forEach(function (horario) {

        if (horariosOcupados.includes(horario)) {
            return;
        }

        const option = document.createElement("option");

        option.value = horario;
        option.textContent = horario;

        campoHorario.appendChild(option);

    });

});


formAgendamento.addEventListener("submit", function (event) {

    event.preventDefault();

    const nome = document.querySelector("#name").value;

    const telefone = document.querySelector("#phone").value;

    const servico = document.querySelector("#service").value;

    const data = campoData.value;

    const horario = campoHorario.value;

    const agendamento = {

        nome: nome,
        telefone: telefone,
        servico: servico,
        data: data,
        horario: horario

    };

    const agendamentos = JSON.parse(
        localStorage.getItem("agendamentos")
    ) || [];

    agendamentos.push(agendamento);

    localStorage.setItem(
        "agendamentos",
        JSON.stringify(agendamentos)
    );

    console.log(agendamentos, "Agendamento salvo!");

    alert("horario confirmado");

    const confirmacao = document.querySelector("#confirmacao");

confirmacao.innerHTML = `
    <h2>Agendamento confirmado!</h2>
    <p>Nome: ${nome}</p>
    <p>Serviço: ${servico}</p>
    <p>Data: ${data}</p>
    <p>Horário: ${horario}</p>
`;

});