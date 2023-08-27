import { getPokemons } from "./fethPokemon.js";

const $pokedex = document.querySelector(".pokemons");

window.onload = function () {
  adicionaPokemonsAPokedex();
};

// Quando o usuario chegar no final da paginan entra no processo para carregar novos pokemons
window.addEventListener("scroll", () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.scrollHeight;
  if (scrollPosition > bodyHeight - windowHeight - 100) {
    adicionaPokemonsAPokedex();
  }
});

function cardPokemon(pkm) {
  //Pegamos os dados do pokemon e imprimimos no corpo do site
  return `<li class="pokemon ${pkm.type[0].type.name}">
            <div class="top-pokemon"> <span class="name">${pkm.name}</span>
                <span class="number">#${pkm.id}</span>
            </div>

            <div class="detail">
                <ol class="types">
                    ${pkm.type
                      .map(
                        (x) =>
                          `<img class="type" src="./assets/img/type/${x.type.name}.png" alt="${x.type.name}" />`
                      )
                      .join("")}
                </ol>

                <img class="pokemon-img" src="${pkm.img}" alt="${pkm.name}" />
            </div>                                          
        </li>`;
}

let acumulado = 0; // ele conta quantas vezes tivemos que fazer uma consulta de pokemon
let telaCarregando = false; //informa se a tela está carregando ou não
async function adicionaPokemonsAPokedex() {
  
  // se a tela estiver no modo de carregando ele não executa a função para evitar bugs
  if (telaCarregando) {
    console.log("Carregando informações...");
    return;
  } 
  
  indicaTelaCaregando(); // Cria uma tela com uma animação de carregando
  //Faz a busca de varios pokemons e gera uma lista
  let pokemons = await getPokemons(50, 50 * acumulado);

  //Se tiver acabado a lista de pokemons ele faz um alert informado ao usuario
  if(!pokemons.pokemons.length){
    console.log("Acabou os pokemons")
    return;
  }

  //Serve como um controle de loop, eu resolvi fazer tudo como onePage 
  //então não vamos dividir isso em varias paginas, se o usuario quiser 
  //ver um pokemon especifico vai ter que pesquisar
  acumulado++;
  
  //Criamos um card para cada pokemon que recebemos da API
  pokemons.pokemons.map((pkm) => {
    //Realizamos um loop que irá criar um card para cada pokemon
    $pokedex.innerHTML += cardPokemon({
      id: pkm.id,
      name: pkm.name,
      type: pkm.types,
      img: pkm["sprites"]["versions"]["generation-v"]["black-white"][
        "animated"
      ]["front_default"],
    });
  });

  indicaTelaCaregando(); // Remove a tela de carregando depois de executado todo o processo
}

function indicaTelaCaregando() {
  telaCarregando = !telaCarregando;
  //se estiver carregando as informações ainda ele adiciona a tela de load
  if (telaCarregando) {
    let load = document.createElement("div");
    load.classList.add("loading");
    load.innerHTML = '<img src="./assets/img/loading.gif" >';
    document.querySelector("body").appendChild(load);
  } else {
    document
      .querySelector("body")
      .removeChild(document.querySelector(".loading"));
  }
}
