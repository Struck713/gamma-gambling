import p5 from "p5"
import { DynamicSketch } from "."
import { Game } from "@/lib/game";

const setup = (p5: p5, canvasParentRef: Element) => {
    p5.frameRate(25);
    p5.createCanvas(600, 600).parent(canvasParentRef);
    p5.background(0,0,0,0);
}

const draw = (p5: p5, tick: Game.Tick) => {
    p5.clear();
    p5.text(`tick: ${JSON.stringify(tick)}`, 10, 10);
}

export const CrashCanvas = ({ tick } : { tick?: Game.Tick }) => {
    if (!tick) return <></>;
    return <DynamicSketch setup={setup} draw={(p5: p5) => draw(p5, tick)} />
}