import React from 'react';
import Timer from 'react-compound-timer'


export default function ClocksStayle({ onStop, shouldStart }) {
    return (
        <Timer
            initialTime={5000}
            direction="backward"
            startImmediately={false}
            checkpoints={[
                {
                    time: 0,
                    callback: () => onStop(),
                }
            ]}

        >
            {({ start, timerState }) => {
                shouldStart && start()
                return <React.Fragment>
                    <Timer.Minutes />:
                    <Timer.Seconds />
                </React.Fragment>

            }}
        </Timer>
    )
}
