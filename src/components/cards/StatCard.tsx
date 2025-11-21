import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => (
  <div className="bg-white p-6 rounded-lg border-b border-gray-200 h-full">
    <div className="flex flex-col justify-start gap-2">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <div className="flex justify-between items-center w-full">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <button className="hover:bg-gray-100 p-1 rounded-sm text-gray-400">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_140_9001)">
              <path
                d="M15.4167 7.99999C15.4167 9.31854 15.0257 10.6075 14.2931 11.7038C13.5606 12.8001 12.5194 13.6546 11.3012 14.1592C10.0831 14.6638 8.74262 14.7958 7.44941 14.5386C6.1562 14.2813 4.96832 13.6464 4.03597 12.714C3.10362 11.7817 2.46868 10.5938 2.21144 9.3006C1.95421 8.00739 2.08623 6.66695 2.59082 5.44877C3.0954 4.2306 3.94988 3.18941 5.04621 2.45686C6.14254 1.72432 7.43147 1.33333 8.75001 1.33333M15.4167 1.33333L8.75001 7.99999M15.4167 1.33333H11.4167M15.4167 1.33333V5.33333"
                stroke="#667185"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_140_9001">
                <rect
                  width="16"
                  height="16"
                  fill="white"
                  transform="translate(0.75)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

export default StatCard;