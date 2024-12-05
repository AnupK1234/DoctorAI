const Contact = () => {
  return (
    <>
      <div className="flex justify-center">
        <div className="relative flex flex-col lg:flex-row w-full items-center justify-center bg-black">
          <div className="w-full max-w-[1112px] px-8 my-24 xl:px-0 lg:mx-auto absolute z-20 bottom-5 lg:bottom-auto lg:top-1/2 transform -translate-y-1/2">
            <div>
              <h1 className=" text-white  uppercase  leading-none  text-4xl  md:text-5xl  lg:text-7xl  tracking-[0.15em]  inline-block  lg:whitespace-pre-line">
                Contact Us
              </h1>
            </div>
          </div>
          <img
            width="400"
            className="relative ml-auto opacity-50 lg:opacity-100"
            src="https://cdn-icons-png.flaticon.com/512/8873/8873476.png"
          />
        </div>
      </div>
      <div className="w-full max-w-[1112px] px-8 my-24 xl:px-0 lg:mx-auto ">
        <div>
          <div className="bg-white p-8 rounded-lg border-2 border-lavender shadow-lg w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              Request a free DoctorAI for consultation:
            </h2>
            <form className="contact-form">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base font-bold mb-2"
                  htmlFor="first-name"
                >
                  Name
                </label>
                <div className="flex gap-4">
                  <input
                    className="text-sm shadow appearance-none border rounded-[20px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="firstName"
                    placeholder="First"
                    required=""
                    type="text"
                    name="firstName"
                  />
                  <input
                    className="text-sm shadow appearance-none border rounded-[20px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="lastName"
                    placeholder="Last"
                    required=""
                    type="text"
                    name="lastName"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base font-bold mb-2"
                  htmlFor="email"
                >
                  Company Email
                </label>
                <input
                  className="text-sm shadow appearance-none border rounded-[20px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  placeholder="email@example.com"
                  required=""
                  type="email"
                  name="email"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base font-bold mb-2"
                  htmlFor="company"
                >
                  Company
                </label>
                <input
                  className="text-sm shadow appearance-none border rounded-[20px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="company"
                  placeholder="Name"
                  required=""
                  type="text"
                  name="company"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base font-bold mb-2"
                  htmlFor="website"
                >
                  Company Website
                </label>
                <input
                  className="text-sm shadow appearance-none border rounded-[20px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="website"
                  placeholder="https://example.com"
                  required=""
                  type="text"
                  name="website"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base font-bold mb-2"
                  htmlFor="message"
                >
                  What brings you to reach out? - Tell us about what you’re
                  looking for.
                </label>
                <textarea
                  className="text-sm shadow appearance-none border rounded-[20px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="message"
                  name="message"
                  required=""
                  rows="4"
                ></textarea>
              </div>
              <div className="mt-12 mb-6">
                <button
                  className="flex uppercase font-bold  text-center items-center justify-center bg-black text-white text-xs sm:text-sm lg:text-lg leading-none tracking-[3.1px] lg:tracking-[4.75px] py-4 px-8 lg:px-11 rounded-[31px] contact-form-btn mx-auto"
                  aria-label="Submit"
                >
                  <span>Submit</span>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 10 11"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="ml-2"
                    alt="Go Arrow"
                  >
                    <g clipPath="url(#clip0_2080_1104)">
                      <path
                        d="M8.62208 9.90083L8.62208 1.64897L0.532606 1.64894"
                        stroke="#9183CA"
                        strokeWidth="1.36608"
                      ></path>
                      <rect
                        x="1.47559"
                        y="9.62427"
                        width="1.36496"
                        height="10.0621"
                        transform="rotate(-135 1.47559 9.62427)"
                        fill="#9183CA"
                      ></rect>
                    </g>
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-gray-500 text-center">
                This site is protected by reCAPTCHA and the Google&nbsp;
                <a
                  className="underline text-blue-500"
                  href="https://policies.google.com/privacy"
                >
                  Privacy Policy
                </a>{" "}
                and&nbsp;
                <a
                  className="underline text-blue-500"
                  href="https://policies.google.com/terms"
                >
                  Terms of Service
                </a>{" "}
                apply.
              </p>
            </form>
          </div>
        </div>
        <div className="mt-12 rounded-lg w-full max-w-3xl mx-auto border-2 border-lavender p-8">
          <h2 className="text-xl font-medium mb-6 text-center">
            Book an in-depth demo with our human team!
          </h2>
          <button
            className="flex uppercase font-bold  text-center items-center justify-center bg-black text-white text-xs sm:text-sm lg:text-lg leading-none tracking-[3.1px] lg:tracking-[4.75px] py-4 px-8 lg:px-11 rounded-[31px] calendly-btn mx-auto"
            aria-label="Book Demo"
          >
            <span>Book Demo</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 10 11"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="ml-2"
              alt="Go Arrow"
            >
              <g clipPath="url(#clip0_2080_1104)">
                <path
                  d="M8.62208 9.90083L8.62208 1.64897L0.532606 1.64894"
                  stroke="#9183CA"
                  strokeWidth="1.36608"
                ></path>
                <rect
                  x="1.47559"
                  y="9.62427"
                  width="1.36496"
                  height="10.0621"
                  transform="rotate(-135 1.47559 9.62427)"
                  fill="#9183CA"
                ></rect>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Contact;
