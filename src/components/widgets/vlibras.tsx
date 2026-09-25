"use client";

import { useRef } from "react";
import Script from "next/script";

const VLIBRAS_APP = "https://vlibras.gov.br/app";

export function VLibras() {
  const initialized = useRef(false);

  function initialize() {
    const api = (window as Window & {
      VLibras?: { Widget: new (url: string) => unknown };
    }).VLibras;
    if (!initialized.current && api?.Widget) {
      new api.Widget(VLIBRAS_APP);
      initialized.current = true;
    }
  }

  return (
    <>
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html:
            '<div vw class="enabled"><div vw-access-button class="active"></div><div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div></div>',
        }}
      />
      <Script src={`${VLIBRAS_APP}/vlibras-plugin.js`} strategy="afterInteractive" onReady={initialize} />
    </>
  );
}
