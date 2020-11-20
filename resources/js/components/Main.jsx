import React from 'react';
import {useEffect, useState, useRef} from 'react';

function Main() {
    //initiate state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );

    let [ context, setContext ] = useState({});
    let [ canvas, setCanvas ] = useState({});
    let [ imgMeta, setImgMeta ] = useState({});

    //initiate context and images upon component initial render
    let init = () => {
        setCanvas(prevState => document.getElementById('canvas'));
        setContext(canvas.getContext('2d')); //context

        //set background color
        context.fillStyle = '#74b9ff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //set initial coordinates for images
        setImgMeta({
            plane: {
                x: (canvas.width-50)/2,
                y: canvas.height - 50,
                delay: 0
            },
            star: {
                x: 0,
                y: 0,
                delay: 1.5
            },
            bird: {
                x: 0,
                y: 0,
                delay: .5
            },
            parachute: {
                x: 0,
                y: 0,
                delay: 1.5
            },
            cloud: {
                x: 0,
                y: 0,
                delay: 0
            },
            loadedImages: 0
        });

        //count how many images have loaded
        plane.onload = countLoadedImages;
        star.onload = countLoadedImages;
        bird.onload = countLoadedImages;
        parachute.onload = countLoadedImages;
        cloud.onload = countLoadedImages;

        //give images their src to load from
        plane.src = 'images/plane.png';
        star.src = 'images/star.png';
        bird.src = 'images/bird.png';
        parachute.src = 'images/parachute.png';
        cloud.src = 'images/cloud.png';
    }

    //Count a loaded image
    //if loaded images are already 4, increase counter one last time
    //and call the animation
    let countLoadedImages = () => {
        if(imgMeta.loadedImages === 4){
            setImgMeta( prevState => ({ ...prevState, loadedImages: prevState.loadedImages + 1 }) );
            draw();
            //requestAnimationFrame(draw);
        }else{
            setImgMeta( prevState => ({ ...prevState, loadedImages: prevState.loadedImages + 1 }) );
        }
    };
    
    
    //draw the game animation
    let draw = () => {
        if(imgMeta.loadedImages === 5){
            context.drawImage(plane, imgMeta.plane.x, imgMeta.plane.y, 50, 50);
            // context.drawImage(star, imgMeta.star.x, imgMeta.star.y, 50, 50);
            // context.drawImage(bird, imgMeta.bird.x, imgMeta.bird.y, 50, 50);
            // context.drawImage(parachute, imgMeta.parachute.x, imgMeta.parachute.y, 50, 50);
            context.drawImage(cloud, imgMeta.cloud.x, imgMeta.cloud.y, 50, 50);
        }else{
            alert( '!failed to load images' );
        }
        
        
        //intiate image drops
        //dropImage( imgMeta.cloud, context, canvas );
        setImgMeta( prevState => ({ 
            ...prevState,
            cloud: { 
                ...prevState.cloud,
                y: prevState.cloud.y + 10
            } 
        }) );
        requestAnimationFrame(draw);
    }

    /** Drop images from top of canvas to bottom
     * @param { Object } imgMeta the image's meta data to be droped
     * @param { Object } ctx the canvas context
     * @param { Object } cvs the canvas 
     */
    let dropImage = (imgMeta, ctx, cvs) => {
        imgMeta.y--;
    }

    useEffect( () => init(), [] );

    return (
        <div className="container">
            <canvas width='400px' height='400px' id='canvas'></canvas>
        </div>
    );
}

export default Main;
