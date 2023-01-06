import { PokemonType } from "./PokemonType.js";
import { PokemonTypeInfo } from "./types.js";

/**
 * The starting info for all pokemon types
 */
export const pokemonBaseInfo: Record<PokemonType, PokemonTypeInfo> = {
  [PokemonType.NORMAL]: {
    attackEffect: {
      veryEffective: [],
      notEffective: [PokemonType.ROCK, PokemonType.STEEL],
      immune: [PokemonType.GHOST],
    },
    defenseEffect: {
      veryEffective: [],
      notEffective: [PokemonType.FIGHTING],
      immune: [PokemonType.GHOST],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.FIRE]: {
    attackEffect: {
      veryEffective: [
        PokemonType.GRASS,
        PokemonType.ICE,
        PokemonType.BUG,
        PokemonType.STEEL,
      ],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.WATER,
        PokemonType.ROCK,
        PokemonType.DRAGON,
      ],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.FIRE,
        PokemonType.GRASS,
        PokemonType.ICE,
        PokemonType.BUG,
        PokemonType.STEEL,
        PokemonType.FAIRY,
      ],
      notEffective: [PokemonType.WATER, PokemonType.GROUND, PokemonType.ROCK],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.WATER]: {
    attackEffect: {
      veryEffective: [PokemonType.FIRE, PokemonType.GROUND, PokemonType.ROCK],
      notEffective: [PokemonType.WATER, PokemonType.GRASS, PokemonType.DRAGON],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.FIRE,
        PokemonType.WATER,
        PokemonType.ICE,
        PokemonType.STEEL,
      ],
      notEffective: [PokemonType.GRASS, PokemonType.ELECTRIC],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.GRASS]: {
    attackEffect: {
      veryEffective: [PokemonType.WATER, PokemonType.GROUND, PokemonType.ROCK],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.GRASS,
        PokemonType.POISON,
        PokemonType.FLYING,
        PokemonType.BUG,
        PokemonType.DRAGON,
        PokemonType.STEEL,
      ],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.WATER,
        PokemonType.GRASS,
        PokemonType.ELECTRIC,
        PokemonType.GROUND,
      ],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.ICE,
        PokemonType.POISON,
        PokemonType.FLYING,
        PokemonType.BUG,
      ],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.ELECTRIC]: {
    attackEffect: {
      veryEffective: [PokemonType.WATER, PokemonType.FLYING],
      notEffective: [
        PokemonType.GRASS,
        PokemonType.ELECTRIC,
        PokemonType.DRAGON,
      ],
      immune: [PokemonType.GROUND],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.ELECTRIC,
        PokemonType.FLYING,
        PokemonType.STEEL,
      ],
      notEffective: [PokemonType.GROUND],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.ICE]: {
    attackEffect: {
      veryEffective: [
        PokemonType.GRASS,
        PokemonType.GROUND,
        PokemonType.FLYING,
        PokemonType.DRAGON,
      ],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.WATER,
        PokemonType.ICE,
        PokemonType.STEEL,
      ],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [PokemonType.ICE],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.FIGHTING,
        PokemonType.ROCK,
        PokemonType.STEEL,
      ],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.FIGHTING]: {
    attackEffect: {
      veryEffective: [
        PokemonType.NORMAL,
        PokemonType.ICE,
        PokemonType.ROCK,
        PokemonType.DARK,
        PokemonType.STEEL,
      ],
      notEffective: [
        PokemonType.POISON,
        PokemonType.FLYING,
        PokemonType.PSYCHIC,
        PokemonType.BUG,
        PokemonType.FAIRY,
      ],
      immune: [PokemonType.GHOST],
    },
    defenseEffect: {
      veryEffective: [PokemonType.BUG, PokemonType.ROCK, PokemonType.DARK],
      notEffective: [
        PokemonType.FLYING,
        PokemonType.PSYCHIC,
        PokemonType.FAIRY,
      ],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.POISON]: {
    attackEffect: {
      veryEffective: [PokemonType.GRASS, PokemonType.FAIRY],
      notEffective: [
        PokemonType.POISON,
        PokemonType.GROUND,
        PokemonType.ROCK,
        PokemonType.GHOST,
      ],
      immune: [PokemonType.STEEL],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.GRASS,
        PokemonType.FIGHTING,
        PokemonType.POISON,
        PokemonType.BUG,
        PokemonType.FAIRY,
      ],
      notEffective: [PokemonType.GROUND, PokemonType.PSYCHIC],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.GROUND]: {
    attackEffect: {
      veryEffective: [
        PokemonType.FIRE,
        PokemonType.ELECTRIC,
        PokemonType.POISON,
        PokemonType.ROCK,
        PokemonType.STEEL,
      ],
      notEffective: [PokemonType.GROUND, PokemonType.BUG],
      immune: [PokemonType.FLYING],
    },
    defenseEffect: {
      veryEffective: [PokemonType.POISON, PokemonType.ROCK],
      notEffective: [PokemonType.WATER, PokemonType.GRASS, PokemonType.ICE],
      immune: [PokemonType.ELECTRIC],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.FLYING]: {
    attackEffect: {
      veryEffective: [PokemonType.GRASS, PokemonType.FIGHTING, PokemonType.BUG],
      notEffective: [PokemonType.ELECTRIC, PokemonType.ROCK, PokemonType.STEEL],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [PokemonType.GRASS, PokemonType.FIGHTING, PokemonType.BUG],
      notEffective: [PokemonType.ELECTRIC, PokemonType.ICE, PokemonType.ROCK],
      immune: [PokemonType.GROUND],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.PSYCHIC]: {
    attackEffect: {
      veryEffective: [PokemonType.FIGHTING, PokemonType.POISON],
      notEffective: [PokemonType.PSYCHIC, PokemonType.STEEL],
      immune: [PokemonType.DARK],
    },
    defenseEffect: {
      veryEffective: [PokemonType.FIGHTING, PokemonType.PSYCHIC],
      notEffective: [PokemonType.BUG, PokemonType.GHOST, PokemonType.DARK],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.BUG]: {
    attackEffect: {
      veryEffective: [PokemonType.GRASS, PokemonType.PSYCHIC, PokemonType.DARK],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.FIGHTING,
        PokemonType.POISON,
        PokemonType.FLYING,
        PokemonType.GHOST,
        PokemonType.STEEL,
        PokemonType.FAIRY,
      ],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.GRASS,
        PokemonType.FIGHTING,
        PokemonType.GROUND,
      ],
      notEffective: [PokemonType.FIRE, PokemonType.FLYING, PokemonType.ROCK],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.ROCK]: {
    attackEffect: {
      veryEffective: [
        PokemonType.FIRE,
        PokemonType.ICE,
        PokemonType.FLYING,
        PokemonType.BUG,
      ],
      notEffective: [
        PokemonType.FIGHTING,
        PokemonType.GROUND,
        PokemonType.STEEL,
      ],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.NORMAL,
        PokemonType.FIRE,
        PokemonType.POISON,
        PokemonType.FLYING,
      ],
      notEffective: [
        PokemonType.WATER,
        PokemonType.GRASS,
        PokemonType.FIGHTING,
        PokemonType.GROUND,
        PokemonType.STEEL,
      ],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.GHOST]: {
    attackEffect: {
      veryEffective: [PokemonType.PSYCHIC, PokemonType.GHOST],
      notEffective: [PokemonType.DARK],
      immune: [PokemonType.NORMAL],
    },
    defenseEffect: {
      veryEffective: [PokemonType.POISON, PokemonType.BUG],
      notEffective: [PokemonType.GHOST, PokemonType.DARK],
      immune: [PokemonType.NORMAL, PokemonType.FIGHTING],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.DRAGON]: {
    attackEffect: {
      veryEffective: [PokemonType.DRAGON],
      notEffective: [PokemonType.STEEL],
      immune: [PokemonType.FAIRY],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.FIRE,
        PokemonType.WATER,
        PokemonType.ELECTRIC,
        PokemonType.GRASS,
      ],
      notEffective: [PokemonType.ICE, PokemonType.DRAGON, PokemonType.FAIRY],
      immune: [],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.DARK]: {
    attackEffect: {
      veryEffective: [PokemonType.PSYCHIC, PokemonType.GHOST],
      notEffective: [PokemonType.FIGHTING, PokemonType.DARK, PokemonType.FAIRY],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [PokemonType.GHOST, PokemonType.DARK],
      notEffective: [PokemonType.FIGHTING, PokemonType.BUG, PokemonType.FAIRY],
      immune: [PokemonType.PSYCHIC],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.STEEL]: {
    attackEffect: {
      veryEffective: [PokemonType.ICE, PokemonType.ROCK, PokemonType.FAIRY],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.WATER,
        PokemonType.ELECTRIC,
        PokemonType.STEEL,
      ],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [
        PokemonType.NORMAL,
        PokemonType.GRASS,
        PokemonType.ICE,
        PokemonType.FLYING,
        PokemonType.PSYCHIC,
        PokemonType.BUG,
        PokemonType.ROCK,
        PokemonType.DRAGON,
        PokemonType.STEEL,
        PokemonType.FAIRY,
      ],
      notEffective: [
        PokemonType.FIRE,
        PokemonType.FIGHTING,
        PokemonType.GROUND,
      ],
      immune: [PokemonType.POISON],
    },
    attackScore: 1,
    defenseScore: 1,
  },
  [PokemonType.FAIRY]: {
    attackEffect: {
      veryEffective: [
        PokemonType.FIGHTING,
        PokemonType.DRAGON,
        PokemonType.DARK,
      ],
      notEffective: [PokemonType.FIRE, PokemonType.POISON, PokemonType.STEEL],
      immune: [],
    },
    defenseEffect: {
      veryEffective: [PokemonType.FIGHTING, PokemonType.BUG, PokemonType.DARK],
      notEffective: [PokemonType.POISON, PokemonType.STEEL],
      immune: [PokemonType.DRAGON],
    },
    attackScore: 1,
    defenseScore: 1,
  },
};
