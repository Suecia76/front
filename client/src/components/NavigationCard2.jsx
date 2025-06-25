import PropTypes from "prop-types";

const NavigationCard2 = ({ label, img, link}) => {
  return (
    <a className="navigationCard2" href={link}>
        <img className="navigationCard2__image" src={img} alt={label} />
        <span className="navigationCard2__label">{label}</span>
    </a>
  );
};

NavigationCard2.propTypes = {
  label: PropTypes.string,
  img: PropTypes.string,
  link: PropTypes.string,
};

export { NavigationCard2 };
