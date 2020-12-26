import React, {useEffect} from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import Controls from './Controls';

/**
 * Provides canvas for drawing the game
 * @param {Object} props properties passed from the parent component
 * @return {Object} the component to be displayed
 */
let Game = (props) => {
    //Initializes the game only once
    useEffect( () => props.init(), []);

    return(
        <Container className="game">
            <Card style={ { display: 'flex' } }> <p><strong>Fuel:</strong> {props.fuel}, <strong>Stars:</strong> {props.stars}, <strong>Fly Time:</strong> {props.flyTime}</p> 
                <Button style={ {display: 'flex'} } id='pause-game' onClick={props.handlePause}>{props.pauseText}</Button>
            </Card>
            <canvas width='400px' height='400px' id='canvas' >
                Your browser does not support Canvas, please use a more recent browser such as google chrome!
            </canvas>
            <Controls/>
        </Container>
    );
}

export default Game;