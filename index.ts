import Chart from "chart.js/auto";
import {
  calculateForDualType,
  getInitialData,
  recalculateData,
} from "./math.js";
import { pokemonBaseInfo } from "./pokemonBaseInfo.js";
import { PokemonType } from "./PokemonType.js";
import { PokemonTypeInfo } from "./types.js";

let chart: Chart;
let data: any;
let pokemonData: {
  type: PokemonType;
  info: PokemonTypeInfo;
}[];

let pokemonDualTypes: {
  typeA: PokemonType;
  typeB: PokemonType;
  info: { attackScore: number; defenseScore: number };
}[] = [];

let currentOrder = "default";

// Type Guard for pokemon types
function isDualType(
  pokemonType:
    | {
        type: PokemonType;
        info: PokemonTypeInfo;
      }
    | {
        typeA: PokemonType;
        typeB: PokemonType;
        info: {
          attackScore: number;
          defenseScore: number;
        };
      }
): pokemonType is {
  typeA: PokemonType;
  typeB: PokemonType;
  info: { attackScore: number; defenseScore: number };
} {
  return (
    (
      pokemonType as {
        typeA: PokemonType;
        typeB: PokemonType;
        info: { attackScore: number; defenseScore: number };
      }
    ).typeA !== undefined
  );
}

let pokemonCompleteData: (
  | {
      type: PokemonType;
      info: PokemonTypeInfo;
    }
  | {
      typeA: PokemonType;
      typeB: PokemonType;
      info: {
        attackScore: number;
        defenseScore: number;
      };
    }
)[];

/**
 *  Creates the dataset based on the current state of the pokemon data
 * @returns The dataset based on the pokemon data
 */
function generateChartDataset() {
  return {
    labels: pokemonCompleteData.map((value) => {
      return isDualType(value) ? value.typeA + "/" + value.typeB : value.type;
    }),
    datasets: [
      {
        label: "Attack",
        backgroundColor: "red",
        data: pokemonCompleteData.map((value) => value.info.attackScore),
      },
      {
        label: "Defense",
        backgroundColor: "blue",
        data: pokemonCompleteData.map((value) => value.info.defenseScore),
      },
      {
        label: "Average",
        backgroundColor: "green",
        data: pokemonCompleteData.map(
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

  pokemonCompleteData = [...pokemonData, ...pokemonDualTypes];

  currentOrder = value;

  switch (value) {
    case "attack":
      pokemonCompleteData.sort((a, b) => {
        return a.info.attackScore - b.info.attackScore;
      });
      break;

    case "defense":
      pokemonCompleteData.sort((a, b) => {
        return a.info.defenseScore - b.info.defenseScore;
      });
      break;
    case "average":
      pokemonCompleteData.sort((a, b) => {
        return (
          a.info.attackScore +
          a.info.defenseScore -
          (b.info.attackScore + b.info.defenseScore)
        );
      });
      break;

    case "attackAverage":
      pokemonCompleteData.sort((a, b) => {
        return (
          a.info.attackScore * 0.7 +
          a.info.defenseScore * 0.3 -
          (b.info.attackScore * 0.7 + b.info.defenseScore * 0.3)
        );
      });
      break;

    case "defenseAverage":
      pokemonCompleteData.sort((a, b) => {
        return (
          a.info.attackScore * 0.3 +
          a.info.defenseScore * 0.7 -
          (b.info.attackScore * 0.3 + b.info.defenseScore * 0.7)
        );
      });
      break;

    default:
      const typeList = Object.values(PokemonType);

      pokemonCompleteData.sort((a, b) => {
        const isADualType = isDualType(a);
        const isBDualType = isDualType(b);

        if (isADualType && isBDualType) {
          return pokemonDualTypes.indexOf(a) - pokemonDualTypes.indexOf(b);
        } else if (isADualType) {
          return -1;
        } else if (isBDualType) {
          return 1;
        } else {
          return typeList.indexOf(a.type) - typeList.indexOf(b.type);
        }
      });

      break;
  }

  chart.data = generateChartDataset();
  chart.update();
}

/**
 * Sets up everything related to the dual type dialog
 */
function setupDualTypeDialog() {
  const typeSelect1 = document.getElementById(
    "type_select1"
  )! as HTMLSelectElement;
  const typeSelect2 = document.getElementById(
    "type_select2"
  )! as HTMLSelectElement;

  // Sets values
  Object.entries(PokemonType).forEach((value) => {
    console.log(value);

    typeSelect1.add(new Option(value[1], value[0]));
    typeSelect2.add(new Option(value[1], value[0]));
  });

  const hiddenItemId = "hidden";

  typeSelect2.selectedIndex = 1;

  typeSelect1.options.item(1)!.id = hiddenItemId;
  typeSelect1.options.item(1)!.hidden = true;
  typeSelect2.options.item(0)!.id = hiddenItemId;
  typeSelect2.options.item(0)!.hidden = true;

  // Sets listeners that make sure the user can't select the same type twice
  typeSelect1?.addEventListener("change", (event) => {
    typeSelect2.options.namedItem(hiddenItemId)!.id = "";
    const newHiddenItem = typeSelect2.options.item(typeSelect1.selectedIndex)!;

    newHiddenItem.hidden = true;
    newHiddenItem.id = hiddenItemId;
  });

  typeSelect2?.addEventListener("change", (event) => {
    typeSelect1.options.namedItem(hiddenItemId)!.id = "";
    const newHiddenItem = typeSelect1.options.item(typeSelect2.selectedIndex)!;

    newHiddenItem.hidden = true;
    newHiddenItem.id = hiddenItemId;
  });

  document
    .getElementById("add-dialog-button")
    ?.addEventListener("click", () => {
      const typeA = Object.values(PokemonType)[typeSelect1.selectedIndex];
      const typeB = Object.values(PokemonType)[typeSelect2.selectedIndex];

      console.log(pokemonData);

      console.log(typeA);
      console.log(typeB);

      const info = calculateForDualType(typeA, typeB, pokemonData);

      pokemonDualTypes.push({
        typeA,
        typeB,
        info,
      });

      // Reorders data with the new info
      onOrderData(currentOrder);
    });
}

pokemonData = getInitialData({ ...pokemonBaseInfo });

for (let index = 0; index < 1000; index++) {
  pokemonData = recalculateData(pokemonData);
}

pokemonCompleteData = [...pokemonData];

data = generateChartDataset();

const orderSelect = document.getElementById("order");
orderSelect?.addEventListener("change", (event) => {
  onOrderData(event!.target!.value);
});

setupDualTypeDialog();

// Sets up the chart itself
const ctx = document.getElementById("myChart");

chart = new Chart(ctx, {
  type: "bar",
  data: data,
});
