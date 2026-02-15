/*
 * Components used to render certain data cells in the weapon table
 *
 * These are implemented as memozied components because they often don't update when the rest
 * of the table does, so it's performant to be able to skip over them when e.g. only attack
 * power changes.
 */
import { memo } from "react";
import { Box, Link, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import type { Weapon, Attribute } from "../../calculator/calculator.ts";
import { getAttributeLabel } from "../uiUtils.ts";

export const blankIcon = <RemoveIcon color="disabled" fontSize="small" />;

/**
 * @returns the given value truncated to an integer
 */
export function round(value: number) {
  // Add a small offset to prevent off-by-ones due to floating point error
  return Math.floor(value + 0.000000001);
}

/**
 * Component that displays the weapon name as a wiki link.
 */
export const WeaponNameRenderer = memo(function WeaponNameRenderer({
  weapon,
  upgradeLevel,
}: {
  weapon: Weapon;
  upgradeLevel: number;
}) {
  const text = `${weapon.name}${upgradeLevel > 0 ? ` +${upgradeLevel}` : ""}`;
  return (
    <Box>
      {weapon.url ? (
        <Link
          variant="button"
          underline="hover"
          href={weapon.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </Link>
      ) : (
        <Typography variant="button">{text}</Typography>
      )}
      {weapon.variant && (
        <Typography component="span" variant="body2">
          {" "}
          ({weapon.variant})
        </Typography>
      )}
    </Box>
  );
});

/**
 * Component that displays the scaling for an attribute on a weapon.
 */
export const ScalingRenderer = memo(function ScalingRenderer({
  weapon: { attributeScaling, scalingTiers },
  upgradeLevel,
  attribute,
  numerical,
}: {
  weapon: Weapon;
  upgradeLevel: number;
  attribute: Attribute;
  numerical?: boolean;
}) {
  const scalingValue = attributeScaling[upgradeLevel][attribute];
  return scalingValue ? (
    <span title={`${Math.round(scalingValue * 1000000) / 10000}%`}>
      {numerical
        ? `${Math.round(scalingValue * 10000) / 100}`
        : scalingTiers.find(([value]) => scalingValue >= value)?.[1]}
    </span>
  ) : (
    blankIcon
  );
});

/**
 * Component that displays an attribute of a weapon.
 */
export const AttributeRequirementRenderer = memo(function AttributeRequirementRenderer({
  weapon: { requirements },
  attribute,
  ineffective,
}: {
  weapon: Weapon;
  attribute: Attribute;
  ineffective: boolean;
}) {
  const requirement = requirements[attribute] ?? 0;
  if (requirement === 0) {
    return blankIcon;
  }

  if (ineffective) {
    return (
      <Typography
        sx={{ color: (theme) => theme.palette.error.main }}
        aria-label={
          `${requirement}. Unable to wield this weapon effectively with present` +
          ` ${getAttributeLabel(attribute)} stat`
        }
      >
        {requirement}
      </Typography>
    );
  }

  return <>{requirement}</>;
});

/**
 * Component that displays one damage type / status effect / spell scaling of a weapon.
 */
export const AttackPowerRenderer = memo(function AttackPowerRenderer({
  value,
  ineffective,
}: {
  value?: number;
  ineffective: boolean;
}) {
  if (value == null) {
    return blankIcon;
  }

  if (ineffective) {
    return (
      <Typography
        sx={{ color: (theme) => theme.palette.error.main }}
        aria-label={`${round(value)}. Unable to wield this weapon effectively with present stats`}
      >
        {round(value)}
      </Typography>
    );
  }

  return <>{round(value)}</>;
});

/**
 * Component that displays one damage type alongside its base damage.
 */
export const AttackPowerWithBaseRenderer = memo(function AttackPowerWithBaseRenderer({
  value,
  valueBase,
  ineffective,
}: {
  value?: number;
  valueBase?: number;
  ineffective: boolean;
}) {
  if (value == null || valueBase == null) {
    return blankIcon;
  }

  if (ineffective) {
    return (
      <Typography
        sx={{ color: (theme) => theme.palette.error.main }}
        aria-label={`${round(value)}. Unable to wield this weapon effectively with present stats`}
      >
        {round(valueBase)} - {-round(value-valueBase)}
      </Typography>
    );
  }

  return <>{round(valueBase)} + {round(value-valueBase)}</>;
});

/**
 * Component that displays one damage type / status effect / spell scaling of a weapon.
 */
export const ScalingPercentRenderer = memo(function ScalingPercentRenderer({
  value,
  ineffective,
}: {
  value?: number;
  ineffective: boolean;
}) {
  if (value == null || value == 0) {
    return blankIcon;
  }

  if (ineffective) {
    return (
      <Typography
        sx={{ color: (theme) => theme.palette.error.main }}
        aria-label={`${round(value)}%. Unable to wield this weapon effectively with present stats`}
      >
        {round(value)}%
      </Typography>
    );
  }

  return <>{round(value*10)/10}%</>;
});

/**
 * Component that displays one damage type alongside its base damage.
 */
export const ScalingPercentWithBaseRenderer = memo(function ScalingPercentWithBaseRenderer({
  value,
  valueBase,
  ineffective,
}: {
  value?: number;
  valueBase?: number;
  ineffective: boolean;
}) {
  if (valueBase == null) {
    valueBase = 0;
  }
  if (value == null) {
    value = 0;
  }
  if (valueBase == 0 && value == 0) {
    return blankIcon;
  }

  if (value == 0) {
    return <>{round(valueBase)}</>;
  }
  
  if (ineffective) {
    return (
      <Typography
        sx={{ color: (theme) => theme.palette.error.main }}
        aria-label={`${round(value)}%. Unable to wield this weapon effectively with present stats`}
      >
        {round(valueBase)} - {-round(value*10)/10}%
      </Typography>
    );
  }

  return <>{round(valueBase)} + {round(value*10)/10}%</>;
});

/**
 * Component that displays one cut rate (guard negation) for a damage type of a weapon. Also guard stability.
 */
export const CutRateRenderer = memo(function CutRateRenderer({
  value,
}: {
  value?: number;
}) {
  if (value == null || value == 0) {
    return blankIcon;
  }

  return (
    <span title={`${value}%`}>
      {`${Math.min(100, Math.round(value * 10) / 10)}%`}
    </span>);
});

/**
 * Component that displays the range modifier of a weapon.
 */
export const BowDistRenderer = memo(function BowDistRenderer({
  value,
}: {
  value: number;
}) {
  if (value == -1) {
    return blankIcon;
  }

  return (<>{value+100}%</>);
});

/**
 * Component that displays the damage bonus vs. a specific type of enemy
 */
export const WeakRateRenderer = memo(function WeakRateRenderer({
  weapon: { weakRate },
  type
}: {
  weapon: Weapon;
  type: number;
}) {
  if (weakRate[type] == 1) {
    return blankIcon;
  }

  return (<>{round((weakRate[type]-1)*100*100)/100}%</>);
});
