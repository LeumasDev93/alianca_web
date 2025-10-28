/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { getSession, signIn } from "next-auth/react";

export default function SessionRefresher() {
  useEffect(() => {
    let isMounted = true;

    const refreshIfNeeded = async () => {
      try {
        const session = await getSession();
        if (!isMounted) return;

        if (session) {
          const currentTime = Math.floor(Date.now() / 1000);
          const tokenExpiry =
            (session.user as { tokenExpiry?: number } | undefined)
              ?.tokenExpiry ?? 0;

          if (tokenExpiry && tokenExpiry <= currentTime) {
            await signIn("credentials", { redirect: false });
          }
        }
      } catch {
        // ignore errors to avoid impacting UI
      }
    };

    refreshIfNeeded();

    const intervalId = setInterval(refreshIfNeeded, 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return null;
}
