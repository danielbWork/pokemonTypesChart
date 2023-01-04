import { PokemonType } from "./PokemonType.js";
import { PokemonTypeInfo } from "./pokemonBaseInfo.js";

const SCORE_WEIGHT = 0;

const STATUS_IMMUNITY_DEFENSE_BONUS = 1;
const WEATHER_BONUS = 0.5;
const TERRAIN_ATTACK_BONUS = 0.2;

const effectiveAttackMultiplier = 0.3;
const effectiveDefenseMultiplier = 0.1;

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

    const attackScore =
      SCORE_WEIGHT +
      effectiveAttackMultiplier *
        (keys.length -
          attackEffect.veryEffective.length -
          attackEffect.notEffective.length -
          attackEffect.immune.length) +
      attackEffect.veryEffective.length -
      attackEffect.notEffective.length -
      2 * attackEffect.immune.length;

    const defenseScore =
      SCORE_WEIGHT +
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

      // Snow bonus
      defenseScore += WEATHER_BONUS;

      // No hail bonus as snow replaces it

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

      break;

    case PokemonType.FLYING:
      // Entry hazards immunity
      defenseScore += 1;

      // No terrain boost
      attackScore -= TERRAIN_ATTACK_BONUS;

      break;

    case PokemonType.PSYCHIC:
      // Psychic terrain bonus
      attackScore += TERRAIN_ATTACK_BONUS;

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

      break;

    default:
      break;
  }

  return { attackScore, defenseScore };
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
  const data: any = pokemonData.reduce(
    (previousValue, currentValue) => {
      return {
        ...previousValue,
        [currentValue.type]: currentValue.info,
        averageAttack:
          previousValue.averageAttack + currentValue.info.attackScore,
        averageDefense:
          previousValue.averageDefense + currentValue.info.defenseScore,
      };
    },
    { averageAttack: 0, averageDefense: 0 }
  );

  // This are used as benchmark for attack and defense of other types
  data.averageAttack = data.averageAttack / pokemonData.length;
  data.averageDefense = data.averageAttack / pokemonData.length;

  // TODO maybe make async
  const newPokemonData = pokemonData.map((value) => {
    let { attackScore, defenseScore } = calculateStartingScores(value.type);

    let attackEffect = value.info.attackEffect;
    let defenseEffect = value.info.defenseEffect;

    Object.values(PokemonType).forEach((typeValue) => {
      const type = <PokemonType>typeValue;

      // TODO make more readable
      const typeAttack = data[typeValue].attackScore;
      const typeDefense = data[typeValue].defenseScore;

      const attackDistance =
        Math.abs(typeAttack) + Math.abs(data.averageAttack);
      const defenseDistance =
        Math.abs(typeDefense) + Math.abs(data.averageDefense);

      // TODO See if this is the best maths for it
      // Currently uses the distances to both make sure the values are positive
      // and still keep the relative boost form them

      const attackBoost =
        0.4 *
          ((typeDefense + defenseDistance) /
            (data.averageDefense + defenseDistance)) +
        0.6 *
          ((typeAttack + attackDistance) /
            (data.averageAttack + attackDistance));

      const defenseBoost =
        (typeAttack + attackDistance) / (data.averageAttack + attackDistance);

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
