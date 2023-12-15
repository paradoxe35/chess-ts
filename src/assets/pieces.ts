export default {
  black: import.meta.glob("./pieces/black/*.svg"),
  white: import.meta.glob("./pieces/white/*.svg"),
  resolve: (folder: string, file: string) => `./pieces/${folder}/${file}.svg`,
};
