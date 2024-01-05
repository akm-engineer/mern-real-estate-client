import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

const AboutPage = () => {
  return (
    <div className="max-w-screen-md mx-auto  text-center">
      <div className="py-20 px-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-slate-800">
          About भारत Estate
        </h1>
        <p className="mb-4 text-slate-700">
          Bharat Estate is a leading real estate agency that specializes in
          helping clients buy, sell, and rent properties in the most desirable
          neighborhoods. Our team of experienced agents is dedicated to
          providing exceptional service and making the buying and selling
          process as smooth as possible.
        </p>
        <p className="mb-4 text-slate-700">
          Our mission is to help our clients achieve their real estate goals by
          providing expert advice, personalized service, and a deep
          understanding of the local market. Whether you are looking to buy,
          sell, or rent a property, we are here to help you every step of the
          way.
        </p>
        <p className=" text-slate-700">
          Our team of agents has a wealth of experience and knowledge in the
          real estate industry, and we are committed to providing the highest
          level of service to our clients. We believe that buying or selling a
          property should be an exciting and rewarding experience, and we are
          dedicated to making that a reality for each and every one of our
          clients.
        </p>
      </div>

      {/* LinkedIn and GitHub icons with animations */}
      <div className="flex justify-center  space-x-4 ">
        <a
          href="https://www.linkedin.com/in/akm-engineer/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slay-700 hover:text-blue-500 transition duration-300"
        >
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </a>
        <a
          href="https://github.com/akm-engineer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slay-700 hover:text-gray-500 transition duration-300"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
