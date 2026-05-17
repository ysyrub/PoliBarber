// asyncHandler evita repetir try/catch en cada controlador asincrono.
export const asyncHandler = (controller) => (req, res, next) => {
  Promise.resolve(controller(req, res, next)).catch(next);
};
