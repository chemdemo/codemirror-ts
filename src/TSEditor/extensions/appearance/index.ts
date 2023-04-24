// @no-check
import { Compartment, Extension, TransactionSpec } from "@codemirror/state";
import {
  EditorView,
  highlightActiveLine,
  highlightSpecialChars,
} from "@codemirror/view";
import merge from "lodash/merge";
import {
  highlightStyle as darkHighlightStyle,
  theme as darkTheme,
} from "./dark";

export type ThemeName = "dark";
export type HighlightStyle = "dark" | "none";

const dimensionsCompartment = new Compartment();
const themeCompartment = new Compartment();
const highlightStyleCompartment = new Compartment();
const editableCompartment = new Compartment();

// @ts-ignore
const getThemeExtension = (t: ThemeName = "light"): Extension => {
  return darkTheme;
};

// @ts-ignore
const getHighlightStyleExtension = (h: HighlightStyle = "dark"): Extension => {
  // if (h === "dark") {
  //   return darkHighlightStyle;
  // } else {
  //   return [];
  // }
  return darkHighlightStyle;
};

export const setTheme = (theme?: ThemeName): TransactionSpec => {
  return {
    effects: themeCompartment.reconfigure(getThemeExtension(theme)),
  };
};

export const setReadOnly = (readOnly: boolean): TransactionSpec => {
  return {
    effects: editableCompartment.reconfigure(EditorView.editable.of(!readOnly)),
  };
};

export const setHighlightStyle = (
  highlightStyle?: HighlightStyle
): TransactionSpec => {
  return {
    effects: highlightStyleCompartment.reconfigure(
      getHighlightStyleExtension(highlightStyle)
    ),
  };
};

export const setDimensions = (
  width: number,
  height: number
): TransactionSpec => {
  return {
    effects: dimensionsCompartment.reconfigure(
      EditorView.editorAttributes.of({
        style: `width: ${width || 300}px; height: ${height || 300}px`,
      })
    ),
  };
};

export const editable = ({ readOnly }: { readOnly: boolean }): Extension =>
  editableCompartment.of(EditorView.editable.of(readOnly));

export const appearance = ({
  domElement,
  theme,
  highlightStyle,
}: {
  domElement?: Element;
  theme?: ThemeName;
  highlightStyle?: HighlightStyle;
}): Extension => {
  const { width, height } = merge(
    { width: 300, height: 300 },
    domElement?.getBoundingClientRect()
  );

  return [
    dimensionsCompartment.of(
      EditorView.editorAttributes.of({
        style: `width: ${width || 300}px; height: ${height || 300}px`,
      })
    ),
    themeCompartment.of(getThemeExtension(theme)),
    highlightStyleCompartment.of(
      getHighlightStyleExtension(highlightStyle || theme)
    ),
    highlightSpecialChars(),
    highlightActiveLine(),
  ];
};
