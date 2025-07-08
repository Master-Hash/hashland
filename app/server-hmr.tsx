"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router";

/**
 * @link https://github.com/hi-ogawa/vite-plugins/blob/main/packages/rsc/examples/react-router/react-router-vite/server-hmr.tsx
 */
export function ServerHmr() {
  if (import.meta.hot) {
    const navigate = useNavigate();
    useEffect(() => {
      const refetch = () =>
        navigate(window.location.pathname, { replace: true });
      import.meta.hot!.on("rsc:update", refetch);
      return () => {
        import.meta.hot!.off("rsc:update", refetch);
      };
    }, [navigate]);
  }
  return null;
}
