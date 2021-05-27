import React from "react";
import Timer from "react-compound-timer";

export default function ForgetPasswordTimer({ onStop, shouldStart }) {
  return (
    <Timer
      initialTime={5 * 60000}
      direction="backward"
      startImmediately={false}
      checkpoints={[
        {
          time: 0,
          callback: () => onStop(),
        },
      ]}>
      {({ start, timerState }) => {
        shouldStart && start();
        return (
          <React.Fragment>
            <Timer.Minutes />:
            <Timer.Seconds />
          </React.Fragment>
        );
      }}
    </Timer>
  );
}
