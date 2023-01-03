import Chart from "chart.js/auto";
import { getInitialData, recalculateData } from "./math.js";
import { pokemonBaseInfo, PokemonTypeInfo } from "./pokemonBaseInfo.js";
import { PokemonType } from "./PokemonType.js";

let pokemonData = getInitialData({ ...pokemonBaseInfo });

for (let index = 0; index < 1000; index++) {
  pokemonData = recalculateData(pokemonData);
}

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
