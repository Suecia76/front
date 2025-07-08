import PropTypes from "prop-types";
import { forwardRef } from "react";

const Textarea = forwardRef(
  ({ label, maxLength = 100, name, placeholder, content ="", ...moreProps}, 
    ref
  ) => {
    return (
      <div className="input-group">
        {label && <label htmlFor={name}>{label}</label>}

        <textarea
          ref={ref}
          id={name}
          name={name}
          maxLength={maxLength}
          placeholder={placeholder}
          className="textareaField"
          {...moreProps}
          defaultValue={content.length > 0 && (content)}
        ></textarea>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";


Textarea.propTypes = {
  label: PropTypes.string,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  content: PropTypes.string
};

export { Textarea };
