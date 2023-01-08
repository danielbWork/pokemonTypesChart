import { PokemonType } from "./PokemonType.js";
import { PokemonTypeInfo } from "./types.js";

const SCORE_WEIGHT = 0;

const STATUS_IMMUNITY_DEFENSE_BONUS = 1;
const WEATHER_BONUS = 0.5;
const TERRAIN_ATTACK_BONUS = 0.2;
const STEALTH_ROCK_BONUS = 0.2;

const effectiveAttackMultiplier = 0.3;
const effectiveDefenseMultiplier = 0.1;

/**
 * Returns the starting score for the type
 * @param type The type we want to get the starting score for
 * @returns The starting attack and defense of the type
 */
function calculateStartingScores(type: PokemonType): {
  attackScore: number;
  defenseScore: number;
} {
  let attackScore = SCORE_WEIGHT;
  let defenseScore = SCORE_WEIGHT;

  // Note that some calculation are done here just to make
  // sure they have been accounted for
  switch (type) {
    case PokemonType.FIRE:
      // Burn immunity bonuses
      attackScore += 0.2;
      defenseScore += STATUS_IMMUNITY_DEFENSE_BONUS;

      // Sunlight bonus
      attackScore += WEATHER_BONUS;

      // Rain de-buff
      attackScore -= WEATHER_BONUS;

      defenseScore -= STEALTH_ROCK_BONUS;

      break;

    case PokemonType.WATER:
      // Rain bonus
      attackScore += WEATHER_BONUS;

      // Sunlight de-buff
      attackScore -= WEATHER_BONUS;

      break;

    case PokemonType.GRASS:
      // Immunities to leech seed, spore and powder moves
      defenseScore += 0.3;

      // Grassy terrain bonus
      attackScore += TERRAIN_ATTACK_BONUS;

      break;

    case PokemonType.ELECTRIC:
      // Paralyze Immunity
      attackScore += 0.1;
      defenseScore += STATUS_IMMUNITY_DEFENSE_BONUS;

      // Electric terrain bonus
      attackScore += TERRAIN_ATTACK_BONUS;

      break;

    case PokemonType.ICE:
      // Freeze Immunity
      attackScore += 0.3;
      defenseScore += STATUS_IMMUNITY_DEFENSE_BONUS;

      defenseScore -= STEALTH_ROCK_BONUS;

      // Snow bonus
      defenseScore += WEATHER_BONUS;

      // No hail bonus as snow replaces it

      break;

    case PokemonType.FIGHTING:
      defenseScore += STEALTH_ROCK_BONUS;

      break;

    case PokemonType.POISON:
      // Poison Immunity
      defenseScore += STATUS_IMMUNITY_DEFENSE_BONUS;

      // Toxic spikes removal
      defenseScore += 0.1;

      break;

    case PokemonType.GROUND:
      // Sandstorm bonus
      defenseScore += WEATHER_BONUS;

      // Grassy terrain effecting strong ground move (earthquake, bulldoze and magnitude)
      attackScore -= TERRAIN_ATTACK_BONUS / 2;

      defenseScore += STEALTH_ROCK_BONUS;

      break;

    case PokemonType.FLYING:
      // Entry hazards immunity
      defenseScore += 1;

      // No terrain boost
      attackScore -= TERRAIN_ATTACK_BONUS;

      defenseScore -= STEALTH_ROCK_BONUS;

      break;

    case PokemonType.PSYCHIC:
      // Psychic terrain bonus
      attackScore += TERRAIN_ATTACK_BONUS;

      break;

    case PokemonType.BUG:
      defenseScore -= STEALTH_ROCK_BONUS;

      break;

    case PokemonType.ROCK:
      // Sandstorm bonus plus special defense in sandstorm
      defenseScore += WEATHER_BONUS * 2;

      break;

    case PokemonType.GHOST:
      // Immunity to recall/escape block
      defenseScore += 0.2;

      break;

    case PokemonType.DRAGON:
      // Misty terrain de-buff
      attackScore -= TERRAIN_ATTACK_BONUS;

      break;

    case PokemonType.DARK:
      // Prankster immunity
      defenseScore += 0.2;

      break;

    case PokemonType.STEEL:
      // Poison Immunity
      defenseScore += STATUS_IMMUNITY_DEFENSE_BONUS;

      // Sandstorm bonus
      defenseScore += WEATHER_BONUS;

      defenseScore += STEALTH_ROCK_BONUS;

      break;

    default:
      break;
  }

  return { attackScore, defenseScore };
}

/**
 * Creates the initial data for the chart
 * @param info The starting info we base the data on
 */
export function getInitialData(info: Record<PokemonType, PokemonTypeInfo>) {
  const keys = Object.keys(info);

  const data: { type: PokemonType; info: PokemonTypeInfo }[] = [];

  keys.forEach((key) => {
    const type = <PokemonType>key;

    const startingInfo = info[<PokemonType>key];

    const attackEffect = startingInfo.attackEffect;
    const defenseEffect = startingInfo.defenseEffect;

    let { attackScore, defenseScore } = calculateStartingScores(type);

    attackScore +=
      effectiveAttackMultiplier *
        (keys.length -
          attackEffect.veryEffective.length -
          attackEffect.notEffective.length -
          attackEffect.immune.length) +
      attackEffect.veryEffective.length -
      attackEffect.notEffective.length -
      2 * attackEffect.immune.length;

    defenseScore +=
      effectiveDefenseMultiplier *
        (keys.length -
          defenseEffect.veryEffective.length -
          defenseEffect.notEffective.length -
          defenseEffect.immune.length) +
      defenseEffect.veryEffective.length -
      defenseEffect.notEffective.length +
      2 * defenseEffect.immune.length;

    data.push({ type, info: { ...startingInfo, attackScore, defenseScore } });
  });

  return data;
}

/**
 *  Goes over the pokemon data and returns it in an easier format to evaluate
 *  scores from
 * @param pokemonData The pokemon data we parse
 * @returns The parsed data in the form a an object with each type as it's key
 * and the average attack and defense of the types
 */
function parsePokemonData(
  pokemonData: {
    type: PokemonType;
    info: PokemonTypeInfo;
  }[]
): {
  typesInfo: Map<PokemonType, PokemonTypeInfo>;
  averageAttack: number;
  averageDefense: number;
} {
  const typesInfo = new Map(
    pokemonData.map((value) => [value.type, value.info])
  );

  let { averageAttack, averageDefense } = pokemonData.reduce(
    (previousValue, currentValue) => {
      return {
        averageAttack:
          previousValue.averageAttack + currentValue.info.attackScore,
        averageDefense:
          previousValue.averageDefense + currentValue.info.defenseScore,
      };
    },
    { averageAttack: 0, averageDefense: 0 }
  );

  // This are used as benchmark for attack and defense of other types
  averageAttack = averageAttack / pokemonData.length;
  averageDefense = averageDefense / pokemonData.length;

  return { typesInfo, averageAttack, averageDefense };
}

function calculateTypeBoosters(
  data: {
    typesInfo: Map<PokemonType, PokemonTypeInfo>;
    averageAttack: number;
    averageDefense: number;
  },
  typeValue: PokemonType
) {
  // TODO make more readable
  const typeAttack = data.typesInfo.get(typeValue)!.attackScore;
  const typeDefense = data.typesInfo.get(typeValue)!.defenseScore;

  const attackDistance = Math.abs(typeAttack) + Math.abs(data.averageAttack);
  const defenseDistance = Math.abs(typeDefense) + Math.abs(data.averageDefense);

  // TODO See if this is the best maths for it
  // Currently uses the distances to both make sure the values are positive
  // and still keep the relative boost form them

  const attackBoost =
    0.4 *
      ((typeDefense + defenseDistance) /
        (data.averageDefense + defenseDistance)) +
    0.6 *
      ((typeAttack + attackDistance) / (data.averageAttack + attackDistance));

  const defenseBoost =
    (typeAttack + attackDistance) / (data.averageAttack + attackDistance);

  return { attackBoost, defenseBoost };
}

/**
 * Uses the old data to boost the new
 * @param pokemonData The data we base the calculations on
 */
export function recalculateData(
  pokemonData: {
    type: PokemonType;
    info: PokemonTypeInfo;
  }[]
) {
  // Gets all wanted information from the data
  const data = parsePokemonData(pokemonData);

  // TODO maybe make async
  const newPokemonData = pokemonData.map((value) => {
    let { attackScore, defenseScore } = calculateStartingScores(value.type);

    let attackEffect = value.info.attackEffect;
    let defenseEffect = value.info.defenseEffect;

    Object.values(PokemonType).forEach((typeValue) => {
      const type = <PokemonType>typeValue;

      const { attackBoost, defenseBoost } = calculateTypeBoosters(data, type);

      // Decides attack boost based on effectiveness
      if (attackEffect.veryEffective.includes(type)) {
        attackScore += 1.2 * attackBoost;
      } else if (attackEffect.notEffective.includes(type)) {
        attackScore -= 1.2 * attackBoost;
      } else if (attackEffect.immune.includes(type)) {
        attackScore -= 2 * attackBoost;
      } else {
        attackScore += effectiveAttackMultiplier * attackBoost;
      }

      // Decides defense boost based on effectiveness
      if (defenseEffect.veryEffective.includes(type)) {
        defenseScore += 1.2 * defenseBoost;
      } else if (defenseEffect.notEffective.includes(type)) {
        defenseScore -= 1.2 * defenseBoost;
      } else if (defenseEffect.immune.includes(type)) {
        defenseScore += 2 * defenseBoost;
      } else {
        defenseScore += effectiveDefenseMultiplier * defenseBoost;
      }
    });
    return {
      type: value.type,
      info: { ...value.info, attackScore, defenseScore },
    };
  });

  return newPokemonData;
}

/**
 *
 * @param typeA The first type of the pokemon
 * @param typeB The other type of the pokemon
 * @param pokemonData
 * @returns
 */
export function calculateForDualType(
  typeA: PokemonType,
  typeB: PokemonType,
  pokemonData: {
    type: PokemonType;
    info: PokemonTypeInfo;
  }[]
) {
  // TODO Fix calculations here as some how tey beat everything

  // Gets all wanted information from the data
  const data = parsePokemonData(pokemonData);

  const scoreA = calculateStartingScores(typeA);
  const scoreB = calculateStartingScores(typeB);

  // Uses combined as it gets both advantages and disadvantages of both
  // removes weight as it would get it twice otherwise
  let attackScore = scoreA.attackScore + scoreB.attackScore - SCORE_WEIGHT;
  let defenseScore = scoreA.defenseScore + scoreB.defenseScore - SCORE_WEIGHT;

  const attackEffects = {
    typeA: data.typesInfo.get(typeA)!.attackEffect,
    typeB: data.typesInfo.get(typeB)!.attackEffect,
  };
  const defenseEffects = {
    typeA: data.typesInfo.get(typeA)!.defenseEffect,
    typeB: data.typesInfo.get(typeB)!.defenseEffect,
  };

  Object.values(PokemonType).forEach((typeValue) => {
    const type = <PokemonType>typeValue;

    const { attackBoost, defenseBoost } = calculateTypeBoosters(data, type);

    // TODO finish this
    // Decides attack boost based on effectiveness
    if (
      attackEffects.typeA.veryEffective.includes(type) ||
      attackEffects.typeB.veryEffective.includes(type)
    ) {
      attackScore += 1.2 * attackBoost;
    }
    // If effective at all
    else if (
      !(
        attackEffects.typeA.notEffective.includes(type) ||
        attackEffects.typeA.immune.includes(type)
      ) ||
      !(
        attackEffects.typeB.notEffective.includes(type) ||
        attackEffects.typeB.immune.includes(type)
      )
    ) {
      attackScore += 0.5 * effectiveAttackMultiplier * attackBoost;
    } else if (
      attackEffects.typeA.notEffective.includes(type) &&
      attackEffects.typeB.notEffective.includes(type)
    ) {
      attackScore -= 1.5 * attackBoost;
    } else if (
      attackEffects.typeA.notEffective.includes(type) ||
      attackEffects.typeB.notEffective.includes(type)
    ) {
      attackScore -= 2 * attackBoost;
    } else {
      // Both have the same immunity
      attackScore -= 4 * attackBoost;
    }

    // Decides defense boost based on effectiveness
    if (
      defenseEffects.typeA.immune.includes(type) ||
      defenseEffects.typeB.immune.includes(type)
    ) {
      defenseScore += 2 * defenseBoost;
    } else if (
      defenseEffects.typeA.veryEffective.includes(type) ||
      defenseEffects.typeB.veryEffective.includes(type)
    ) {
      // If one is effective and one is not
      if (
        defenseEffects.typeA.notEffective.includes(type) ||
        defenseEffects.typeB.notEffective.includes(type)
      ) {
        defenseScore += 0.5 * effectiveDefenseMultiplier * defenseBoost;
      }
      // If both are effective
      else if (
        defenseEffects.typeA.veryEffective.includes(type) &&
        defenseEffects.typeB.veryEffective.includes(type)
      ) {
        defenseScore += 1.7 * defenseBoost;
      }
      // If only one is effective and the other is neutral
      else {
        defenseScore += 1.2 * defenseBoost;
      }
    } else if (
      defenseEffects.typeA.notEffective.includes(type) ||
      defenseEffects.typeB.notEffective.includes(type)
    ) {
      // If both not effective
      if (
        defenseEffects.typeA.notEffective.includes(type) &&
        defenseEffects.typeB.notEffective.includes(type)
      ) {
        defenseScore -= 3 * defenseBoost;
      }
      // If only one isn't effective and the other is neutral
      else {
        defenseScore -= 1.5 * defenseBoost;
      }
    }
  });

  return { attackScore, defenseScore };
}
