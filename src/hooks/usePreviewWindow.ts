import { useState, useCallback } from "react";

export function usePreviewWindow() {
  const [previewWindow, setPreviewWindow] = useState<Window | null>(null);

  const openPreview = useCallback((blobUrls?: string[]) => {
    // Salva os blob URLs no sessionStorage para o preview acessar
    if (blobUrls && blobUrls.length > 0) {
      sessionStorage.setItem('preview-evento-blobs', JSON.stringify(blobUrls));
    }
    
    // Verifica se a janela já existe e está aberta
    if (previewWindow && !previewWindow.closed) {
      // Se existe, apenas foca nela e força reload
      previewWindow.focus();
      previewWindow.location.reload();
    } else {
      // Se não existe ou foi fechada, abre uma nova
      const newWindow = window.open('/preview-evento', 'evento-preview');
      if (newWindow) {
        setPreviewWindow(newWindow);
        newWindow.focus();
      }
    }
  }, [previewWindow]);

  const closePreview = useCallback(() => {
    if (previewWindow && !previewWindow.closed) {
      previewWindow.close();
    }
    setPreviewWindow(null);
  }, [previewWindow]);

  return {
    previewWindow,
    openPreview,
    closePreview,
  };
}
