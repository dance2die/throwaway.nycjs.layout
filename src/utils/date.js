const isSameDate = (d1, d2) => {
  if (!d1 || !d2) return false;
  return d1.toDateString() === d2.toDateString();
};

export { isSameDate };
