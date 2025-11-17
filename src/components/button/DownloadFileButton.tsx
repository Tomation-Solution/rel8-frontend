import { useState } from "react";
import { useQuery } from "react-query";
import { fetchFileForDownload } from "../../api/baseApi";
import Toast from "../toast/Toast";

const { notifyUser } = Toast();

interface Props {
    fileUrl?: string;
    fileUrls?: string[];
    fileName?: string;
    fileNames?: string[];
    buttonText: string;
}

const DownloadFileButton = ({ fileUrl, fileUrls, fileName, fileNames, buttonText }: Props) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadSingleFile = async (url: string, name: string) => {
        try {
            const blob = await fetchFileForDownload(url);
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', name);

            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Download error: ', err);
            notifyUser(`Failed to download ${name}`, 'error');
        }
    };

    const downloadFile = async () => {
        if (isDownloading) {
            return;
        }

        setIsDownloading(true);

        try {
            if (fileUrls && fileUrls.length > 0) {
                // Download multiple files
                for (let i = 0; i < fileUrls.length; i++) {
                    const name = fileNames ? fileNames[i] : `attachment_${i + 1}`;
                    await downloadSingleFile(fileUrls[i], name);
                }
            } else if (fileUrl && fileName) {
                // Download single file
                await downloadSingleFile(fileUrl, fileName);
            }
        } catch (err) {
            console.error('Download error: ', err);
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div>
            <button className="px-3 w-[240px] my-4 py-2 bg-org-primary text-white  border border-white h-[40px] rounded-md hover:bg-org-secondary hover:text-org-primary  hover:border-org-primary"
                onClick={downloadFile}
                disabled={isDownloading}
            >
                {isDownloading ? 'Downloading...' : `Download ${buttonText}`}
            </button>
        </div>
    )
}

export default DownloadFileButton;