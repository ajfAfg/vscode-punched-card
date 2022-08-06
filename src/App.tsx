import * as React from "react";
import { FC, useState, useRef, useEffect } from "react";
import { WebviewApi } from "vscode-webview";
import { arrayChunk } from "./myArray";
import { clone } from "./myObject";
import { fromText, PunchedCard, toText } from "./punchedCard";

export const App: FC = () => {
  const [punchedCards, setPunchedCards] = useState<PunchedCard[]>([]);

  const vscode = useRef<WebviewApi<{ text: any }> | undefined>(undefined);
  useEffect(() => {
    vscode.current = acquireVsCodeApi();
  }, []);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const message = e.data;
      switch (message.type) {
        case "update":
          const text = message.text;
          setPunchedCards(
            arrayChunk(Array.from(text), 40).map(
              (chars) => fromText(chars.join(""))!
            )
          );
          // vscode.setState({ text });
          break;
      }
    });
  }, []);

  // const state = vscode.getState();
  // if (state) {
  //   setBar(state.text);
  // }

  return (
    <>
      {punchedCards.map((punchedCard, i) => {
        return (
          <div className="flex">
            <div className="w-[64rem] mx-auto my-4 p-4 bg-amber-50 flex justify-between">
              <>
                {punchedCard.map((ascii, j) => {
                  return (
                    <div className="flex-col">
                      {ascii.map((didPunched, k) => (
                        <div>
                          <button
                            className="text-gray-800 text-lg font-mono"
                            onClick={() => {
                              // const newPunchedCards = punchedCards.map(
                              //   (punchedCard) =>
                              //     punchedCard.map((ascii) => [...ascii])
                              // ) as PunchedCard[];
                              const newPunchedCards = clone(punchedCards);
                              newPunchedCards[i][j][k] = true;
                              setPunchedCards(newPunchedCards);
                              //
                              vscode.current?.postMessage({
                                type: "change",
                                text: toText(newPunchedCards.flat()),
                              });
                            }}
                          >
                            {didPunched ? "x" : k + 1}
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 h-8 my-auto"
              onClick={() => {
                const newPunchedCards = clone(punchedCards);
                newPunchedCards.splice(i, 1);
                setPunchedCards(newPunchedCards);
                //
                vscode.current?.postMessage({
                  type: "change",
                  text: toText(newPunchedCards.flat()),
                });
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        className="mx-auto my-8 flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        onClick={() => {
          // const newPunchedCards = punchedCards.map((punchedCard) =>
          //   punchedCard.map((ascii) => [...ascii])
          // ) as PunchedCard[];
          const newPunchedCards = clone(punchedCards);
          newPunchedCards.push(fromText("")!);
          setPunchedCards(newPunchedCards);
        }}
      >
        Add a punched card
      </button>
    </>
  );
};
