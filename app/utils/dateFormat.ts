export const dateFormat = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "long",
  timeStyle: "long",
  // Todo
  // timeZone: "UTC",
});

export const dateFormatShanghai = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "long",
  timeStyle: "long",
  // Todo
  timeZone: "Asia/Shanghai",
});
