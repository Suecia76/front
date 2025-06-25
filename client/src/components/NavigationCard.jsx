import PropTypes from "prop-types";
import { motion } from "motion/react";

const NavigationCard = ({ label, img, link}) => {
  return (
    <>
    <motion.div
      initial={{ opacity: .5 }}
      whileInView={{ opacity: 1 }}
    />
      <a className="card-menu" href={link}>
        <img className="navigationCard-img" src={img} alt={label} />
        <span className="navigationCard-label">{label}</span>
      </a>
    </>

  );
};

NavigationCard.propTypes = {
  label: PropTypes.string,
  img: PropTypes.string,
  link: PropTypes.string,
};

export { NavigationCard };
