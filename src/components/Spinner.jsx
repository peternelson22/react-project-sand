import spinner from "../assets/spinner.svg";
const Spinner = () => {
  return (
    <div className="bg-black bg-opacity-60 flex items-center justify-center fixed left-0 right-0 bottom-0 top-0 z-50">
      <div>
        <img src={spinner} alt="Loading..." className="h-26" />
      </div>
    </div>
  );
};
export default Spinner;
