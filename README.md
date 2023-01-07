# pokemontypeschart

A pokemon type chart showing which type is good at what, and which is the best (probably not bug).

## Description
The code starts by calculating each type's base values based on offensive and defensive effectiveness as well as some basic modifiers such as supported terrain or weather (startingAttack and startingDefense).

The initial values for each type are calculated as such:

$$
\begin{align*}
    \mathrm{attackScore} &= \mathrm{startingAttack} + 0.3\cdot\mathrm{effectiveTypesCount} + \\
      &\qquad \mathrm{superEffectiveTypesCount} - \mathrm{notEffectiveTypesCount} - 2\cdot\mathrm{immuneTypesCount}
\end{align*}
$$

$$ defenseScore = { startingDefense + 0.1\*effectiveTypesCount + resistedTypesCount - superEffectiveTypesCount + 2\* immuneTypesCount} $$

After the initial values are calculated the types go through 1000 iterations (as afterwards no major change happens) of calculation where each type's scores in the previous round is used to calculate a modifier to signify how "powerful" the type is relative to other type.

The modifiers for each type is calculated as such:


$$ attackModifier = { 0.4\left( \frac {typeDefense + |typeDefense| + |avgDefense|} {avgDefense + |typeDefense| + |avgDefense|}\right) + 0.6\left(\frac {typeAttack + |typeAttack| + |avgAttack|} {avgAttack + |typeAttack| + |avgAttack|}\right)} $$

$$ defenseScore = \frac {typeAttack + |typeAttack| + |avgAttack|} {avgAttack + |typeAttack| + |avgAttack|} $$

The new score for each type is calculated as such:

$$ attackScore = { startingAttack + 0.3\*effectiveTypesModifierSum + 1.2\* superEffectiveTypesModifierSum - 1.2\* notEffectiveTypesModifierSum - 2\* immuneTypesModifierSum} $$

$$ defenseScore = { startingDefense + 0.1\*effectiveTypesModifierSum + 1.2\* resistedTypesModifierSum - 1.2\* superEffectiveTypesModifierSum + 2\* immuneTypesModifierSum} $$

Dual types that are added go through a single calculation based on the already calculated single types and their modifiers.

$$ attackScore = { sumOfStartingAttacks + 1.2\* superEffectiveTypesModifierSum + 0.5\* effectiveTypesModifierSum +  - 1.2\* notEffectiveWithBothTypesModifierSum + - 2\* notEffectiveAndImmuneTypesModifierSum - 4\* immuneToBothTypesModifierSum} $$

$$ defenseScore = {  sumOfStartingDefenses + 2\* immuneTypesModifierSum + 0.5\* resistedByOneAndSuperByOtherTypesModifierSum + 1.7\* resistedByBothTypesModifierSum + 1.5\* resistedByOneTypesModifierSum - 3\* superEffectiveToBothTypesModifierSum - 1.5\* superEffectiveTypesModifierSum } $$

## Usage
This project was created using `bun init` in bun v0.4.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun dev
```

