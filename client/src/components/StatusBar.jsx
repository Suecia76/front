import PropTypes, { string } from "prop-types";
import { Button } from "./Button";
import { IconButton } from "./Buttons/IconButton";
import { useNavigate } from "react-router-dom";

const StatusBar = ({ label }) => {
  const navigate = useNavigate();

  return (
    <div className="status-bar">
      <IconButton
        onClick={() => {
          navigate(-1);
        }}
        label="back button"
        icon="arrow-left"
        className="status-bar__btn"
      />
      {/* )} */}
      <h2 className="h6">{label}</h2>
    </div>
  );
};

StatusBar.propTypes = {
  label: PropTypes.string,
  backPageUrl: PropTypes.string,
};

export { StatusBar };
