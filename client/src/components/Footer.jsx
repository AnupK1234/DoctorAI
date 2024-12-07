import { svgBasePath } from "../utils/imgConfig";
const Footer = () => {
  return (
    <>
      <div className="w-full bg-price-gradient lg:h-[400px]">
        <div className="m-4 border-b-2 border-black flex flex-col lg:flex-row lg:justify-end">
          <div className="mb-[74px] flex flex-col-reverse lg:flex-col items-center lg:items-start text-center lg:text-left">
            <div>
              <p className="text-base font-medium mt-11 lg:mt-0">Follow us:</p>
              <div className="flex gap-5 mt-5">
                <a href="" target="_blank">
                  <img
                    width="30"
                    height="30"
                    className="relative"
                    src={`${svgBasePath}/facebook.svg`}
                    style={{ color: "transparent" }}
                  />
                </a>
                <a href="" target="_blank">
                  <img
                    alt="Instagram Logo"
                    loading="lazy"
                    width="30"
                    height="30"
                    className="relative"
                    src={`${svgBasePath}/instagram.svg`}
                    style={{ color: "transparent" }}
                  />
                </a>
                <a href="" target="_blank">
                  <img
                    alt="X Logo"
                    width="30"
                    height="30"
                    className="relative"
                    src={`${svgBasePath}/x.svg`}
                    style={{ color: "transparent" }}
                  />
                </a>
                <a href="">
                  <img
                    width="30"
                    height="30"
                    className="relative"
                    src={`${svgBasePath}/youtube.svg`}
                    style={{ color: "transparent" }}
                  />
                </a>
                <a href="" target="_blank">
                  <img
                    width="30"
                    height="30"
                    className="relative"
                    src={`${svgBasePath}/linkedin.svg`}
                    style={{ color: "transparent" }}
                  />
                </a>
              </div>
            </div>
            <div className="mt-16">
              <p className="text-base font-medium">
                Sign up for DoctorAi news:
              </p>
              <form className="w-[300px] mt-6 email-newsletter">
                <div className="flex">
                  <div className="relative w-full">
                    <input
                      id="email"
                      className=" block  p-2.5  w-full  h-[30px] text-sm  border-[1px] border-black rounded-[19px]"
                      placeholder="email@example.com"
                      required=""
                      type="email"
                    />
                    <button
                      type="submit"
                      className="absolute top-0 end-0 h-full text-sm font-medium"
                    >
                      <img
                        width="30"
                        height="30"
                        className="relative"
                        src={`${svgBasePath}/sign-up-arrow.svg`}
                        style={{ color: "transparent" }}
                      />
                      <span className="sr-only">Search</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center my-4 text-base text-center font-medium">
          <p>All Rights Reserved © Copyright DoctorAi</p>
          <span className="hidden md:block">&nbsp;|&nbsp;</span>
          <a className="underline" href="/privacy-policy/">
            Privacy Policy
          </a>
          <span className="hidden md:block">&nbsp;|&nbsp;</span>
          <a className="underline" href="/terms-of-service/">
            Terms of Service
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
