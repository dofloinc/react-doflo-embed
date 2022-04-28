import React, { useCallback, useRef, useEffect, useState } from "react";
export default function DoFloEmbed(props) {
    var iframe = useRef(null);
    var queue = useRef([]);
    var _a = useState(false), added = _a[0], setAdded = _a[1];
    var _b = useState(props.src), src = _b[0], setSrc = _b[1];
    var _c = useState(false), srcModified = _c[0], setSrcModified = _c[1];
    var _d = useState("300px"), height = _d[0], setHeight = _d[1];
    var _e = useState(0.01), opacity = _e[0], setOpacity = _e[1];
    useEffect(function () {
        if (iframe.current && queue.current.length > 0) {
            queue.current.forEach(function (d) {
                handleIframeMessage(d);
            });
            queue.current = [];
        }
    }, [iframe.current]);
    var handleIframeMessage = useCallback(function (e) {
        if (!e.data.split) {
            return;
        }
        var args = e.data.split(":");
        var embedId = args[2];
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
                    setHeight("".concat(args[1], "px"));
                    setOpacity(1);
                    break;
                case "collapseErrorPage":
                    if (iframe.current.clientHeight > window.innerHeight) {
                        setHeight("".concat(args[1], "px"));
                    }
                    break;
                case "reloadPage":
                    window.location.reload();
                    break;
            }
            var isDoFlo = e.origin.indexOf("doflo") > -1;
            if (isDoFlo &&
                iframe.current &&
                "contentWindow" in iframe.current &&
                "postMessage" in iframe.current.contentWindow) {
                var urls = {
                    docurl: encodeURIComponent(window.document.URL),
                    referrer: encodeURIComponent(window.document.referrer)
                };
                iframe.current.contentWindow.postMessage(JSON.stringify({ type: "urls", value: urls }), "*");
            }
        }
    }, []);
    useEffect(function () {
        if (iframe.current && !srcModified) {
            setSrcModified(true);
            var _src = src;
            var iframeParams = [];
            if (window.location.href && window.location.href.indexOf("?") > -1) {
                iframeParams = iframeParams.concat(window.location.href.split("?")[1].split("&"));
            }
            if (_src && _src.indexOf("?") > -1) {
                var _srcAr = _src.split("?");
                iframeParams = iframeParams.concat(_srcAr[1].split("&"));
                _src = _srcAr[0];
            }
            iframeParams.push("isIframeEmbed=1");
            setSrc(_src + "?" + iframeParams.join("&"));
        }
        if (window.addEventListener && !added) {
            setAdded(true);
            window.addEventListener("message", handleIframeMessage, false);
        }
        else if (window
            .attachEvent &&
            !added) {
            setAdded(true);
            window.attachEvent("onmessage", handleIframeMessage);
        }
        return function () {
            if (window.removeEventListener && added) {
                setAdded(false);
                window.removeEventListener("message", handleIframeMessage, false);
            }
            else if (window
                .detachEvent &&
                added) {
                setAdded(false);
                window.detachEvent("onmessage", handleIframeMessage);
            }
        };
    });
    return (React.createElement("iframe", { ref: iframe, style: {
            height: height,
            transition: "opacity 0.3s linear",
            width: "100%",
            opacity: opacity
        }, 
        // allowTransparency={true}
        // allowfullscreen="true"
        className: props.className, allow: "geolocation; microphone; camera", sandbox: "allow-same-origin allow-scripts allow-modals allow-forms", src: src, frameBorder: 0, scrolling: props.scrolling ? "yes" : "no" }));
}
//# sourceMappingURL=react-doflo-embed.js.map