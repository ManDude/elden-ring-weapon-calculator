import { useEffect, useState } from "react";
import type { Weapon } from "../calculator/weapon.ts";
import { decodeRegulationData } from "../regulationData.ts";
import regulationVersions, { type RegulationVersionName } from "./regulationVersions.tsx";

export default function useWeapons(regulationVersionName: RegulationVersionName) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error>();
  const [weapons, setWeapons] = useState<Weapon[]>([]);

  useEffect(() => {
    setWeapons([]);
    setLoading(true);
    regulationVersions[regulationVersionName]
      .fetch()
      .then((res) => res.json())
      .then((data) => {
        setWeapons(decodeRegulationData(data, regulationVersions[regulationVersionName]));
        setLoading(false);
        setError(undefined);
      })
      .catch(setError);
  }, [regulationVersionName]);

  return { weapons, loading, error };
}
