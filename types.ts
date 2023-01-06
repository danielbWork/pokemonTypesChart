import { PokemonType } from "./PokemonType.js";

/**
 * Types of effectiveness in relation to other types, doesn't need normal
 * effectiveness as it can be calculated using length of the arrays
 */
export type DamageEffect = {
  veryEffective: PokemonType[];
  notEffective: PokemonType[];
  immune: PokemonType[];
};

/**
 * Base type for info regarding a pokemon type
 */
export type PokemonTypeInfo = {
  /**
   *  How effective this type's attacks are against other type
   */
  attackEffect: DamageEffect;
  /**
   *  How effective this type's defenses are against other type's attacks
   */
  defenseEffect: DamageEffect;
  /**
   * Score for how offensive the type is
   */
  attackScore: number;
  /**
   * Score for how defensive the type is
   */
  defenseScore: number;
};
