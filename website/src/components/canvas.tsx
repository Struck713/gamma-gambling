import { useEffect, useRef } from "react";


const Canvas = (props: any) => {

    const { draw, ...other } = props;
    const canvasRef = useRef(null);

    useEffect(() => {
        
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

        let frameCount: number = 0;
        let animationFrameId: number;
        
        const render = () => {
          frameCount++
          draw(context, frameCount)
          animationFrameId = window.requestAnimationFrame(render)
        }
        render();
        
        return () => {
          window.cancelAnimationFrame(animationFrameId);
        }
    });

    return <canvas ref={canvasRef} {...other} />;
}

export default Canvas;