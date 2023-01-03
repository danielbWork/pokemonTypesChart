import { PokemonType } from "./PokemonType.js";
import { PokemonTypeInfo } from "./pokemonBaseInfo.js";

const weight = 0;

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
      weight +
      effectiveAttackMultiplier *
        (keys.length -
          attackEffect.veryEffective.length -
          attackEffect.notEffective.length -
          attackEffect.immune.length) +
      attackEffect.veryEffective.length -
      attackEffect.notEffective.length -
      2 * attackEffect.immune.length;

    const defenseScore =
      weight +
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
 * Uses the old data to boost the new
 * @param pokemonData The data we base the calculations on
 */
export function recalculateData(
  pokemonData: {
    type: PokemonType;
    info: PokemonTypeInfo;
  }[]
) {
  // TODO Check if any is removable

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
    let attackScore = weight;
    let defenseScore = weight;

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
        (typeDefense + typeAttack + attackDistance + defenseDistance) /
        (data.averageDefense +
          data.averageAttack +
          attackDistance +
          defenseDistance);

      const defenseBoost =
        (typeAttack + attackDistance) / (data.averageAttack + attackDistance);

      // Decides attack boost based on effectiveness
      if (attackEffect.veryEffective.includes(type)) {
        attackScore += attackBoost;
      } else if (attackEffect.notEffective.includes(type)) {
        attackScore -= attackBoost;
      } else if (attackEffect.immune.includes(type)) {
        attackScore -= 2 * attackBoost;
      } else {
        attackScore += effectiveAttackMultiplier * attackBoost;
      }

      // Decides defense boost based on effectiveness
      if (defenseEffect.veryEffective.includes(type)) {
        defenseScore += defenseBoost;
      } else if (defenseEffect.notEffective.includes(type)) {
        defenseScore -= defenseBoost;
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
