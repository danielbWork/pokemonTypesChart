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

$$
\begin{align*}
    \mathrm{defenseScore} &= \mathrm{startingDefense} + 0.1\cdot\mathrm{effectiveTypesCount} + \\
      &\qquad \mathrm{resistedTypesCount} - \mathrm{superEffectiveTypesCount} + 2\cdot\mathrm{immuneTypesCount}
\end{align*}
$$

After the initial values are calculated the types go through 1000 iterations (as afterwards no major change happens) of calculation where each type's scores in the previous round is used to calculate a modifier to signify how "powerful" the type is relative to other type.

The modifiers for each type is calculated as such:


$$ attackModifier = { 0.4\left( \frac {typeDefense + |typeDefense| + |avgDefense|} {avgDefense + |typeDefense| + |avgDefense|}\right) + 0.6\left(\frac {typeAttack + |typeAttack| + |avgAttack|} {avgAttack + |typeAttack| + |avgAttack|}\right)} $$

$$ defenseModifier = \frac {typeAttack + |typeAttack| + |avgAttack|} {avgAttack + |typeAttack| + |avgAttack|} $$

The new score for each type is calculated as such:

$$
\begin{align*}
    \mathrm{attackScore} &= \mathrm{startingAttack} + 0.3\cdot\mathrm{effectiveTypesModifierSum} + \\
      &\qquad 1.2\cdot\mathrm{superEffectiveTypesModifierSum} - 1.2\cdot\mathrm{notEffectiveTypesModifierSum} - 2\cdot\mathrm{immuneTypesModifierSum}
\end{align*}
$$

$$
\begin{align*}
    \mathrm{defenseScore} &= \mathrm{startingDefense} + 0.1\cdot\mathrm{effectiveTypesModifierSum} + \\
      &\qquad 1.2\cdot\mathrm{resistedTypesModifierSum} - 1.2\cdot\mathrm{superEffectiveTypesModifierSum} + 2\cdot\mathrm{immuneTypesModifierSum}
\end{align*}
$$

Dual types that are added go through a single calculation based on the already calculated single types and their modifiers.

$$
\begin{align*}
    \mathrm{attackScore} &= \mathrm{sumOfStartingAttacks} + 1.2\cdot\mathrm{superEffectiveTypesModifierSum}+ \\
      &\qquad 0.5\cdot\mathrm{effectiveTypesModifierSum} - 1.2\cdot\mathrm{notEffectiveWithBothTypesModifierSum} - \\ 
      &\qquad 2\cdot\mathrm{notEffectiveAndImmuneTypesModifierSum} - 4\cdot\mathrm{immuneToBothTypesModifierSum}
\end{align*}
$$


$$
\begin{align*}
    \mathrm{defenseScore} &= \mathrm{sumOfStartingDefenses} + 2\cdot\mathrm{immuneTypesModifierSum}+ \\
      &\qquad 0.5\cdot\mathrm{resistedByOneAndSuperByOtherTypesModifierSum} + 1.7\cdot\mathrm{resistedByBothTypesModifierSum} + \\ 
      &\qquad 1.5\cdot\mathrm{resistedByOneTypesModifierSum} - 3\cdot\mathrm{superEffectiveToBothTypesModifierSum} - \\ 
      &\qquad 1.5\cdot\mathrm{superEffectiveTypesModifierSum}
\end{align*}
$$

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

