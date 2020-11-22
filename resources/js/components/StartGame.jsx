import React, {useEffect, useState} from 'react';
import {Container, Card, Button} from 'react-bootstrap';

/**
 * The screen that starts the game
 * @param {Object} props properties passed from the parent component
 * @return {Object} the component to be displayed
 */
let StartGame = (props) => {
    useEffect( props.getPlayers, [] );

    /**
     * ranks players according to their score
     * which i gotten by adding the number of stars
     * collected to the time spent in the game
     * @return {void}
     */
    let rankPlayers = () => {
        let arr = [];
        let rankedPlayers = [];
        arr = props.players.sort((a,b) => {
            return b.score - a.score;
        });

        let current = { rank: 1, score: 0  }

        if( arr.length != 0 ){
            rankedPlayers = arr.map( (player, i) => {
                //current rank should only change if the next score is < than the current
                if( player.score < current.score ) current.rank += 1;
                current.score = player.score;
                return (
                    <Card className='rank-field' key={i} >
                        <p className='num'>{current.rank}</p>
                        <p className='name'>{player.name}</p>
                        <p className='score'>{player.score}</p>
                    </Card>
                );
            } );  
        }

        rankedPlayers.unshift( 
            (
            <Card className='rank-field' key='heading' >
                <p className='num'><strong>Rank</strong></p>
                <p className='name'><strong>Name</strong></p>
                <p className='score'><strong>Score</strong></p>
            </Card>)
        );

        return (
            <>
                {rankedPlayers}
            </>
        );
    }

    return ( 
        <Container className='start-game' >
            <Card>
                <Card.Header><h1>Sky Angel</h1></Card.Header>
                <Card.Body>
                        <h2>Player Ranking</h2>
                        <div className='rank-container' >
                            {rankPlayers()}
                        </div>
                        <Button variant="primary" onClick={props.startGame} >
                            Start Game
                        </Button>
                </Card.Body>
            </Card>
        </Container>
     );
}

export default StartGame;