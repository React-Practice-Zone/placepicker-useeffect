import { useEffect, useState } from "react";

export default function ProgressBar({ max }) {
  const [remainingTime, setRemainingTime] = useState(max);

  useEffect(() => {
    const loadInterval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(loadInterval);
    };
  }, []);

  return <progress value={remainingTime} max={max} />;
}
