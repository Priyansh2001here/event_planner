import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import ProgressProvider from "./ProgressProvider";

function CircularProgress({valueStart, valueEnd}) {

  return (
    <div className="" style={{ width: 130, height: 130 }}>
      <ProgressProvider valueStart={valueStart} valueEnd={valueEnd}>
        {(value) => (
          <CircularProgressbar
            value={value}
            text={`${value}%`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: "#fff",
              trailColor: "rgb(256,0,87)",
              textSize: "20px",
            })}
          />
        )}
      </ProgressProvider>
    </div>
  );
}

export default CircularProgress;
