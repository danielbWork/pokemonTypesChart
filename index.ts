import Chart from "chart.js/auto";
import { pokemonBaseInfo, PokemonTypeInfo } from "./pokemonBaseInfo.js";
import { PokemonType } from "./PokemonType.js";

const weight = 10;

/**
 * Creates the initial data for the chart
 * @param info The starting info we base the data on
 */
function getInitialData(info: Record<PokemonType, PokemonTypeInfo>) {
  const keys = Object.keys(info);

  const data: { type: PokemonType; info: PokemonTypeInfo }[] = [];

  keys.forEach((key) => {
    const type = <PokemonType>key;

    const startingInfo = info[<PokemonType>key];

    const attackEffect = startingInfo.attackEffect;
    const defenseEffect = startingInfo.defenseEffect;

    const attackScore =
      attackEffect.veryEffective.length -
      attackEffect.notEffective.length -
      2 * attackEffect.immune.length;

    const defenseScore =
      defenseEffect.veryEffective.length -
      defenseEffect.notEffective.length +
      2 * defenseEffect.immune.length;

    data.push({ type, info: { ...startingInfo, attackScore, defenseScore } });
  });

  return data;
}

const pokemonData = getInitialData({ ...pokemonBaseInfo });

console.log(pokemonData);

let data = {
  labels: pokemonData.map((value) => value.type),
  datasets: [
    {
      label: "Attack",
      backgroundColor: "red",
      data: pokemonData.map((value) => value.info.attackScore),
    },
    {
      label: "Defense",
      backgroundColor: "blue",
      data: pokemonData.map((value) => value.info.defenseScore),
    },
    {
      label: "Average",
      backgroundColor: "green",
      data: pokemonData.map(
        (value) => (value.info.attackScore + value.info.defenseScore) / 2
      ),
    },
  ],
};

// Doesn't work
// let data = {
//   datasets: [
//     {
//       data: pokemonData.map((value) => {
//         const info = value.info;
//         return {
//           Attack: info.attackScore,
//           Defense: info.defenseScore,
//           Average: (info.attackScore + info.defenseScore) / 2,
//         };
//       }),
//     },
//   ],
// };

const ctx = document.getElementById("myChart");

var myBarChart = new Chart(ctx, {
  type: "bar",
  data: data,
  // options: {
  //     barValueSpacing: 20,
  //     scales: {
  //         yAxes: [{
  //             ticks: {
  //                 min: 0,
  //             }
  //         }]
  //     }
  // }
});
