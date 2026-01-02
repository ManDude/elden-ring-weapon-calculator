import { memo } from "react";
import { Link, Typography } from "@mui/material";

function Footer() {
  return (
    <Typography component="div" variant="body1" align="center">
      <h1 style={{ display: "inline", font: "inherit", margin: 0, padding: 0 }}>
        Elden Ring Weapon Attack Calculator - optimize any weapon or build for ELDEN RING.
      </h1>
      <br />
      Edited version from the original by Tom Clark (
      <Link href="https://github.com/ThomasJClark/elden-ring-weapon-calculator" target="_blank" rel="noopener noreferer">
        https://github.com/ThomasJClark/elden-ring-weapon-calculator
      </Link>
      ). ELDEN RING is a trademark of FromSoftware.
    </Typography>
  );
}

export default memo(Footer);
