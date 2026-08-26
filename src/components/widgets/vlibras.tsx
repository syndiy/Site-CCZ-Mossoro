import Script from "next/script";

const VLIBRAS_APP = "https://vlibras.gov.br/app";

export function VLibras() {
  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html:
            '<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>',
        }}
      />
      <Script src={`${VLIBRAS_APP}/vlibras-plugin.js`} strategy="beforeInteractive" />
      <Script id="vlibras-init" strategy="beforeInteractive">
        {`(function initVLibras(){
          if (window.VLibras && window.VLibras.Widget) { new window.VLibras.Widget('${VLIBRAS_APP}'); }
          else { setTimeout(initVLibras, 100); }
        })();`}
      </Script>
    </>
  );
}
