import { useState, useCallback, useLayoutEffect, useEffect } from "react";

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height,
    }
}


export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}

export interface DimensionObject {
    width: number;
    height: number;
    top: number;
    left: number;
    x: number;
    y: number;
    right: number;
    bottom: number;
}

export type UseDimensionsHook<N extends HTMLElement> = [
    (node: N | null) => void,
    DimensionObject,
    HTMLElement
];

export interface UseDimensionsArgs {
    liveMeasure?: boolean;
    onMeasure?: (dimensions: DimensionObject) => void,
    deps?: Array<any>
}

function getDimensionObject<N extends HTMLElement = HTMLElement>(node: N): DimensionObject {

    const rect = node.getBoundingClientRect();

    if (!rect) {
        return null! as DimensionObject
    }

    return {
        width: rect.width,
        height: rect.height,
        top: "x" in rect ? rect.x : rect!.top,
        left: "y" in rect ? rect.y : rect!.left,
        x: "x" in rect ? rect.x : rect!.left,
        y: "y" in rect ? rect.y : rect!.top,
        right: rect!.right,
        bottom: rect!.bottom
    };

}

function useDimensions<N extends HTMLElement = HTMLElement>({
    liveMeasure = true,
    onMeasure = undefined,
    deps = [] as Array<any>
}: UseDimensionsArgs = {}): UseDimensionsHook<N> {
    const [dimensions, setDimensions] = useState({} as DimensionObject);
    const [node, setNode] = useState<N | null>();
    const ref = useCallback((node: any) => {
        setNode(node);
    }, []);

    useEffect(() => {
        if (node) {
            const measure = () =>
                window.requestAnimationFrame(() => {
                    const obj = getDimensionObject(node)
                    if (onMeasure) {
                        onMeasure(obj)
                    }
                    setDimensions(obj)
                })
            measure();

            if (liveMeasure) {
                window.addEventListener("resize", measure);
                window.addEventListener("scroll", measure);

                return () => {
                    window.removeEventListener("resize", measure);
                    window.removeEventListener("scroll", measure);
                };
            }
        }
    }, [node, ...deps]);

    return [ref, dimensions, node!];
}

export default useDimensions;