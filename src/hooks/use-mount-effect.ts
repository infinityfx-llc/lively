import { useEffect, useLayoutEffect } from "react";

const useMountEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default useMountEffect;