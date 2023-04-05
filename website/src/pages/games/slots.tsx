import React, { ComponentProps } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

// The slots game
// See annotations in JS for more information
const setup = (p5: p5Types, canvasParentRef: Element) => {
  p5.createCanvas(600, 700).parent(canvasParentRef);
  p5.background(0,0,0,0);
};

let x = 50;
const y = 50;
const draw = (p5: p5Types) => {
  p5.clear(); // you need to clear at the draw of each frame since the background is transparent, otherwise traces appear
  p5.ellipse(x, y, 70, 70);
  x++;
};

const Slots = () => {
    return(
      <div style={{ //center items
        paddingTop: 20, //adjust distance from bottom of navbar
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }}>
        <Sketch setup={setup} draw={draw} />
    </div>
    )
  }
  
export default Slots;