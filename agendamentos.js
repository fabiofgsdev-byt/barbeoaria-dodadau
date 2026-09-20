const logado = sessionStorage.getItem("logado");

if (logado !== "true") {
    window.location.href = "login.html";
}

const sair = document.querySelector("#sair");

sair.addEventListener("click", function () {
    sessionStorage.removeItem("logado");
    window.location.href = "login.html";
});

const list = document.querySelector("#list");

const limparAgenda = document.querySelector("#limpar");

limparAgenda.addEventListener("click", function () {
    localStorage.removeItem("agendamentos");
});



const agendamentos = JSON.parse(
    localStorage.getItem("agendamentos")
) || [];

agendamentos.forEach(function (agendamento, index) {
    const div = document.createElement("div");

    div.classList.add("agendamento");

    div.innerHTML = `
     <h3>${agendamento.nome}</h3>
      <p>WhatsApp: ${agendamento.telefone}</p> 
    <p>Serviço: ${agendamento.servico}</p>
     <p>Data: ${agendamento.data}
    </p> <p>Horário: ${agendamento.horario}</p> 

    <button class="excluir">Excluir</button> `;

    const botaoExcluir = div.querySelector(".excluir");



    botaoExcluir.addEventListener("click", function () {

        agendamentos.splice(index, 1);

        localStorage.setItem("agendamentos", JSON.stringify(agendamentos));

        div.remove();

    });




    list.appendChild(div);
});