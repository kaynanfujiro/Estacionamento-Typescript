interface Veiculo{
    nome:string,
    placa:string,
    entrada: Date | string;
    ClienteId?: string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

    function calcTempo(mil: number){
        const min = Math.floor(mil/60000)
        const seg = Math.floor(mil % 60000/ 1000)

        return `${min}m e ${seg}s`;
    }

    function patio(){
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []; // se o localstorage tiver patio la dentro, se não ele retorna um array vazio (parse transformar em object)
        }

        function salvar(veiculo : Veiculo[]){
            localStorage.setItem("patio",JSON.stringify(veiculo)) //transformando em string com stringify
        }

        function adicionar (veiculo: Veiculo, salva ?: boolean){
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa);
            })

            $("#patio")?.appendChild(row);


            if(salva) salvar([...ler(),veiculo]) // O ...ler, faz com que eu salve todos os antigos e os novos com o , veiculo (Por conta do localstorage).
        }

        function remover(placa:string){
            const {entrada,nome} = ler().find(veiculo => veiculo.placa === placa);

            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if(!confirm(`o veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render()
        }

        function render (){
            $("#patio")!.innerHTML = " ";
            const patio = ler();
            
            if(patio.length){
                patio.forEach((veiculo) => adicionar(veiculo))
            }
        }

        return {ler, adicionar, remover, render}
    }

    patio().render();

    $("#btnCadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa){
            alert('Os Campos nome e placa são obrigatórios');
            return;
        }
        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true); // new Date() é utilizado para pegar a data e hora naquele momento
    })
}) ();
 