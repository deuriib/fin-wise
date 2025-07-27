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
          d="M25,5 C37.5,5 37.5,45 25,45 C12.5,45 12.5,5 25,5 Z M25,12.5 C31.25,12.5 31.25,37.5 25,37.5 C18.75,37.5 18.75,12.5 25,12.5 Z"
          fill="hsl(var(--accent))"
        />
        <text x="50" y="38" className="logo-text">
          FinWise
        </text>
      </g>
    </svg>
  );
}
