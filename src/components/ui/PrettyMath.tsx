
import { FC } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = { latex: string };

const PrettyMath: FC<Props> = ({ latex }) => {
  const html = katex.renderToString(latex, {
    displayMode: true,
    output: "html",          // KaTeX outputs an <span class="katex">
    throwOnError: false
  });

  return (
    <div className="flex justify-center my-4">
      <div
        className="
          bg-white dark:bg-neutral-900
          shadow-md rounded-lg
          px-6 py-4
          overflow-x-auto
          max-w-full
        "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default PrettyMath;
