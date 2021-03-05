import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Displays game controls and configures them
 * @param {Object} props properties passed from parent element
 */
let Controls = (props) => {
    return (
        //<section>
            <div className="controls">
                <Button className="left" onClick={ props.handleLeft }>left</Button>
                <div className="middle-controls">
                    <Button className="up" onClick={ props.handleUp }>up</Button>
                    <Button className="down" onClick={ props.handleDown }>down</Button>
                </div>
                <Button className="right" onClick={ props.handleRight }>right</Button>
            </div>
        //</section>
    );
}

export default Controls;
