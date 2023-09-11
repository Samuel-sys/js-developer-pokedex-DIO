import { cardPokemon } from "./cardPokemon.js";
import { getPokemons, getTypePokemons } from "./fethPokemon.js";

const $pokedex = document.querySelector(".pokemons");
const $content = document.querySelector(".content");
let typePkm = "";

window.onload = function () {
  checkingScreen();
};

// Quando o usuario chegar no final da paginan entra no processo para carregar novos pokemons
window.addEventListener("scroll", checkingScreen);

function checkingScreen() {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  const bodyHeight = document.body.scrollHeight;
  if (scrollPosition > bodyHeight - windowHeight - 100) {
    addPKMPokedex();
  }
}

export function resetPokemons(type) {
  $pokedex.innerHTML = "";
  typePkm = type;
  checkingScreen();
}

let acumulado = 0; // ele conta quantas vezes tivemos que fazer uma consulta de pokemon
let telaCarregando = false; //informa se a tela está carregando ou não
let count = 0;
async function addPKMPokedex() {
  // se a tela estiver no modo de carregando ele não executa a função para evitar bugs
  if (telaCarregando) {
    console.log("Informações carregada...");
    return;
  }

  //Se tiver acabado a lista de pokemons ele faz um alert informado ao usuario
  if (count == document.querySelectorAll(".pokemon").length && count != 0) {
    console.log("Acabou os pokemons");
    return;
  }

  AddScreenLoading(); // Cria uma tela com uma animação de carregando
  //Faz a busca de varios pokemons e gera uma lista

  let pokemons = typePkm //O usuario está pesquisando alguma typagem em especifico ?
    ? await getTypePokemons(typePkm)
    : await getPokemons(25, 25 * acumulado, typePkm);

  count = pokemons.count;
  //Serve como um controle de loop, eu resolvi fazer tudo como onePage
  //então não vamos dividir isso em varias paginas, se o usuario quiser
  //ver um pokemon especifico vai ter que pesquisar
  acumulado = typePkm ? 0 : acumulado + 1;

  //Criamos um card para cada pokemon que recebemos da API
  pokemons.pokemons.map((pkm) => {
    let img =
      pkm["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ];

    img = img ? img : pkm.sprites.front_default;

    if (!img) console.log(pkm);

    //Realizamos um loop que irá criar um card para cada pokemon
    $pokedex.appendChild(
      cardPokemon({
        id: pkm.id,
        name: pkm.name,
        type: pkm.types,
        img: img ? img : pkm.sprites.front_default,
      })
    );
  });

  removeScreenLoading(); // Remove a tela de carregando depois de executado todo o processo
  checkingScreen(); //Verifica se a tela está 100% preenchida
}

function AddScreenLoading() {
  telaCarregando = true; //informa que o site está carregando

  if (!document.querySelector(".loading")) {
    let load = document.createElement("div");
    load.classList.add("loading");
    load.innerHTML = '<img src="./assets/img/loading.gif" >';
    $content.appendChild(load);
  }

  console.log("Carregando informaçõe:" + telaCarregando);
}

function removeScreenLoading() {
  telaCarregando = false;
  while (document.querySelector(".loading"))
    $content.removeChild(document.querySelector(".loading"));

  console.log("removido load: ");
}

// function loadingScreen() {
// telaCarregando = !telaCarregando;
//se estiver carregando as informações ainda ele adiciona a tela de load
// if (telaCarregando) {
//   let load = document.createElement("div");
//   load.classList.add("loading");
//   load.innerHTML = '<img src="./assets/img/loading.gif" >';
//   $content.appendChild(load);
// } else {
//   while (document.querySelector(".loading"))
//     $content.removeChild(document.querySelector(".loading"));
// }
// }
