(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const seg = Math.floor(mil % 60000 / 1000);
        return `${min}m e ${seg}s`;
    }
    function patio() {
        function ler() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []; // se o localstorage tiver patio la dentro, se não ele retorna um array vazio (parse transformar em object)
        }
        function salvar(veiculo) {
            localStorage.setItem("patio", JSON.stringify(veiculo)); //transformando em string com stringify
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                salvar([...ler(), veiculo]); // O ...ler, faz com que eu salve todos os antigos e os novos com o , veiculo (Por conta do localstorage).
        }
        function remover(placa) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`o veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }
        function render() {
            $("#patio").innerHTML = " ";
            const patio = ler();
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, render };
    }
    patio().render();
    (_a = $("#btnCadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert('Os Campos nome e placa são obrigatórios');
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true); // new Date() é utilizado para pegar a data e hora naquele momento
    });
})();
