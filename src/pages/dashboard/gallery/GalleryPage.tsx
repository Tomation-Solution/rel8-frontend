import EventGrid from "../../../components/grid/EventGrid";
import { useState } from "react";
import { useQuery } from "react-query";
import Toast from "../../../components/toast/Toast";
import { fetchAllGalleryData } from "../../../api/gallery/gallery-api";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";
import CircleLoader from "../../../components/loaders/CircleLoader";
import GalleryCard from "../../../components/cards/GalleryCard";
import SeeAll from "../../../components/SeeAll";
import QuickNav from "../../../components/navigation/QuickNav";

interface GalleryItem {
    id: number;
    title: string;
    imageUrl: string;
}

const GalleryPage = () => {
    const [page, setPage] = useState<number>(1);
    const { notifyUser } = Toast();
    const { data, isError, isLoading } = useQuery(["galleryData", page], () => fetchAllGalleryData(page), {
        keepPreviousData: true,
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    if (isLoading) {
        return <CircleLoader />;
    }

    if (isError) {
        notifyUser("An error occurred while trying to fetch gallery items", "error");
    }

    const totalPages = data?.data?.pages_number || 1;

    return (
        <main>
            <div className="md:grid md:grid-cols-4 gap-x-[50px] flex flex-col gap-10 px-2">
                <div className='col-span-3'>
                    <BreadCrumb title={"Albums"} />

                    <div className={`${isLoading && `place-items-center`} grid grid-cols-2 md:grid-cols-4 gap-2`}>
                        {isLoading && <CircleLoader />}

                        {data?.data?.data?.map((galleryItem: GalleryItem, index: number) => (
                            <GalleryCard key={index} galleryItem={galleryItem} />
                        ))}
                    </div>

                    <div className="flex justify-between mt-4 items-center">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 bg-[#0070f3] text-white rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>{page} of {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-[#0070f3] text-white rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
                <div className="col-span-1">
                    <SeeAll title='Highlights' path='/' />
                    <EventGrid heightOfCard={"h-[170px]"} numberOfItemsToShow={2} />
                    <QuickNav />
                </div>
            </div>
        </main>
    );
};

export default GalleryPage;
