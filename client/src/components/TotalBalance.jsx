import PropTypes from "prop-types";

const TotalBalance = ({ options, saldo }) => {
  return (
    <section className="total-balance">
      <h2 className="total-balance__title">Saldo actual</h2>
      <p
        className={`total-balance__result ${
          saldo < 0 && "total-balance__result--negative"
        }`}
      >
        <span className="total-balance__currency">$</span>
        <span className="total-balance__amount">{saldo}</span>
      </p>

      {options && (
        <div className="total-balance__options">
          <ul className="total-balance__options">
            {options.map((option, index) => (
              <li className="total-balance__option" key={index}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

TotalBalance.propTypes = {
  options: PropTypes.array,
  saldo: PropTypes.number,
};

export { TotalBalance };
