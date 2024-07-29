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

interface Link {
    label: number;
    active: boolean;
}

const GalleryPage = () => {
    const [page, setPage] = useState<number>(1);
    const { notifyUser } = Toast();
    const { data, isError, isLoading } = useQuery(["galleryData", page], () => fetchAllGalleryData(page), {
        keepPreviousData: true,
    });

    if (isLoading) {
        return <CircleLoader />;
    }

    if (isError) {
        notifyUser("An error occurred while trying to fetch gallery items", "error");
    }

    const handlePageClick = (label: number) => {
        setPage(label);
    };

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

                    <nav>
                        <ul className="flex justify-center gap-10 mt-4">
                            {data?.data?.links?.map((link: Link, index: number) => (
                                <li key={index} className={`mx-1 ${link.active ? 'font-bold' : ''}`}>
                                    <button onClick={() => handlePageClick(link.label)}>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
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
