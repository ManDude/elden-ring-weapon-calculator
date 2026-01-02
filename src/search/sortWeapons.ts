import { getTotalDamageAttackPower } from "../app/uiUtils.ts";
import { type WeaponTableRowData } from "../app/weaponTable/WeaponTable.tsx";
import { type Attribute, AttackPowerType } from "../calculator/calculator.ts";
import { WeakRateType } from "../calculator/weakRates.ts";

export type SortBy =
  | "name"
  | "totalAttack"
  | "poise"
  | "stamDmg"
  | "stamCost"
  | "bowDist"
  | "crit"
  | `${AttackPowerType}Attack`
  | "sortBy"
  | `${AttackPowerType}SpellScaling`
  | `${Attribute}Scaling`
  | `${Attribute}Requirement`
  | `${AttackPowerType}GuardCutRate`
  | `${WeakRateType}WeakRate`
  | "stability";

/**
 * Sort and paginate a filtered list of weapons for display in the weapon table
 */
export function sortWeapons(
  rows: readonly WeaponTableRowData[],
  sortBy: SortBy,
  reverse: boolean,
): WeaponTableRowData[] {
  const getSortValue = ((): ((row: WeaponTableRowData) => number | string) => {
    if (sortBy === "name") {
      return ([weapon]) => `${weapon.weaponName},${weapon.affinityId.toString().padStart(4, "0")}`;
    }

    if (sortBy === "totalAttack") {
      return ([, { attackPower }]) => -getTotalDamageAttackPower(attackPower);
    }

    if (sortBy === "poise") {
      return ([weapon]) => -weapon.poise;
    }

    if (sortBy === "stamDmg") {
      return ([weapon]) => -weapon.stamDmg;
    }

    if (sortBy === "stamCost") {
      return ([weapon]) => -weapon.stamCost;
    }

    if (sortBy === "crit") {
      return ([weapon]) => -weapon.crit;
    }

    if (sortBy === "bowDist") {
      return ([weapon]) => weapon.bowDist == -1 ? 999999 : -weapon.bowDist;
    }

    if (sortBy === "stability") {
      return ([, { stability }]) => -stability;
    }

    if (sortBy.endsWith("Attack")) {
      const attackPowerType = +sortBy.slice(0, -1 * "Attack".length) as AttackPowerType;
      return ([, { attackPower }]) => -(attackPower[attackPowerType] ?? 0);
    }

    if (sortBy.endsWith("SpellScaling")) {
      const attackPowerType = +sortBy.slice(0, -1 * "SpellScaling".length) as AttackPowerType;
      return ([, { spellScaling }]) => -(spellScaling[attackPowerType] ?? 0);
    }

    if (sortBy.endsWith("Scaling")) {
      const attribute = sortBy.slice(0, -1 * "Scaling".length) as Attribute;
      return ([weapon, { upgradeLevel }]) =>
        -(weapon.attributeScaling[upgradeLevel][attribute] ?? 0);
    }

    if (sortBy.endsWith("Requirement")) {
      const attribute = sortBy.slice(0, -1 * "Requirement".length) as Attribute;
      return ([weapon]) => -(weapon.requirements[attribute] ?? 0);
    }

    if (sortBy.endsWith("GuardCutRate")) {
      const attackPowerType = +sortBy.slice(0, -1 * "GuardCutRate".length) as AttackPowerType;
      return ([, { guardCutRate }]) => -(guardCutRate[attackPowerType] ?? 0);
    }

    if (sortBy.endsWith("WeakRate")) {
      const weakRateType = +sortBy.slice(0, -1 * "WeakRate".length) as WeakRateType;
      return ([weapon]) => -weapon.weakRate[weakRateType];
    }

    return () => "";
  })();

  return [...rows].sort((row1, row2) =>
    getSortValue(row1) > getSortValue(row2) !== reverse ? 1 : -1,
  );
}
