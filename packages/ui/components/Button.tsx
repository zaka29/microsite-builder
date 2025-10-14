import React from "react";
import clsx from "clsx";

type ButtonProps = React.ComponentProps<"button"> & {
  variant: "primary" | "secondary";
};

export const Button = ({
  children,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const base = "rounded-lg px-4 py-2 font-semibold transition";
  const styles = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };
  return (
    <button className={clsx(base, styles[variant])} {...props}>
      {children}
    </button>
  );
};
