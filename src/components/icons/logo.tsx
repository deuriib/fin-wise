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
        {/* Wallet Icon */}
        <g transform="translate(5, 5)">
          {/* Main body */}
          <path
            d="M35,3H5C3.895,3,3,3.895,3,5v30c0,1.105,0.895,2,2,2h30c1.105,0,2-0.895,2-2V5C37,3.895,36.105,3,35,3z"
            fill="hsl(var(--primary))"
          />
          {/* Flap */}
          <path
            d="M3,11h34v6H3V11z"
            fill="hsl(var(--accent))"
           />
           {/* Card Slot */}
           <path 
            d="M9,23h22v2H9V23z"
            fill="hsl(var(--primary-foreground))"
            opacity="0.5"
           />
        </g>
        
        {/* Text */}
        <text x="50" y="38" className="logo-text">
          FinWise
        </text>
      </g>
    </svg>
  );
}
