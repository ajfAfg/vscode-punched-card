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

  const AddPunchedCardButton: FC<{ className?: string; index: number }> = ({
    className = "",
    index,
  }) => {
    return (
      // <div className="w-8 h-8 rounded-full mx-auto border-2">
      //   <button
      //     // className=" my-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
      //     className=""
      //     onClick={() => {
      //       const newPunchedCards = clone(punchedCards);
      //       // newPunchedCards.push(fromText("")!);
      //       // setPunchedCards(newPunchedCards);
      //       setPunchedCards([
      //         ...newPunchedCards.slice(0, index),
      //         fromText("")!,
      //         ...newPunchedCards.slice(index, newPunchedCards.length),
      //       ]);
      //     }}
      //   >
      //     {/* Add a punched card */}
      //   </button>
      // </div>
      <button
        // className=" my-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
        className={
          "w-8 h-8 rounded-full border-2 border-gray-500 flex mx-auto overflow-visible hover:before:text-xl hover:before:bg-slate-100 hover:before:bg-opacity-30 hover:before:text-slate-300 hover:before:content-['Add_a_punched_card']"
        }
        onClick={() => {
          const newPunchedCards = clone(punchedCards);
          setPunchedCards([
            ...newPunchedCards.slice(0, index),
            fromText("")!,
            ...newPunchedCards.slice(index, newPunchedCards.length),
          ]);
        }}
      >
        {/* Add a punched card */}
        {/* <p className="overflow-visible">Add a punched card</p> */}
      </button>
    );
  };

  return (
    <>
      {punchedCards
        .map((punchedCard, i) => {
          return (
            <div className="flex">
              <div className="w-[64rem] mx-auto my-4 p-4 pt-24 bg-amber-50 flex justify-between cut">
                <>
                  {punchedCard.map((ascii, j) => {
                    return (
                      <div className="flex flex-col space-y-2">
                        {ascii.map((didPunched, k) => (
                          <div>
                            <button
                              className="text-gray-800 text-lg font-mono"
                              onClick={() => {
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
                              {didPunched ? (
                                <div className="w-3 h-8 bg-black border">
                                  <div className="m-auto text-black">{0}</div>
                                </div>
                              ) : (
                                <div className="w-3 h-8 border">
                                  <div className="m-auto">{k + 1}</div>
                                  {/* {k + 1} */}
                                </div>
                              )}
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
        })
        .reduce(
          (acc, elem, i) => (
            <>
              {acc} {elem}
              <AddPunchedCardButton className="flex mx-auto" index={i + 1} />
            </>
          ),
          <AddPunchedCardButton className="flex mx-auto" index={0} />
        )}
    </>
  );
};
