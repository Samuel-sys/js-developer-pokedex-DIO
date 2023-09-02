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

export function resetPokemons(type){
  $pokedex.innerHTML = ""
  typePkm = type;
  checkingScreen()
}

let acumulado = 0; // ele conta quantas vezes tivemos que fazer uma consulta de pokemon
let telaCarregando = false; //informa se a tela está carregando ou não
async function addPKMPokedex() {
  // se a tela estiver no modo de carregando ele não executa a função para evitar bugs
  if (telaCarregando) {
    console.log("Carregando informações...");
    return;
  }

  loadingScreen(); // Cria uma tela com uma animação de carregando
  //Faz a busca de varios pokemons e gera uma lista
  let pokemons = typePkm
    ? await getTypePokemons(typePkm)
    : await getPokemons(25, 25 * acumulado, typePkm);

  //Se tiver acabado a lista de pokemons ele faz um alert informado ao usuario
  if (pokemons.count == document.querySelectorAll('.pokemon').length) {
    console.log("Acabou os pokemons");
    return;
  }

  //Serve como um controle de loop, eu resolvi fazer tudo como onePage
  //então não vamos dividir isso em varias paginas, se o usuario quiser
  //ver um pokemon especifico vai ter que pesquisar
  acumulado++;

  //Criamos um card para cada pokemon que recebemos da API
  pokemons.pokemons.map((pkm) => {
    
    let img = pkm["sprites"]["versions"]["generation-v"]["black-white"][
      "animated"
    ]["front_default"]

    img = img ? img : pkm.sprites.front_default
    
    if(!img) console.log(pkm)

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
  loadingScreen(); // Remove a tela de carregando depois de executado todo o processo
  checkingScreen(); //Verifica se a tela está 100% preenchida
}

function loadingScreen() {
  telaCarregando = !telaCarregando;
  //se estiver carregando as informações ainda ele adiciona a tela de load
  if (telaCarregando) {
    let load = document.createElement("div");
    load.classList.add("loading");
    load.innerHTML = '<img src="./assets/img/loading.gif" >';
    $content.appendChild(load);
  } else {
    while (document.querySelector(".loading"))
      $content.removeChild(document.querySelector(".loading"));
  }
}
