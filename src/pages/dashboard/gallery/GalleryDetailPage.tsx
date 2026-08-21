import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FiImage } from "react-icons/fi";

import { fetchGalleryItem } from "../../../api/gallery/gallery-api";
import { BackLink, Button, EmptyState, PageHeader } from "../../../components/ui";
import ImageModal from "../../../components/ImageModal";
import CircleLoader from "../../../components/loaders/CircleLoader";
import { galleryImages } from "../content/contentFields";
import { formatDate } from "../../../utils/dates";

const GalleryDetailPage = () => {
  const { galleryId } = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState({ isOpen: false, currentIndex: 0 });

  const { data, isLoading, isError } = useQuery(["galleryItem", galleryId], () => fetchGalleryItem(galleryId ?? null), { enabled: !!galleryId });

  // `images: [{url, caption}]` is the current shape; `imageUrl: [String]` is the legacy one
  // the controller still normalises alongside it. `galleryImages()` reads both.
  const images = useMemo(() => galleryImages(data), [data]);

  if (isLoading) {
    return (
      <div className="py-20 grid place-items-center">
        <CircleLoader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <>
        <BackLink to="/gallery" label="Go back" />
        <PageHeader title="Gallery" />
        <EmptyState icon={FiImage} title="Album not found" description="It may have been removed." action={<Button onClick={() => navigate("/gallery")}>Back to gallery</Button>} />
      </>
    );
  }

  return (
    <>
      <BackLink to="/gallery" label="Go back" />
      <PageHeader title={data.caption || "Gallery"} subtitle={`${images.length} photo${images.length === 1 ? "" : "s"} · ${formatDate(data.createdAt)}`} />

      {images.length === 0 ? (
        <EmptyState icon={FiImage} title="No photos in this album" description="Nothing has been uploaded here yet." />
      ) : (
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <button key={`${image.url}-${index}`} type="button" onClick={() => setModal({ isOpen: true, currentIndex: index })} className="group text-left rounded-xl overflow-hidden border border-hairline hover:border-org-primary/40 transition-colors">
              <span className="relative block">
                <img src={image.url} alt={image.caption || `Photo ${index + 1}`} className="w-full h-48 object-cover" />
                <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/25 transition-colors grid place-items-center">
                  <span className="text-white text-sm opacity-0 group-hover:opacity-100">View</span>
                </span>
              </span>
              <span className="block bg-org-tint px-3 py-2 text-sm text-org-primary text-center truncate">{image.caption || `Photo ${index + 1}`}</span>
            </button>
          ))}
        </div>
      )}

      <ImageModal
        images={images.map(image => image.url)}
        captions={images.map(image => image.caption || "")}
        currentIndex={modal.currentIndex}
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, currentIndex: 0 })}
        onNext={() => setModal(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % images.length }))}
        onPrev={() => setModal(prev => ({ ...prev, currentIndex: prev.currentIndex === 0 ? images.length - 1 : prev.currentIndex - 1 }))}
      />
    </>
  );
};

export default GalleryDetailPage;
