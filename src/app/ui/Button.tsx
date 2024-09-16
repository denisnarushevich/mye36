import clsx from "clsx";
import { ReactNode } from "react";

export type ButtonProps = {
  children: ReactNode;
  onClick?(): void;
  disabled?: boolean;
};

export function Button({ onClick, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx("btn no-animation", {
        "btn-disabled": disabled,
      })}
      onClick={!disabled ? onClick : void 0}
      {...props}
    />
  );
}
