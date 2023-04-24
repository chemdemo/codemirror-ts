// @ts-nocheck
import {
  completionKeymap,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { defaultKeymap, indentWithTab, undo } from "@codemirror/commands";
// import { commentKeymap } from "@codemirror/comment";
import { foldKeymap } from "@codemirror/language";
import { Extension } from "@codemirror/state";
import { keymap as keymapFacet } from "@codemirror/view";

export const keymap = (): Extension => [
  keymapFacet.of([
    // indentWithTab,
    ...defaultKeymap,
    ...closeBracketsKeymap,
    // ...commentKeymap,
    ...completionKeymap,
    ...foldKeymap,
    {
      key: "Ctrl-z",
      mac: "Mod-z",
      run: undo,
    },
  ]),
];
