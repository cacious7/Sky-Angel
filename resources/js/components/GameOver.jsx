import React, {useEffect} from 'react';
import {Container, Card, Form, Button} from 'react-bootstrap';

/**
 * Screen seen after the game is over
 * @param {Object} props properties passed from the parent component
 * @return {Object} the component to be displayed
 */
let GameOver = (props) => {
    useEffect(() => { props.stopGame.current = true }, []);

    return (
        <Container className='game-over' >
            <Card>
                <Card.Header><h1>Game Over</h1></Card.Header>
                <Card.Body>
                    <Form onSubmit={props.handleSave}>
                        <Form.Group controlId="playerName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your Name" />
                            <Form.Text className="text-muted" id='save-info'>
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Form>
                    <Button style={ { marginTop: '1rem' } } variant="success" onClick={props.endGame}>
                            continue
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default GameOver;