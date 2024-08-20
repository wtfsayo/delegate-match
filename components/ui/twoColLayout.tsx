import { FC, ReactNode } from "react";

interface TwoColumnLayoutProps {
  col1: ReactNode;
  col2: ReactNode;
}

const TwoColumnLayout: FC<TwoColumnLayoutProps> = ({ col1, col2 }) => {
  return (
    <div className="container mx-auto p-4 ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg ">
          {col1}
        </div>
        <div className="rounded-lg h-full">
          {col2}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLayout;
