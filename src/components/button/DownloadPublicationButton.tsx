import { useState } from "react";
import { useQuery } from "react-query";
import { fetchFileForDownload } from "../../api/publications/publications-api";
import Toast from "../toast/Toast";

const { notifyUser } = Toast();

interface Props {
    fileUrl: string;
    fileName: string;
}

const DownloadPublicationButton = ({ fileUrl, fileName }: Props) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const { refetch, isLoading } = useQuery(
        'downloadFile',
        () => fetchFileForDownload(fileUrl),
        {
            enabled: false,
            onSuccess: (blob) => {
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);

                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
                setIsDownloading(false);
            },
            onError: (err) => {
                console.error('Download error: ', err);
                notifyUser(`Failed to download`, 'error');

                setIsDownloading(false);
            }
        }
    );

    const downloadPublication = () => {
        if (isLoading || isDownloading) {
            return;
        }

        setIsDownloading(true);
        refetch();
    }

    return (
        <div>
            <button className="px-3 w-[240px] my-4 py-2 bg-primary-blue text-white  border border-white h-[40px] rounded-md hover:bg-white hover:text-primary-blue  hover:border-primary-blue"
                onClick={downloadPublication}
                disabled={isLoading || isDownloading}
            >
                {isLoading || isDownloading ? 'Downloading...' : 'Download Publication'}
            </button>
        </div>
    )
}

export default DownloadPublicationButton;