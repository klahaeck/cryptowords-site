const Next = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`fs-4 text-dark ${className}`}
      style={{ ...style }}
      onClick={onClick}
    ><i className="bi bi-chevron-double-right"></i></div>
  );
};

const Prev = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`fs-4 text-dark ${className}`}
      style={{ ...style }}
      onClick={onClick}
    ><i className="bi bi-chevron-double-left"></i></div>
  );
};

export { Next, Prev };