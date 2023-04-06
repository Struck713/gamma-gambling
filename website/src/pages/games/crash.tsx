import React, { ComponentProps } from "react";
import dynamic from "next/dynamic";
import p5Types from "p5";

const maxMult = 8;
const paddingtop = 30;
const paddingright = 50;
let distancex = 0;
let heightz = 0;
let curviness = 0;
let multiplier = 0;
const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(600, 600).parent(canvasParentRef);
    p5.background(0,0,0,0);
    heightz = 500;
    distancex = p5.width/2;
};

const draw = (p5: p5Types) => {
  p5.clear(); // you need to clear at the draw of each frame since the background is transparent, otherwise traces appear
  drawCurve(p5, curviness, distancex, heightz);
  if (curviness < 1500) //Set max curviness during growth
  {
    curviness += 50;
  }
  //Set
  if (distancex < p5.width - paddingright)
  {
    distancex++;
  }
  if (heightz > paddingtop)
  {
    heightz--;
  }
};

const drawCurve = (p5: p5Types, curviness: any, distance:any, ht:any) =>
{
  p5.noFill();
  p5.stroke(255, 0, 0);
  p5.bezier(-curviness, p5.height, 0, p5.height, distance, ht, distance, ht);
  p5.textSize(32);
  p5.text("🚀", distance, ht);
  p5.textSize(20);
  p5.stroke(0);
  multiplier = (maxMult * (1 - (heightz-paddingtop)/p5.height));
  p5.fill(255);
  p5.text(`Multiplier = ${multiplier.toFixed(2)}x`, 20, 20);
  
}

const Slots = () => {

  const Sketch = dynamic(() => import('react-p5').then((mod) => mod.default), {
    ssr: false,
  });

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