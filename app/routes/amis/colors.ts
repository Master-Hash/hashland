import { flavors } from "@catppuccin/palette";

export const colors = {
  latte: flavors.latte.colorEntries
    .map(([colorName, { hex }]) => parseInt(hex.slice(1), 16))
    .slice(1, 13),
  frappe: flavors.frappe.colorEntries
    .map(([colorName, { hex }]) => parseInt(hex.slice(1), 16))
    .slice(1, 13),
};
