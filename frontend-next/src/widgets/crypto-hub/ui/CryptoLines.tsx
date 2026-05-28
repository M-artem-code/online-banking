export function CryptoLines() {
  return (
    <div className="crypto-hub__lines" aria-hidden="true">
      <svg
        className="crypto-hub__line-svg crypto-hub__line-svg--tl"
        viewBox="0 0 460 209"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="crypto-hub__line-path"
          pathLength={1}
          d="M0.85011 208.024C0.850114 190.024 0.0623536 123.198 0.850116 93.5246C1.06243 85.5275 4.58025 81.3485 7.35009 78.0246C9.85005 75.0246 63.1835 28.5246 88.8501 6.02463C90.3501 4.70971 96.3501 0.124633 104.35 0.524633C112.35 0.924633 344.35 0.6913 459.35 0.524633"
        />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--tl-start" cx="0.85" cy="208.024" r="5.5" />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--tl-end" cx="459.35" cy="0.524633" r="5.5" />
      </svg>

      <svg
        className="crypto-hub__line-svg crypto-hub__line-svg--br"
        viewBox="0 0 614 287"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="crypto-hub__line-path"
          pathLength={1}
          d="M613 0.00732422C612.5 34.5073 613 105.007 613 113.507C613 121.597 608.238 127.007 605 130.507C586.5 150.507 548.8 191.307 546 194.507C543.2 197.707 537.5 201.507 531 201.507C462.833 201.174 326.1 200.707 316.5 201.507C306.9 202.307 302.3 209.507 299.5 213.007C282.167 234.674 247.5 276.607 245.5 279.007C243.5 281.407 239 286.007 229 286.007H0"
        />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--br-start" cx="613" cy="0.00732422" r="5.5" />
        <circle className="crypto-hub__line-dot crypto-hub__line-dot--br-end" cx="0" cy="286.007" r="5.5" />
      </svg>
    </div>
  );
}
