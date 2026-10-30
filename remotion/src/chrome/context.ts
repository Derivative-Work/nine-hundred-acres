// True inside the explainer chrome: scenes then leave the backdrop (fill, glow, dot grid) to the chrome, which draws
// one full-frame backdrop behind the scaled scene, so the scene's own edges never show.
import { createContext, useContext } from "react";

export const ChromeOn = createContext(false);
export const useChrome = () => useContext(ChromeOn);
