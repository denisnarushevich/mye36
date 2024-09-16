import { Button, ButtonProps } from "@/app/ui/Button";

export function VisitOmeButton(props: Omit<ButtonProps, "children">) {
  return <Button {...props}>Apciemot Omi</Button>;
}
