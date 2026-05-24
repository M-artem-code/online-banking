export function CryptoRings() {
  return (
    <div className="crypto-hub__rings" aria-hidden="true">
      <div className="crypto-hub__rings-rotator">
        <img
          className="crypto-hub__ring crypto-hub__ring--1"
          src="/figma/border/Ellipse1.png"
          srcSet="/figma/border/Ellipse1.png 1x, /figma/border/Ellipse1@2x.png 2x"
          alt=""
          width={594}
          height={594}
          decoding="async"
        />
        <img
          className="crypto-hub__ring crypto-hub__ring--2"
          src="/figma/border/Ellipse2.png"
          srcSet="/figma/border/Ellipse2.png 1x, /figma/border/Ellipse2@2x.png 2x"
          alt=""
          width={672}
          height={672}
          decoding="async"
        />
        <img
          className="crypto-hub__ring crypto-hub__ring--3"
          src="/figma/border/Ellipse3.png"
          srcSet="/figma/border/Ellipse3.png 1x, /figma/border/Ellipse3@2x.png 2x"
          alt=""
          width={764}
          height={764}
          decoding="async"
        />
      </div>
    </div>
  );
}
