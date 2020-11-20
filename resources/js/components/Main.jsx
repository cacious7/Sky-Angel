import React from 'react';
import {useEffect, useState, useRef} from 'react';

function Main() {
    //initiate state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );

    let context = useRef({});
    let canvas = useRef({});
    let imgMeta = useRef({});

    //initialize context, variables and images upon component initial render
    let init = () => {
        canvas.current = document.getElementById('canvas');
        context.current = canvas.current.getContext('2d'); //context.current

        //set background color
        context.current.fillStyle = '#74b9ff';
        context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

        //set initial coordinates for images
        imgMeta.current = {
            plane: {
                imgs: [ //plane will always have only one object under imgs
                    {
                        x: (canvas.current.width - 75)/2, 
                        y: canvas.current.height - 50
                    }
                ],
                size: {
                    width: 50,
                    height: 50
                }
            },
            star: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                }
            },
            parachute: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                }
            },
            cloud: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                }
            },
            loadedImages: 0
        }

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
        if(imgMeta.current.loadedImages === 4){
            imgMeta.current.loadedImages += 1;
            requestAnimationFrame(draw);
        }else{
            imgMeta.current.loadedImages += 1;
        }
    };
    
    
    //draw the game animation
    let draw = () => {
        //if images weren't loaded, return
        if(imgMeta.current.loadedImages != 5){
            alert( '!failed to load images' );
            return;
        }

        //clear canvas to prevent drawing multiple duplicate images
        context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

        //set background color
        context.current.fillStyle = '#74b9ff';
        context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

        //load plane
        drawImages('plane');

        //load clouds at random x positions
        randomX('cloud', 3);
        drawImages('cloud');

        //intiate image drops
        dropImage( imgMeta.current.cloud.imgs[0], 5 );
        requestAnimationFrame(draw);
    }

    let drawImages = (name) => {
        switch(name){
            case 'cloud':
                const cloudMeta = imgMeta.current.cloud;
                for( let img of cloudMeta.imgs ){
                    context.current.drawImage(cloud, img.x, img.y, cloudMeta.size.width, cloudMeta.size.height);
                }
            break;
            case 'bird':
                const birdMeta = imgMeta.current.bird;
                for( let img of birdMeta.imgs ){
                    context.current.drawImage(bird, img.x, img.y, birdMeta.size.width, birdMeta.size.height);
                }
            break;
            case 'parachute':
                const parachuteMeta = imgMeta.current.parachute;
                for( let img of parachuteMeta.imgs ){
                    context.current.drawImage(parachute, img.x, img.y, parachuteMeta.size.width, parachuteMeta.size.height);
                }
            break;
            case 'star':
                const starMeta = imgMeta.current.star;
                for( let img of starMeta.imgs ){
                    context.current.drawImage(star, img.x, img.y, starMeta.size.width, starMeta.size.height);
                }
            break;
            case 'plane':
                const planeMeta = imgMeta.current.plane;
                for( let img of planeMeta.imgs ){
                    context.current.drawImage(plane, img.x, img.y, planeMeta.size.width, planeMeta.size.height);
                }
            break;
        }
    }

    /**
     * Randomize the position at which images are drawn along the X axis of the canvas
     * @param {String} name the name of the image to be drawn
     * @param {Number} num the number of images to be drawn
     */
    const randomX = (name, num) => {
        let coords = {};
        for(let i = 0; i < num; i++){
            coords = { x: Math.random() * canvas.current.width, y: 0 }
            imgMeta.current[name].imgs.push( coords );
        }
    }

    /** Drop images from top of canvas to bottom
     * @param { Object } img the image's meta data to be dropped
     * @param { Object } speed the speed to drop the image at
     * @return { Void }
     */
    let dropImage = (img, speed) => {
        img.y += speed;
    }

    useEffect( () => init(), [] );

    return (
        <div className="container">
            <canvas width='400px' height='400px' id='canvas'>
                Your browser does not support Canvas, please use a more recent browser such as google chrome!
            </canvas>
        </div>
    );
}

export default Main;
