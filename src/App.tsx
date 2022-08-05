import * as React from "react";
import { FC, useState } from "react";

export const App: FC = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Foo</button>
      <p>{count}</p>
    </>
  );
};
