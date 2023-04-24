import { useEffect, useRef } from "react";

import { TSEditor } from "./TSEditor";

const doc = `\
interface IData {}
`;

export default () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    new TSEditor({
      domElement: ref.current!,
      code: doc,
    });
  }, []);

  return <div ref={ref} />;
};
