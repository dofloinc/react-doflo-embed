import React, { useCallback, useRef, useEffect, useState } from "react";
export default function DoFloEmbed(props: {
  src: string;
  className?: string;
  scrolling?: boolean;
}) {
  const iframe = useRef<null | HTMLIFrameElement>(null);
  const queue = useRef<Array<{ data: string; origin: string }>>([]);
  const [added, setAdded] = useState(false);
  const [src, setSrc] = useState(props.src);
  const [srcModified, setSrcModified] = useState(false);
  const [height, setHeight] = useState("300px");
  const [opacity, setOpacity] = useState(0.01);

  useEffect(() => {
    if (iframe.current && queue.current.length > 0) {
      queue.current.forEach((d) => {
        handleIframeMessage(d);
      });
      queue.current = [];
    }
  }, [iframe.current]);
  
  const handleIframeMessage = useCallback(
    (e: { data: string; origin: string }) => {
      if (!e.data.split) {
        return;
      }
      const args = e.data.split(":");
      const embedId = args[2];
      if (!iframe.current) {
        queue.current.push(e);
        return;
      }
      if (iframe.current.src.split("?")[0].indexOf(embedId) > -1) {
        switch (args[0]) {
          case "scrollIntoView":
            iframe.current.scrollIntoView();
            break;
          case "setHeight":
            setHeight(`${args[1]}px`);
            setOpacity(1);
            break;
          case "collapseErrorPage":
            if (iframe.current.clientHeight > window.innerHeight) {
              setHeight(`${args[1]}px`);
            }
            break;
          case "reloadPage":
            window.location.reload();
            break;
        }
        const isDoFlo = e.origin.indexOf("doflo") > -1;
        if (
          isDoFlo &&
          iframe.current &&
          "contentWindow" in iframe.current &&
          "postMessage" in iframe.current.contentWindow!
        ) {
          const urls = {
            docurl: encodeURIComponent(window.document.URL),
            referrer: encodeURIComponent(window.document.referrer),
          };
          iframe.current.contentWindow.postMessage(
            JSON.stringify({ type: "urls", value: urls }),
            "*"
          );
        }
      }
    },
    []
  );

  useEffect(() => {
    if (iframe.current && !srcModified) {
      setSrcModified(true);
      var _src = src;
      var iframeParams = [] as Array<string>;
      if (window.location.href && window.location.href.indexOf("?") > -1) {
        iframeParams = iframeParams.concat(
          window.location.href.split("?")[1].split("&")
        );
      }
      if (_src && _src.indexOf("?") > -1) {
        const _srcAr = _src.split("?");
        iframeParams = iframeParams.concat(_srcAr[1].split("&"));
        _src = _srcAr[0];
      }
      iframeParams.push("dfeVer=v[VI]{version}[/VI]");
      setSrc(_src + "?" + iframeParams.join("&"));
    }

    if (window.addEventListener && !added) {
      setAdded(true);
      window.addEventListener("message", handleIframeMessage, false);
    } else if (
      (window as unknown as { attachEvent: (name: string, e: any) => void })
        .attachEvent &&
      !added
    ) {
      setAdded(true);
      (
        window as unknown as { attachEvent: (name: string, e: any) => void }
      ).attachEvent("onmessage", handleIframeMessage);
    }
    return () => {
      if (window.removeEventListener && added) {
        setAdded(false);
        window.removeEventListener("message", handleIframeMessage, false);
      } else if (
        (window as unknown as { detachEvent: (name: string, e: any) => void })
          .detachEvent &&
        added
      ) {
        setAdded(false);
        (
          window as unknown as { detachEvent: (name: string, e: any) => void }
        ).detachEvent("onmessage", handleIframeMessage);
      }
    };
  });

  return (
    <iframe
      ref={iframe}
      style={{
        height: height,
        transition: "opacity 0.3s linear",
        width: "100%",
        opacity: opacity,
      }}
      // allowTransparency={true}
      // allowfullscreen="true"
      className={props.className}
      allow="geolocation; microphone; camera"
      sandbox="allow-same-origin allow-scripts allow-modals allow-forms"
      src={src}
      frameBorder={0}
      scrolling={props.scrolling ? "yes" : "no"}
    />
  );
}
