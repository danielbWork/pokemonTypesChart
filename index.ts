import Chart from "chart.js/auto";
import { getInitialData, recalculateData } from "./math.js";
import { pokemonBaseInfo, PokemonTypeInfo } from "./pokemonBaseInfo.js";
import { PokemonType } from "./PokemonType.js";

let chart: Chart;
let data: any;
let pokemonData: {
  type: PokemonType;
  info: PokemonTypeInfo;
}[];

/**
 *  Creates the dataset based on the current state of the pokemon data
 * @returns The dataset based on the pokemon data
 */
function generateChartDataset() {
  return {
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
}

/**
 * Reorders the chart to match the request
 * @param value The new order for the data
 */
function onOrderData(value: string) {
  if (!chart || !data || !pokemonData) return;

  switch (value) {
    case "attack":
      pokemonData.sort((a, b) => {
        return a.info.attackScore - b.info.attackScore;
      });
      break;

    case "defense":
      pokemonData.sort((a, b) => {
        return a.info.defenseScore - b.info.defenseScore;
      });
      break;
    case "average":
      pokemonData.sort((a, b) => {
        return (
          a.info.attackScore +
          a.info.defenseScore -
          (b.info.attackScore + b.info.defenseScore)
        );
      });
      break;

    case "attackAverage":
      pokemonData.sort((a, b) => {
        return (
          a.info.attackScore * 0.7 +
          a.info.defenseScore * 0.3 -
          (b.info.attackScore * 0.7 + b.info.defenseScore * 0.3)
        );
      });
      break;

    case "defenseAverage":
      pokemonData.sort((a, b) => {
        return (
          a.info.attackScore * 0.3 +
          a.info.defenseScore * 0.7 -
          (b.info.attackScore * 0.3 + b.info.defenseScore * 0.7)
        );
      });
      break;

    default:
      const typeList = Object.values(PokemonType);

      pokemonData.sort((a, b) => {
        return typeList.indexOf(a.type) - typeList.indexOf(b.type);
      });

      break;
  }

  chart.data = generateChartDataset();
  chart.update();
}

pokemonData = getInitialData({ ...pokemonBaseInfo });

for (let index = 0; index < 1000; index++) {
  pokemonData = recalculateData(pokemonData);
}

data = generateChartDataset();

const orderSelect = document.getElementById("order");
orderSelect?.addEventListener("change", (event) => {
  onOrderData(event.target.value);
});

const ctx = document.getElementById("myChart");

chart = new Chart(ctx, {
  type: "bar",
  data: data,
});
