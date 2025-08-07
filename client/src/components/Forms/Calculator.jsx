import { useState } from "react";
import { Button } from "../Button";

const Calculator = ({ onResult }) => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleClick = (value) => {
    e.preventDefault();
    if (value === "C") {
      setExpression("");
      setResult("");
      setError("");
    } else if (value === "=") {
      try {
        const evalResult = eval(expression);
        if (!isNaN(evalResult)) {
          const fixed = evalResult.toFixed(2);
          setResult(fixed);
          setError("");
        } else {
          throw new Error();
        }
      } catch {
        setError("Expresión inválida");
        setResult("");
      }
    } else {
      setExpression((prev) => prev + value);
    }
  };

  return (
    <div className="quick-calculator">
      <input
        className="quick-calculator__display"
        value={expression}
        readOnly
      />

      <div className="quick-calculator__buttons">
        {[
          "7",
          "8",
          "9",
          "/",
          "4",
          "5",
          "6",
          "*",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          "C",
          "+",
        ].map((btn) => (
          <button key={btn} onClick={(e) => handleClick(btn)}>
            {btn}
          </button>
        ))}
        <button
          className="equal btn btn--outline"
          onClick={(e) => handleClick("=")}
        >
          =
        </button>
      </div>

      {error && <p className="quick-calculator__error">{error}</p>}

      {result && (
        <Button
          label="Usar resultado"
          onClick={() => {
            onResult?.(result);
          }}
          className="btn btn--filled-blue quick-calculator__btn"
        />
      )}
    </div>
  );
};

export { Calculator };
