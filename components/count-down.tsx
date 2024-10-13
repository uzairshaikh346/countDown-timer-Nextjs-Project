"use client"
import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPause, setIsPause] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetduration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPause(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPause(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPause(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPause(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPause) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPause]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow-lg w-96 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Countdown Timer</h1>

      <div className="flex mb-6">
        <Input
          type="number"
          className="border rounded-l px-4 py-2 w-full"
          placeholder="Enter time in seconds"
          value={duration}
          onChange={handleDurationChange}
        />
        <Button
          className="border-l-0 border rounded-r bg-blue-500 text-white px-4 hover:bg-blue-600"
          onClick={handleSetduration}
        >
          Set
        </Button>
      </div>

      <div className="text-6xl font-bold mb-6">
        {formatTime(timeLeft)}
      </div>

      <div className="flex space-x-4">
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={handleStart}
        >
          Start
        </Button>
        <Button
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          onClick={handlePause}
        >
          {isPause ? "Resume" : "Pause"}
        </Button>
        <Button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
