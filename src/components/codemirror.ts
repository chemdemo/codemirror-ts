import { javascript } from "@codemirror/lang-javascript";
import {
  EditorView,
  lineNumbers,
  highlightSpecialChars,
  highlightActiveLine,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLineGutter,
  keymap,
  drawSelection,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
// import { history, historyKeymap } from "@codemirror/history";
// import { foldGutter, foldKeymap } from "@codemirror/fold";
// import { indentOnInput } from "@codemirror/language";
// import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
// import { bracketMatching } from "@codemirror/matchbrackets";
// import { closeBrackets, closeBracketsKeymap } from "@codemirror/closebrackets";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
// import { commentKeymap } from "@codemirror/comment";
// import { rectangularSelection } from "@codemirror/rectangular-selection";
import {
  indentOnInput,
  defaultHighlightStyle,
  syntaxHighlighting,
  bracketMatching,
  foldGutter,
  foldKeymap,
} from "@codemirror/language";
import { lintKeymap } from "@codemirror/lint";

// import { BASIC_SETUP, EditorView, EditorState } from "./editor-basic-setup";
import { THEME, HIGHTLIGHT_STYLE } from "./editor-theme";

import type { Extension } from "@codemirror/state";

const doc = `\
// Click Run for the Bundled + Minified + Gzipped package size
`;

export default (parentEl: HTMLElement, extentions: Extension) => {
  return new EditorView({
    state: EditorState.create({
      doc,
      // @ts-ignore
      extensions: [
        // BASIC_SETUP,

        THEME,
        // HIGHTLIGHT_STYLE,

        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        crosshairCursor(),
        highlightActiveLine(),
        drawSelection(),
        indentOnInput(),
        autocompletion(),
        rectangularSelection(),
        highlightSelectionMatches(),
        // @ts-ignore
        keymap.of([
          // indentWithTab,
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
          ...foldKeymap,
          ...completionKeymap,
          ...lintKeymap,
        ]),
        javascript({
          typescript: true,
        }),
      ].concat(extentions),
    }),
    parent: parentEl,
  });
};
