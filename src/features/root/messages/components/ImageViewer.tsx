import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { saveAs } from 'file-saver';

interface ImageViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  imageAlt?: string;
  fileName?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  open,
  onOpenChange,
  imageUrl,
  imageAlt = 'Image',
  fileName
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      saveAs(blob, fileName || 'image.jpg');
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  // Reset zoom and rotation when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setScale(1);
      setRotation(0);
    }
    onOpenChange(open);
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-[95vw] w-auto" onInteractOutside={e => e.preventDefault()}>
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-2 top-2 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Image container */}
          <div className="relative overflow-hidden max-h-[85vh] max-w-[95vw] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="max-h-[85vh] max-w-[95vw] object-contain"
              style={{ 
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-in-out'
              }}
            />
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 text-white rounded-full px-4 py-2">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-full hover:bg-black/30 focus:outline-none transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-full hover:bg-black/30 focus:outline-none transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 rounded-full hover:bg-black/30 focus:outline-none transition-colors"
              aria-label="Rotate"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-full hover:bg-black/30 focus:outline-none transition-colors"
              aria-label="Download"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer; 