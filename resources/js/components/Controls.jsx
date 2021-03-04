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
                <Button className="left">left</Button>
                <div className="middle-controls">
                    <Button className="up">up</Button>
                    <Button className="down">down</Button>
                </div>
                <Button className="right">right</Button>
            </div>
        //</section>
    );
}

export default Controls;
