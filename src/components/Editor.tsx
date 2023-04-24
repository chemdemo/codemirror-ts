// @no-check
import type {
  CompletionContext,
  CompletionResult,
  Completion,
} from "@codemirror/autocomplete";

import type { Tooltip, ViewUpdate } from "@codemirror/view";

import { useEffect, useRef } from "react";
import { EventEmitter } from "@okikio/emitter";
import { EditorView, hoverTooltip } from "@codemirror/view";
import {
  autocompletion,
  completeFromList,
  startCompletion,
} from "@codemirror/autocomplete";
import { Diagnostic, linter } from "@codemirror/lint";
// import { keymap } from "@codemirror/view";
import Codemirror from "./codemirror";

// @ts-ignore
import debounce from "lodash.debounce";
// @ts-ignore
import debounceAsync from "debounce-async";
// const asyncdebounce = debounceAsync.default;

console.log("----debounce", debounce);
console.log("----debounceAsync", debounceAsync);

// import type * as ts from "@typescript/vfs";

const emitter = new EventEmitter();

export default () => {
  let editorEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let tsServer = new Worker(
      new URL("/workers/tsserver.js", window.location.origin),
      { name: "ts-server" }
    );
    console.log("tsServer", tsServer);

    let editor = Codemirror(editorEl.current!, [
      EditorView.updateListener.of(
        debounce((update: ViewUpdate) => {
          if (update.docChanged) {
            tsServer.postMessage({
              event: "updateText",
              details: update.state.doc,
            });
          }
        }, 150)
      ),

      // autocompletion({
      //   activateOnTyping: true,
      //   override: [
      //     debounceAsync(
      //       async (
      //         ctx: CompletionContext
      //       ): Promise<CompletionResult | null> => {
      //         const { pos } = ctx;
      //         console.log("autocompletion", pos);

      //         try {
      //           tsServer.postMessage({
      //             event: "autocomplete-request",
      //             details: { pos },
      //           });

      //           const completions = await new Promise((resolve) => {
      //             emitter.on("autocomplete-results", (completions) => {
      //               resolve(completions);
      //             });
      //           });

      //           if (!completions) {
      //             console.log("Unable to get completions", { pos });
      //             return null;
      //           }

      //           return completeFromList(
      //             // @ts-ignore
      //             completions.entries.map((c, i) => {
      //               let suggestions: Completion = {
      //                 type: c.kind,
      //                 label: c.name,
      //                 // TODO:: populate details and info
      //                 boost: 1 / Number(c.sortText),
      //               };

      //               return suggestions;
      //             })
      //           )(ctx);
      //         } catch (e) {
      //           console.log("Unable to get completions", { pos, error: e });
      //           return null;
      //         }
      //       },
      //       200
      //     ),
      //   ],
      // }),
      autocompletion(),

      hoverTooltip(
        async ({ state }: EditorView, pos: number): Promise<Tooltip | null> => {
          tsServer.postMessage({
            event: "tooltip-request",
            details: { pos },
          });

          const { result: quickInfo, tootltipText } = await new Promise(
            (resolve) => {
              emitter.on("tooltip-results", (completions) => {
                resolve(completions);
              });
            }
          );

          if (!quickInfo) return null;

          return {
            pos,
            create() {
              const dom = document.createElement("div");
              dom.setAttribute("class", "cm-quickinfo-tooltip");
              dom.textContent = tootltipText;

              return { dom };
            },
          };
        },
        {
          hideOnChange: true,
        }
      ),

      linter(
        // @ts-ignore
        async (view: EditorView): Promise<Diagnostic[]> => {
          console.log("[linter] -----");
          tsServer.postMessage({
            event: "lint-request",
            details: [],
          });

          const diagnostics = await new Promise((resolve) => {
            emitter.on("lint-results", (completions) => {
              resolve(completions);
            });
          });

          if (!diagnostics) return [];
          return diagnostics as Diagnostic[];
        },
        {
          delay: 400,
        }
      ),
    ]);

    emitter.on("ready", () => {
      console.log("ts-server is ready");

      tsServer.postMessage({
        event: "updateText",
        details: editor.state.doc,
      });
    });

    tsServer.addEventListener(
      "message",
      ({ data }: MessageEvent<{ event: string; details: any }>) => {
        let { event, details } = data;
        console.log("[tsServer]", event, details);
        emitter.emit(event, details);
      }
    );
  }, []);

  return <div id="editor" ref={editorEl}></div>;
};
