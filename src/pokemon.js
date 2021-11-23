const express = require('express');
const router = express.Router();
const { v4: uuid } = require('uuid');

// replace this string with your full name
const name = 'Siyan Ma';

console.log(`My name is ${name}`);

const randomNumberByRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// use this list as your temporary database!
// note that it will reset every time you restart your server
const myPokemons = [{
    id: 'fc10b559-872c-43cd-bad2-f02e2e0a2d58', name: 'Pikachu', health: 10, level: 1
}];

router.get('/', (req, res) => {
    // return all pokemon
    res.json(myPokemons);
});

router.post('/', (req, res) => {
    // if the pokemon name already exists in the list, return an error
    // randomly generate an id using UUID ["uuid()"]
    // randomly generate a level between 1 and 10, inclusive, if none is given
    // randomly generate a health between 10 and 100, inclusive, if none is given
    // insert your pokemon into the myPokemon list
    // return a 200
    const newPokemon = req.body;

    if (newPokemon == null || newPokemon.name == null) {
        return res.sendStatus(400);
    }
    if (myPokemons.some((each) => each.name === newPokemon.name)) {
        return res.sendStatus(409);
    }

    newPokemon.level = (newPokemon.level == null) ? randomNumberByRange(1, 10) : newPokemon.level;
    newPokemon.health = (newPokemon.health == null) ? randomNumberByRange(10, 100) : newPokemon.health;
    myPokemons.push({ ...newPokemon, id: uuid() });

    return res.sendStatus(200);
});

router.get("/:pokemonId", (req, res) => {
    // return pokemon if one is found matching the pokemonId
    // return a 404 if no pokemon matches that pokemonId
    if (req.params == null || req.params.pokemonId == null) {
        return res.sendStatus(400);
    }
    const pokemonId = req.params.pokemonId;
    const pokemon = myPokemons.find(each => each.id === pokemonId);

    if (pokemon == null) {
        return res.sendStatus(404);
    }

    return res.json(pokemon);
});

router.put("/:pokemonId", (req, res) => {
    // update the pokemon matching the pokemonId
    // based on the req body
    // return a 404 if no pokemon matches that pokemonId
    const updatePokemon = req.body;

    if (updatePokemon == null) {
        return res.sendStatus(400);
    }
    const pokemonId = req.params.pokemonId;
    const existingPokemon = myPokemons.find(each => each.id === pokemonId);

    if (existingPokemon == null) {
        return res.sendStatus(404);
    }

    existingPokemon.name = (updatePokemon.name != null) ? updatePokemon.name : existingPokemon.name;
    existingPokemon.level = (updatePokemon.level != null) ? updatePokemon.level : existingPokemon.level;
    existingPokemon.health = (updatePokemon.health != null) ? updatePokemon.health : existingPokemon.health;

    return res.sendStatus(200);
});

router.delete("/:pokemonId", (req, res) => {
    // delete pokemon if pokemonId matches the id of one
    // return 200 even if no pokemon matches that Id
    if (req.params == null || req.params.pokemonId == null) {
        return res.sendStatus(400);
    }

    const pokemonId = req.params.pokemonId;
    const deleteIdx = myPokemons.map(each => each.id).indexOf(pokemonId);
    if (deleteIdx >= 0) {
        myPokemons.splice(deleteIdx, 1);
    }

    return res.sendStatus(200);
});

module.exports = router;
