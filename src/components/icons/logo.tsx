export function FinWiseLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="200"
      height="50"
      {...props}
    >
      <style>
        {
          ".logo-text { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 38px; fill: currentColor; }"
        }
      </style>
      <g>
        <path
          d="M10 5 H 35 V 15 H 20 V 25 H 32 V 35 H 20 V 45 H 10 Z"
          fill="hsl(var(--accent))"
        />
        <text x="50" y="38" className="logo-text">
          FinWise
        </text>
      </g>
    </svg>
  );
}
