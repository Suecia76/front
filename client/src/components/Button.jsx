import PropTypes from "prop-types";

const Button = ({ label, type = "", ...moreProps }) => {
  return <button type={type} {...moreProps}>{label}</button>;
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export { Button };
