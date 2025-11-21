import { ReactNode } from "react";

export default function PageHeading({ children, noLine = false }: { children: ReactNode; noLine?: boolean }) {
  return (
    <div className={`flex justify-between pb-${noLine ? 0 : 7} ${noLine ? '' : ''}`}>
      {children}
    </div>
  );
}