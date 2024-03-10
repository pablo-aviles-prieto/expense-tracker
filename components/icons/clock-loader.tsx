import * as React from "react";
import { SVGProps } from "react";

export const ClockLoader = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} {...props}>
    <style>
      {
        "@keyframes spinner_ZpfF{to{transform:rotate(360deg)}}.spinner_d9Sa{transform-origin:center}"
      }
    </style>
    <path
      strokeWidth={4}
      d="M12 1a11 11 0 1 0 11 11A11 11 0 0 0 12 1Zm0 20a9 9 0 1 1 9-9 9 9 0 0 1-9 9Z"
    />
    <rect
      width={1}
      height={7}
      x={11}
      y={6}
      className="spinner_d9Sa"
      rx={1}
      style={{
        animation: "spinner_ZpfF 9s linear infinite",
      }}
    />
    <rect
      width={1}
      height={9}
      x={11}
      y={11}
      className="spinner_d9Sa"
      rx={1}
      style={{
        animation: "spinner_ZpfF .75s linear infinite",
      }}
    />
  </svg>
);
