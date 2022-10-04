import React from "react";

function Button({
  text,
  type = "fill",
  customClass,
  onClick,
  bg = "bg-blue-500",
  hover = "bg-blue-400",
  color = "text-white",
  prefixIcon,
}) {
  const getClassNames = (type) => {
    switch (type) {
      case "fill":
        return `${bg} ${color} hover:${hover} shadow-lg shadow-${bg}`;

      case "outline":
        return `${color} text-blue border-2 border-${bg}`;

      case "text":
        return `${bg.replace("bg", "text")} hover:underline`;

      default:
        return `${bg} ${color} hover:${hover}`;
    }
  };

  return (
    <button
      type="submit"
      className={`${getClassNames(type)}
      inline-flex items-center justify-center gap-3 rounded-md px-4 py-2 w-full h-14 ${customClass}`}
      onClick={onClick}
    >
      {prefixIcon && prefixIcon}
      {text}
    </button>
  );
}

export default Button;
