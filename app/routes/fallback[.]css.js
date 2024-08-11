import style from "../main.css?url";

export const loader = () => {
  return Response.redirect(new URL(style, import.meta.env.VITE_SITEURL), 302);
};
