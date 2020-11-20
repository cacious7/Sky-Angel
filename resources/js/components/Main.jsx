import React from 'react';
import {useEffect, useState, useRef} from 'react';

function Main() {
    //initiate state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );
    const [ fuel, setFuel ] = useState(10);
    const [ stars, setStars ] = useState(0);

    let context = useRef({});
    let canvas = useRef({});
    let imgMeta = useRef({});
    let gameOver = useRef(false);

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
                },
                gravity: 2,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 1300
                }, //counts time in milliseconds
                maxDrop: 5, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            bird: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 30,
                    height: 30
                },
                gravity: 3,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 2300
                }, //counts time in milliseconds
                maxDrop: 12, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            star: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                },
                gravity: 2.5,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 6000
                }, //counts time in milliseconds
                maxDrop: 3, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            parachute: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                },
                gravity: 2.5,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 8000
                }, //counts time in milliseconds
                maxDrop: 2, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            cloud: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                },
                gravity: 6,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 1200
                }, //counts time in milliseconds
                maxDrop: 15, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            loadedImages: 0,
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
    
    //draw the game animation
    let draw = (timestamp) => {
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

        //let collionDetected = collisionDetected('bird', bird);

        //#PLANE
        //load plane
        drawImages('plane');
        
        //fuel monitoring
        fuelMonitor(timestamp);

        //#CLOUDS
        animateImg('cloud', timestamp);

        //#BIRDS
        animateImg('bird', timestamp);

        //#PARACHUTES
        animateImg('parachute', timestamp);

        //#STARS
        animateImg('star', timestamp);

        //collionDetected = collisionDetected('bird', bird);

        //get animation fram
        requestAnimationFrame(draw);
    }

    //monitor the fuel
    let fuelMonitor = (timestamp) => {
        timeMonitor('plane', timestamp);
        if( imgMeta.current.plane.time.elapsed >= 1000 ){
            resetTimeMonitor('plane');
            setFuel( prevState => prevState -= 1 );
            if(fuel == 0) gameOver = true;
        }
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

    //track side coordinates of all images of a specific type
    let trackSideCoords = (name) => {
        let area = {};
        const top = [ ...topBottomCoords(name, 'top') ];
        const bottom = [ ...topBottomCoords(name, 'bottom') ];
        const left = [ ...leftRightCoords(name, 'left') ];
        const right = [ ...leftRightCoords(name, 'right') ];

        area = {
            top: top,
            bottom: bottom,
            left: left,
            right: right
        }

        //console.log(area);
        //update image type area coords for all images of that type
        imgMeta.current[name].area = area;
    }

    //returns the top or bottom coords
    let topBottomCoords = (name, side) => {
        //range = x -> x + image width
        //constant = y+h or y
        let imgData = imgMeta.current[name];
        let imgs = imgData.imgs;
        let coords = [];
        imgs.forEach(img => {
            let yConstant;
            if(side == 'bottom'){
                yConstant = img.y + imgData.size.height;
            }else if(side == 'top'){
                yConstant = img.y;
            }
            
            const xRange = getRange( img.x, img.x + imgData.size.width );
            let imgCoords = [];
            //all x coords must be paired with the yConstant
            xRange.forEach( xCoord => {
                imgCoords.push( { x: xCoord, y: yConstant } );
            });
            coords.push( ...imgCoords );
        });
        return coords;
    }

    let leftRightCoords = (name, side) => {
        //range = y -> y + image height
        //constant = x or x + width
        let imgData = imgMeta.current[name];
        let imgs = imgData.imgs;
        let coords = [];
        imgs.forEach(img => {
            let xConstant;
            if(side == 'right'){
                xConstant = img.x + imgData.size.width;
            }else if(side == 'top'){
                xConstant = img.x;
            }
            
            const yRange = getRange( img.y, img.y + imgData.size.height );
            let imgCoords = [];
            //all y coords must be paired with the xConstant
            yRange.forEach( yCoord => {
                imgCoords.push( { x: xConstant, y: yCoord } );
            });
            coords.push( ...imgCoords );
        });
        return coords;
    }

    //returns the range of two values
    let getRange = (min, max) => {
        let range = [];
        for(let i = min; i <= max; i++){
            range.push(i);
        }
        //console.log(range);
        return range;
    }

    let collisionDetected = (name) => {
        let planeMeta = imgMeta.current.plane;
        let imgCoords = imgMeta.current[name].imgs;

        if(imgCoords.length == 0) return false;

        //The x position of the img is >=  the x position of the plane
        //The x position of the img is <= the x position of the plane plus its width
        //The y position of the img is >= the y position of the plane
        //The y position of the img is <= the y position of the plane plus its height
        
        let detected = imgCoords.some( (img) => {
            if( (img.x >= planeMeta.imgs[0].x && ( img.x <= planeMeta.imgs[0].x + planeMeta.size.width ))
            && (img.y >= planeMeta.imgs[0].y && ( img.y <= planeMeta.imgs[0].y + planeMeta.size.height))){
                return true;
            }else{
                return false;
            }
        });

        if(detected) alert('Collision Detected with ' + name);

        return detected;
    }

    let animateImg = (name, timestamp) => {
        //load image at random x positions after a delay
        timeMonitor(name, timestamp);
        if(imgMeta.current[name].time.elapsed > imgMeta.current[name].time.visibility){
            resetTimeMonitor(name);
            randomX(name, Math.random() * imgMeta.current[name].maxDrop);
        }

        //draw and drop cloud images
        drawImages(name);

        //track coordinates of each image type
        // trackSideCoords('bird');
        // trackSideCoords('plane');
        let detected = collisionDetected('bird');
        if(Boolean(detected)){
            gameOver.current = true;
        }
        dropImages(name);
    };

    //check for collision by making sure no plane coordinate is present in any of the 
    //image area coordinates
    let cd = (name) => {
        let imgData = imgMeta.current[name];
        //image area coords
        let coords = joinAllCoords(imgData);

        //plane area coords
        let planeAreaCoords = joinAllCoords( imgMeta.current.plane );

        //check collision
        //console.log(planeAreaCoords);
        let detected = planeAreaCoords.some( coord => {
            let match = coords.some( imgCoord => {
                return coord.x == imgCoord.x && coord.y == imgCoord.y
            } );

            console.log( match );
            return match;
        } );

        return detected;
    }

    //joins all the area coordinates of a given image type
    let joinAllCoords = (imgData) => {
        let area = imgData.area;
        let coords = [ ...area.top, ...area.bottom, ...area.left, ...area.right ];
        //console.log(coords)
        return coords;
    }

    /**
     * Stops time monitoring for a specific image
     * @param {String} name name of the image to stop time monitoring
     */
    let resetTimeMonitor = (name) => {
        imgMeta.current[name].time.monitor = false;
        imgMeta.current[name].time.start = null;
        imgMeta.current[name].time.current = null;
        imgMeta.current[name].time.elapsed = 0;

    }

    /**
     * Monitors and counts time elapsed
     * @param {String} name the name of the image monitoring time
     * @param {Number} timestamp timestamp gotten from requestAnimationFrame
     * @return {Number} the time elapsed
     */
    let timeMonitor = ( name, timestamp ) => {
        const startTime = imgMeta.current[name].time.start;
        const monitoring = imgMeta.current[name].time.monitoring;
        //if start time has been set / time monitoring has began
        //return time difference
        //else return 0
        if(Boolean(startTime) && Boolean(monitoring)){
            imgMeta.current[name].time.current = timestamp;
            imgMeta.current[name].time.elapsed = imgMeta.current[name].time.current - startTime;
            return imgMeta.current[name].time.elapsed;
        }else{
            imgMeta.current[name].time.monitoring = true;
            imgMeta.current[name].time.start = timestamp;
            return imgMeta.current[name].time.elapsed;
        }

    }


    /**
     * Draws images on the canvas
     * @param {String} name name of the images to e drawn
     */
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
        imgMeta.current[name].imgs = []; //reset the array to prevent piling more objects than desired
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
    let dropImages = (name) => {
        imgMeta.current[name].imgs.forEach( img => img.y += imgMeta.current[name].gravity );
    }

    useEffect( () => init(), []);

    return (
        <div className="container">
            <div style={ { display: 'flex' } }> <p><strong>Fuel:</strong> {fuel}, <strong>Stars:</strong> {stars}</p> </div>
            <canvas width='400px' height='400px' id='canvas'>
                Your browser does not support Canvas, please use a more recent browser such as google chrome!
            </canvas>
        </div>
    );
}

export default Main;
