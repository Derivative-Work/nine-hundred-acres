import React from "react";
import { Composition, Still } from "remotion";
import "./theme/fonts";
import { StyleBoard, StyleBoardProps } from "./compositions/StyleBoard";
import { ContextReel, reelLength } from "./compositions/ContextReel";
import { Animatic, SECTIONS, Section, animaticLength, sectionRange } from "./compositions/Animatic";
import { Vertical, verticalLength } from "./compositions/Vertical";

const board: StyleBoardProps = { infection: 0, label: "", heat: 0 };

export const Root: React.FC = () => (
  <>
    <Still id="StyleBoard" component={StyleBoard} width={1920} height={1080} defaultProps={board} />
    <Composition id="Animatic" component={Animatic} width={1920} height={1080} fps={30} durationInFrames={animaticLength} defaultProps={{ label: true, chrome: true }} />
    {SECTIONS.map(([name]) => {
      const [a, b] = sectionRange(name);
      return <Composition key={name} id={name} component={Section} width={1920} height={1080} fps={30} durationInFrames={b - a} defaultProps={{ name, label: true, chrome: true }} />;
    })}
    <Composition id="Vertical" component={Vertical} width={1080} height={1920} fps={30} durationInFrames={verticalLength} />
    <Composition id="ContextReel" component={ContextReel} width={1920} height={1080} fps={30} durationInFrames={reelLength} />
  </>
);
