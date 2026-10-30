// Every component reads the theme from here; a shot sets its infection once with <Infected value={…}>.
import React, { createContext, useContext } from "react";
import { theme, Theme } from "./infection";

const Ctx = createContext<Theme>(theme(0));

export const Infected: React.FC<{ value: number; children: React.ReactNode }> = ({ value, children }) => (
  <Ctx.Provider value={theme(value)}>{children}</Ctx.Provider>
);

export const useTheme = () => useContext(Ctx);
