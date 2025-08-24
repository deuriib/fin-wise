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
      <g transform="translate(0, 2)">
        <g fill="hsl(var(--accent))">
          <path d="M10 15 a 5 5 0 0 1 5 -5 H 35 a 5 5 0 0 1 5 5 V 40 a 5 5 0 0 1 -5 5 H 15 a 5 5 0 0 1 -5 -5 Z" />
          <path d="M10 20 H 40 V 15 a 5 5 0 0 0 -5 -5 H 15 a 5 5 0 0 0 -5 5 Z" />
          <circle cx="32" cy="32" r="3" fill="hsl(var(--background))" />
        </g>
        <text x="50" y="38" className="logo-text">
          FinWise
        </text>
      </g>
    </svg>
  );
}
