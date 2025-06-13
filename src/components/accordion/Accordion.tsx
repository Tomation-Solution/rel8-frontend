import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Accordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="">
      <div className="bg-neutral-3">
        <div className=" rounded-md p-4">
          <div
            className="flex justify-between items-center cursor-pointer rounded-md"
            onClick={toggleAccordion}
          >
            <h2 className="text-sm font-light">Accordion Title</h2>
            {isOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
          </div>
          {isOpen && (
            <div className="mt-4">
              <p className="text-gray-700">
                This is the content of the accordion. You can put any content
                here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
