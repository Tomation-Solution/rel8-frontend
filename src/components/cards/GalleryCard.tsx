import { Link } from "react-router-dom";

interface Props {
  galleryItem: any;
  height?: string;
}

const GalleryCard = ({ galleryItem, height }: Props) => {
  if (!galleryItem) {
    return null;
  }

  return (
    <div className={`relative w-full border rounded-md  ${height ? height : 'h-[250px]'}  my-2`}>
      <div
        className=" z-[-1] bg-black flex items-center justify-center absolute rounded-xl top-0 left-0 bottom-0 right-0 w-full max-w-full h-full object-cover max-h-[inherit]"
      >

      <img
        src={galleryItem.images && galleryItem.images.length > 0
          ? galleryItem.images[0].url
          : galleryItem.imageUrl && galleryItem.imageUrl.length > 0
            ? galleryItem.imageUrl[0]
            : ''}
        className="w-full object-contain max-h-[inherit]"
        alt="gallery-image"
        />
        </div>

      <div className="w-full absolute bottom-0 flex items-center justify-between rounded-b-xl gap-3 z-[3] px-5 py-2 text-sm text-white bg-org-primary">
        <div className="">
          <Link to={`/gallery/${galleryItem._id}/`}>
          <p className="line-clamp-2 text-white font-medium text-sm">
            {galleryItem.caption}
          </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
