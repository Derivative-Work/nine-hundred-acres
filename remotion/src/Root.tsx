import React from "react";
import { Still } from "remotion";
import "./theme/fonts";
import { StyleBoard, StyleBoardProps } from "./compositions/StyleBoard";

const board: StyleBoardProps = { infection: 0, label: "", heat: 0 };

export const Root: React.FC = () => (
  <>
    <Still id="StyleBoard" component={StyleBoard} width={1920} height={1080} defaultProps={board} />
  </>
);
