import { useEffect, useMemo, useState } from "react";
import { type Attribute, type Attributes, WeaponType } from "../calculator/calculator.ts";
import type { SortBy } from "../search/sortWeapons.ts";
import type { RegulationVersionName } from "./regulationVersions.tsx";
import regulationVersions from "./regulationVersions.tsx";
import { dlcWeaponTypes } from "./uiUtils.ts";
import { type WeaponOption } from "./WeaponPicker.tsx";

interface AppState {
  readonly regulationVersionName: RegulationVersionName;
  readonly attributes: Attributes;
  readonly twoHanding: boolean;
  readonly upgradeLevel: number;
  readonly weaponTypes: readonly WeaponType[];
  readonly affinityIds: readonly number[];
  readonly includeDLC: boolean;
  readonly includeArcaneBonus: boolean;
  readonly effectiveOnly: boolean;
  readonly splitDamage: boolean;
  readonly showBaseDamage: boolean;
  readonly groupWeaponTypes: boolean;
  readonly numericalScaling: boolean;
  readonly sortBy: SortBy;
  readonly reverse: boolean;
  readonly selectedWeapons: WeaponOption[];
  readonly ghPages: boolean;
}

interface UpdateAppState extends AppState {
  setRegulationVersionName(regulationVersionName: RegulationVersionName): void;
  setAttribute(attribute: Attribute, value: number): void;
  setTwoHanding(twoHanding: boolean): void;
  setUpgradeLevel(upgradeLevel: number): void;
  setWeaponTypes(weaponTypes: readonly WeaponType[]): void;
  setAffinityIds(affinityIds: readonly number[]): void;
  setIncludeDLC(includeDLC: boolean): void;
  setIncludeArcaneBonus(includeArcaneBonus: boolean): void;
  setEffectiveOnly(effectiveOnly: boolean): void;
  setSplitDamage(splitDamage: boolean): void;
  setShowBaseDamage(showBaseDamage: boolean): void;
  setGroupWeaponTypes(groupWeaponTypes: boolean): void;
  setNumericalScaling(numericalScaling: boolean): void;
  setSortBy(sortBy: SortBy): void;
  setReverse(reverse: boolean): void;
  setSelectedWeapons(weapons: WeaponOption[]): void;
}

const defaultAppState: AppState = {
  regulationVersionName: "reforged",
  attributes: {
    str: 30,
    dex: 30,
    int: 30,
    fai: 30,
    arc: 30,
  },
  twoHanding: false,
  upgradeLevel: 25,
  weaponTypes: [WeaponType.AXE],
  affinityIds: [0, -1], // Standard and Special
  includeDLC: true,
  includeArcaneBonus: false,
  effectiveOnly: false,
  splitDamage: true,
  showBaseDamage: false,
  groupWeaponTypes: false,
  numericalScaling: false,
  sortBy: "totalAttack",
  reverse: false,
  selectedWeapons: [],
  ghPages: false
};

/**
 * @returns the initial state of the app, restored from localstorage and the URL if available
 */
function getInitialAppState() {
  const appState = { ...defaultAppState };

  try {
    const storedAppState = localStorage.getItem("appState");
    if (storedAppState) {
      Object.assign(appState, JSON.parse(storedAppState));
    }
  } catch {
    /* ignored */
  }

  // appState.ghPages = window.location.pathname.substring(1) === "elden-ring-weapon-calculator";
  // const regulationVersionName = window.location.pathname.substring(appState.ghPages ? 2 : 1);
  // if (regulationVersionName && regulationVersionName in regulationVersions) {
  //   appState.regulationVersionName = regulationVersionName as RegulationVersionName;
  // }

  return appState;
}

/**
 * Store the state of the app in localstorage and the URL so it can be restored on future visits
 */
function onAppStateChanged(appState: AppState) {
  localStorage.setItem("appState", JSON.stringify(appState));
}

function updateUrl(regulationVersionName: RegulationVersionName, ghPages: boolean) {
  return;
  window.history.replaceState(
    null,
    "",
    ghPages ? `/elden-ring-weapon-calculator/${regulationVersionName === "latest" ? "" : regulationVersionName}` : `/${regulationVersionName === "latest" ? "" : regulationVersionName}`,
  );
}

/**
 * Manages all of the user selectable filters and display options, and saves/loads them in
 * localStorage for use on future page loads
 */
export default function useAppState() {
  const [appState, setAppState] = useState<AppState>(() => {
    return getInitialAppState();
  });

  useEffect(() => {
    onAppStateChanged(appState);
    updateUrl(appState.regulationVersionName, appState.ghPages);
  }, [appState]);

  useEffect(() => {
    function onPopState() {
      updateUrl(appState.regulationVersionName, appState.ghPages);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [appState.regulationVersionName, appState.ghPages]);

  const changeHandlers = useMemo<Omit<UpdateAppState, keyof AppState>>(
    () => ({
      setRegulationVersionName(regulationVersionName) {
        setAppState((prevAppState) => ({ ...prevAppState, regulationVersionName }));
      },
      setAttribute(attribute, value) {
        setAppState((prevAppState) => ({
          ...prevAppState,
          attributes: { ...prevAppState.attributes, [attribute]: value },
        }));
      },
      setTwoHanding(twoHanding) {
        setAppState((prevAppState) => ({ ...prevAppState, twoHanding }));
      },
      setUpgradeLevel(upgradeLevel) {
        setAppState((prevAppState) => ({ ...prevAppState, upgradeLevel }));
      },
      setWeaponTypes(weaponTypes) {
        setAppState((prevAppState) => ({ ...prevAppState, weaponTypes }));
      },
      setAffinityIds(affinityIds) {
        setAppState((prevAppState) => ({ ...prevAppState, affinityIds }));
      },
      setIncludeDLC(includeDLC) {
        setAppState((prevAppState) => ({
          ...prevAppState,
          includeDLC,
          weaponTypes: prevAppState.weaponTypes.filter(
            (weaponType) => !dlcWeaponTypes.includes(weaponType),
          ),
        }));
      },
      setIncludeArcaneBonus(includeArcaneBonus) {
        setAppState((prevAppState) => ({ ...prevAppState, includeArcaneBonus }));
      },
      setEffectiveOnly(effectiveOnly) {
        setAppState((prevAppState) => ({ ...prevAppState, effectiveOnly }));
      },
      setSplitDamage(splitDamage) {
        setAppState((prevAppState) => ({ ...prevAppState, splitDamage }));
      },
      setShowBaseDamage(showBaseDamage) {
        setAppState((prevAppState) => ({ ...prevAppState, showBaseDamage }));
      },
      setGroupWeaponTypes(groupWeaponTypes) {
        setAppState((prevAppState) => ({ ...prevAppState, groupWeaponTypes }));
      },
      setNumericalScaling(numericalScaling) {
        setAppState((prevAppState) => ({ ...prevAppState, numericalScaling }));
      },
      setSortBy(sortBy) {
        setAppState((prevAppState) => ({ ...prevAppState, sortBy }));
      },
      setReverse(reverse) {
        setAppState((prevAppState) => ({ ...prevAppState, reverse }));
      },
      setSelectedWeapons(selectedWeapons) {
        setAppState((prevAppState) => ({ ...prevAppState, selectedWeapons }));
      },
    }),
    [],
  );

  return useMemo(() => ({ ...appState, ...changeHandlers }), [appState, changeHandlers]);
}
