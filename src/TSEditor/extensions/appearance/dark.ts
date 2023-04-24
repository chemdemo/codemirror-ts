// @no-check
import { Extension } from "@codemirror/state";
import {
  oneDarkHighlightStyle,
  oneDarkTheme,
} from "@codemirror/theme-one-dark";
import { base } from "./base";

export const theme = [base, oneDarkTheme];

// @ts-ignore
export const highlightStyle: Extension = [oneDarkHighlightStyle];
