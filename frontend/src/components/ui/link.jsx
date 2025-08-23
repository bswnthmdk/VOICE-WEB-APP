import { Link as RouterLink } from "react-router-dom";
import { forwardRef } from "react";

const Link = forwardRef(({ href, children, ...props }, ref) => {
  return (
    <RouterLink ref={ref} to={href} {...props}>
      {children}
    </RouterLink>
  );
});

Link.displayName = "Link";

export default Link;
