import React from 'react';

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative max-w-4xl max-h-full p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-white text-2xl hover:text-gray-300"
        >
          ×
        </button>

        {/* Previous button */}
        {images.length > 1 && (
          <button
            onClick={onPrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10"
          >
            ‹
          </button>
        )}

        {/* Next button */}
        {images.length > 1 && (
          <button
            onClick={onNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white text-2xl hover:text-gray-300 z-10"
          >
            ›
          </button>
        )}

        {/* Image */}
        <img
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;