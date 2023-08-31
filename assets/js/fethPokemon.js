export async function searchPokemon(pokemon) {
  try {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    const response = await fetch(url); //faz o get dos dados do pokemon
    return await response.json(); //retorna um Json
  } catch (error) {
  }
}

//limit = numero de itens na lista
//offset = pegar uma lista a partir do ID informado
export async function getPokemons(limit = 50, offset = 0) { 
  try {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    const response = await fetch(url); //faz o get dos dados do pokemon
    const data = await response.json(); //retorna um Json

    return {
      pokemons: await Promise.all(
        data.results.map(async (pokemon) => {
          return await searchPokemon(pokemon.name);
        })
      ),
      count: data.count,
    };
  } catch (error) {
    //Caso o pokemon não exista retornamos um objeto informando que o pokemon não existe ou não foi encontrado
    return { status: `Pokemon não encontrado` };
  }
}
