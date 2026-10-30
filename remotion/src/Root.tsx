import React from "react";
import { Composition, Still } from "remotion";
import "./theme/fonts";
import { StyleBoard, StyleBoardProps } from "./compositions/StyleBoard";
import { ContextReel, reelLength } from "./compositions/ContextReel";

const board: StyleBoardProps = { infection: 0, label: "", heat: 0 };

export const Root: React.FC = () => (
  <>
    <Still id="StyleBoard" component={StyleBoard} width={1920} height={1080} defaultProps={board} />
    <Composition id="ContextReel" component={ContextReel} width={1920} height={1080} fps={30} durationInFrames={reelLength} />
  </>
);
