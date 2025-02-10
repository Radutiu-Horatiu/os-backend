export const pointsArray = (n: number): number[] => {
  const arr = [0, 100, 200];
  for (let i = 3; i < n; i++) arr.push(arr[i - 1] + arr[i - 2] + arr[i - 3]);

  return arr;
};
