import { Link } from "react-router-dom";
import BreadCrumb from "../../../components/breadcrumb/BreadCrumb";

const ElectionStepsPage = () => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-4 space-x-[50px] text-textColor ">
      <div className="col-span-2 pr-4">
        <section className="flex flex-col justify-between gap-20">
          <div>
            <BreadCrumb title="Elections ~ Step 1/4" />
            <div className="grid gap-2">
              <Link
                to=""
                className="p-3 bg-neutral3 text-textColor rounded-md "
              >
                Set Up Election
              </Link>
              <Link
                to=""
                className="p-3 bg-neutral3 text-textColor rounded-md "
              >
                See Election Result
              </Link>
            </div>
          </div>
          <div>
            <BreadCrumb title="Step 2/4" />
            <form action="" className="flex flex-col gap-3">
              <div>
                <label htmlFor="" className="text-xs">
                  Election Theme
                </label>
                <input
                  type="text"
                  placeholder="input"
                  className="auth-form-input py-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="" className="text-xs">
                    Set Election Start Date
                  </label>
                  <input
                    type="date"
                    placeholder="15th Sep"
                    className="auth-form-input py-3"
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Set Election Stop Date
                  </label>
                  <input
                    type="date"
                    placeholder="15th Sep"
                    className="auth-form-input py-3"
                  />
                </div>
              </div>
              {/* Set Election Start Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="" className="text-xs">
                    Set Election Start Time
                  </label>
                  <input
                    type="time"
                    placeholder="8:00pm"
                    className="auth-form-input py-3"
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Set Election Stop Time
                  </label>
                  <input
                    type="time"
                    placeholder="15th Sep"
                    className="auth-form-input py-3"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="" className="text-xs">
                  Election Instructions
                </label>
                <textarea
                  placeholder="message"
                  className="rounded-md h-[120px] px-3 outline-none bg-neutral3 py-3"
                />
              </div>
            </form>
          </div>
        </section>
        <section></section>
      </div>
      <div className="col-span-2 pl-4">
        <section className="flex flex-col justify-between gap-20">
          <div>
            <BreadCrumb title="Step 3/4" />
            <div className="grid gap-2">
              <Link
                to=""
                className="p-3 bg-white text-textColor rounded-md border rounded-md"
              >
                <span>Add available position for the election</span>
              </Link>
              <Link
                to=""
                className="p-3 border bg-white text-textColor rounded-md "
              >
                <span>Add Aspirants for available positions</span>
              </Link>
            </div>
          </div>
          <div>
            <BreadCrumb title="Step 4/4" />
            <div className="grid gap-2">
              <Link
                to=""
                className="p-3 flex items-center justify-between bg-white text-textColor rounded-md border"
              >
                <span>President</span>
                <button className="text-white bg-primaryBlue p-2 rounded-md">
                  Add Participant
                </button>
              </Link>
              <Link
                to=""
                className="p-3 flex items-center justify-between bg-white text-textColor rounded-md border"
              >
                <span>Vice President</span>
                <button className="text-white bg-primaryBlue p-2 rounded-md">
                  Add Participant
                </button>
              </Link>
              <Link
                to=""
                className="p-3 flex items-center justify-between bg-white text-textColor rounded-md border"
              >
                <span>Secretary</span>
                <button className="text-white bg-primaryBlue p-2 rounded-md">
                  Add Participant
                </button>
              </Link>
              <Link
                to=""
                className="p-3 flex items-center justify-between bg-white text-textColor rounded-md border"
              >
                <span>Admin</span>
                <button className="text-white bg-primaryBlue p-2 rounded-md">
                  Add Participant
                </button>
              </Link>
              <Link
                to=""
                className="p-3 flex items-center justify-between bg-white text-textColor rounded-md border"
              >
                <span>Admin</span>
                <button className="text-white bg-primaryBlue p-2 rounded-md">
                  Add Participant
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ElectionStepsPage;
