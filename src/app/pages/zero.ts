import { faker } from "@faker-js/faker";

const ALLOWED_FAKER_MODULES = [
  "date",
  "number",
  "string",
  "airline",
  "animal",
  "book",
  "color",
  "commerce",
  "company",
  "database",
  "finance",
  "food",
  "git",
  "hacker",
  "image",
  "internet",
  "location",
  "lorem",
  "music",
  "person",
  "phone",
  "science",
  "system",
  "vehicle",
  "word",
];

const getFakerMethods = () => {
  const methods: string[] = [];

  ALLOWED_FAKER_MODULES.forEach((module) => {
    // @ts-expect-error:next-line
    const fakerModule = faker[module];

    if (typeof fakerModule === "object") {
      Object.keys(fakerModule).forEach((fn) => {
        if (typeof fakerModule[fn] === "function") {
          methods.push(`${module}.${fn}`);
        }
      });
    }
  });

  return methods;
};

console.log(getFakerMethods());
