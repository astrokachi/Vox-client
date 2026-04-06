import React from "react";
import "../styles/components/button.scss";
const xIcon = "/x.svg";
import Spinner from "./spinner";

interface ButtonProps {   
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  withIcon?: boolean;
  isLoading?: boolean;
}

const Button = ({
  children,
  onClick,
  disabled,
  withIcon,
  isLoading,
}: ButtonProps) => {
  return (
    <button className="btn-con" onClick={onClick} disabled={disabled}>
      {withIcon && <img src={xIcon} width={12} />}
      <span className={`login-btn`}>{isLoading ? <Spinner /> : children}</span>
    </button>
  );
};

export default Button;
