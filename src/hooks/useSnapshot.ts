// hooks/useSnapshot.ts
import { useRef } from "react";
import html2canvas from "html2canvas";

export const useSnapshot = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSnapshot = async (options?: { download?: boolean }) => {
    if (!containerRef.current) return null;

    const canvas = await html2canvas(containerRef.current, {
      backgroundColor: null,
      useCORS: true,
    });

    const dataUrl = canvas.toDataURL("image/png");

    if (options?.download) {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "snapshot.png";
      link.click();
    }

    return dataUrl;
  };

  return { containerRef, handleSnapshot };
};
