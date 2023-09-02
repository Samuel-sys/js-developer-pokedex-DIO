import { resetPokemons } from "./main.js";

export function cardPokemon(pkm) {
  //criando o elemento DOM
  const $card = document.createElement("li");

  //Adicionando class principais
  $card.classList.add(`pokemon`);
  $card.classList.add(pkm.type[0].type.name);

  //Criação do corpo do elemento CARD
  const $header = _header(pkm);

  const $detail = _detail(pkm);

  $card.appendChild($header);
  $card.appendChild($detail);
  //Pegamos os dados do pokemon e imprimimos no corpo do site
  return $card;
}

//responsavel por criar o cabeçalho do card Pokemon
function _header({ name, id }) {
  id = id.toString().padStart(3, "0"); // #001

  const $result = document.createElement("header");
  $result.innerHTML = `<span class="name">${name}</span>`;
  $result.innerHTML += `<span class="number">#${id}</span>`;

  return $result;
}

//responsavel por criar os detalhes do Pokemon
function _detail({ type, img, name, id }) {
  const $result = document.createElement("div");
  $result.classList.add("detail");

  //informa o tipo do pokemon
  $result.appendChild(__types(type));

  const $img = document.createElement("img");
  $img.classList.add("pokemon-img");
  $img.src = img;
  $img.alt = name;
  $result.appendChild($img);
  $img.addEventListener("click", () => renderPokemon(id));

  //   `<img class="pokemon-img" src="${img}" alt='${name}' />`;

  return $result;
}

function __types(types) {
  const $result = document.createElement("ol");
  $result.classList.add("types");

  types.map((x) => {
    const $type = document.createElement("li");

    const $img = document.createElement("img");
    $img.classList.add("type");
    $img.src = `./assets/img/type/${x.type.name}.png`;
    $img.alt = x.type.name;
    $type.appendChild($img);

    //Evento quando a pessoa clica no icon do tipo do pokemon
    $img.addEventListener("click", () => resetPokemons(x.type.name));

    $result.appendChild($type);
  });

  return $result;
}

export function renderPokemon(id) {
  alert(id);
}
