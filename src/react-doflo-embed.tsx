import React, {
  ReactDOM,
  useCallback,
  useRef,
  useEffect,
  useState,
} from "react";
import useDebouncedEffect from "./useDebouncedEffect";
export type DoFloEvent = {
  name: string;
  message: string;
  data: any;
};

export default function DoFloEmbed(props: {
  src: string;
  className?: string;
  minHeight?: number;
  scrolling?: boolean;
  onError?(error: Error): void;
  onEvent?(e: DoFloEvent): void;
}) {
  const iframe = useRef<null | HTMLIFrameElement>(null);
  const queue = useRef<Array<{ data: string; origin: string }>>([]);
  const minHeight = useRef(props.minHeight);
  const [added, setAdded] = useState(false);
  /**
   * Replace the other values incase someone uses the wrong version
   * in fact we are going encourage the usage of the named version
   *  */
  let queryAr = props.src.split("?");
  let pathAr = (
    queryAr[0].endsWith("/")
      ? queryAr[0].substring(0, queryAr[0].length - 1)
      : queryAr[0]
  ).split("/");
  let host = pathAr[2];
  let embedId = pathAr[pathAr.length - 1];
  let hosted = pathAr[pathAr.length - 2] === "w";
  let query = queryAr.length > 1 ? "?" + queryAr[1] : "";
  const [src, setSrc] = useState(
    `${pathAr[0]}//${host}/iframe/${hosted ? "w/" : ""}${embedId}/${query}`
  );
  const [srcModified, setSrcModified] = useState(false);
  const [height, setHeight] = useState("300px");
  // const [minHeight, setMinHeight] = useState<number | undefined>(
  //   props.minHeight
  // );
  const [opacity, setOpacity] = useState(0.01);
  const version =
    "v[VI]{version}[/VI]"; /* this is replaced by storybook during dev and rollup during build */

  const [style, setStyle] = useState({
    height: height,
    transition: "opacity 0.3s linear",
    width: "100%",
    opacity: opacity,
  });

  useEffect(() => {
    if (iframe.current && queue.current.length > 0) {
      queue.current.forEach((d) => {
        handleIframeMessage(d);
      });
      queue.current = [];
    }
  }, [iframe.current]);

  useEffect(() => {
    if (props.minHeight) {
      minHeight.current = props.minHeight;
    }
  }, [props.minHeight]);

  useDebouncedEffect(
    () => {
      if (minHeight.current) {
        if (props.onEvent) {
          props.onEvent({
            name: "MIN_HEIGHT_SET",
            message: "The minHeight value was updated " + minHeight.current,
          } as DoFloEvent);
        }
        setHeight(`${minHeight.current}px`);
      }
    },
    [minHeight.current],
    100
  );

  useEffect(() => {
    setStyle({
      height: height,
      transition: "opacity 0.3s linear",
      width: "100%",
      opacity: opacity,
    });

    if (props.onEvent)
      props.onEvent({
        name: "HEIGHT_CHANGE",
        message: `The form has requested to setHeight ${height} ${
          props.minHeight
            ? `there is a min height of ${props.minHeight}px`
            : minHeight.current
            ? `there is a min height of ${minHeight.current}px`
            : ""
        }`,
      } as DoFloEvent);
  }, [height, opacity]);

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
      if (args[0] === "setError") {
        if ((minHeight.current ? minHeight.current : 0) > parseInt(args[1])) {
          setHeight(`${minHeight.current}px`);
        } else {
          setHeight(`${args[1]}px`);
        }
        setOpacity(1);
        if (props.onError) {
          props.onError(
            new Error("Form Error: " + args[2] ? args[2] : undefined)
          );
        }
      } else if (iframe.current.src.split("?")[0].indexOf(embedId) > -1) {
        switch (args[0]) {
          case "scrollIntoView":
            iframe.current.scrollIntoView();
            if (props.onEvent)
              props.onEvent({
                name: "SCROLL_INTO_VIEW",
                message: "The form has requested to be scrolled into view",
              } as DoFloEvent);
            break;
          case "setHeight":
            if (
              (minHeight.current ? minHeight.current : 0) >= parseInt(args[1])
            ) {
              setHeight(`${minHeight.current}px`);
            } else {
              setHeight(`${args[1]}px`);
            }
            setOpacity(1);
            break;
          case "collapseErrorPage":
            if (iframe.current.clientHeight > window.innerHeight) {
              setHeight(`${args[1]}px`);
            }
            if (props.onEvent)
              props.onEvent({
                name: "COLLAPSE_ERROR",
                message: "The form has requested to collapse",
              } as DoFloEvent);
            break;
          case "reloadPage":
            window.location.reload();
            if (props.onEvent)
              props.onEvent({
                name: "RELOAD",
                message: "The form has requested to be reloaded",
              } as DoFloEvent);
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

      iframeParams.push(`dfeVer=${version}`);
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
      style={style}
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
