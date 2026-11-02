"use client";

import { useEffect } from "react";
import { captureAcquisition } from "@/lib/acquisition";

// Records where this visitor came from on their first page load (see
// lib/acquisition.ts). Renders nothing.
export default function AcquisitionCapture() {
  useEffect(() => {
    captureAcquisition();
  }, []);
  return null;
}
