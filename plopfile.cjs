module.exports = (plop) => {
  plop.setGenerator("ui", {
    description: "ui",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "ui name please",
      },
    ],
    actions: [
      {
        type: "add",
        path: "./src/{{pascalCase name}}/index.tsx",
        templateFile: "plop-templates/ui/index.tsx.hbs",
      },
      {
        type: "add",
        path: "./src/{{pascalCase name}}/index.module.css",
        templateFile: "plop-templates/ui/index.module.css.hbs",
      },
      {
        type: "add",
        path: "./src/{{pascalCase name}}/index.stories.tsx",
        templateFile: "plop-templates/ui/index.stories.tsx.hbs",
      },
    ],
  });
};
