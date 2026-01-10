"use client";

import { useState } from "react";

export const Counter = ({ max }: { max?: number | undefined }) => {
  const [count, setCount] = useState(0);

  const handleIncrement = () =>
    setCount((c) => (max !== undefined && c + 1 > max ? c : c + 1));

  return (
    <section className="">
      <div>Count: {count}</div>
      <button onClick={handleIncrement} className="">
        Increment
      </button>
    </section>
  );
};
