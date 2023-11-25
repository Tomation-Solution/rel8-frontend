import { Hourglass } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex w-full h-screen items-center justify-center">
      <Hourglass
        visible={true}
        height="100"
        width="100"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={["#015595", "#72a1ed"]}
      />
      ;
    </div>
  );
};

export default Loader;
