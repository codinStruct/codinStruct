const request = require("supertest");
const app = require("./app");
const xmlParser = require("xml2json");
const fs = require("fs");

process.env.NODE_ENV = 'test';

let file_tree = [];

file_tree = xmlParser.toJson(
    fs.readFileSync("codinStruct-content/estrutura.xml"),
    {
        arrayNotation: ["language", "category", "page"],
        object: true,
    }
).main;

describe("OTHER routes", () => {
    describe("when page not found", () => {
        test("should return 404", async () => {
            const response = await request(app).get("/non/sense");

            expect(response.statusCode).toBe(404);
            expect(response.text).toEqual(expect.stringContaining("404"));
        });
    });

    describe("when asked for a content page", () => {
        test("should return the page", async () => {
            const response = await request(app).get("/conteudo/really/cool/page");

            expect(response.statusCode).toBe(200);
        });
    });
});

describe("API routes", () => {
    describe("when asked for sidebar file tree", () => {
        test("should return the file tree in json format", async () => {
            for (const lang of file_tree.language) {
                const path = lang.path;

                const response = await request(app).get("/api/sidebar/" + path);

                expect(response.statusCode).toBe(200);
                expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
                expect(response.body).toEqual(lang);
            }
        });
    });

    describe("when asked for the descriptions", () => {
        test("should return the descriptions in json format", async () => {
            const response = await request(app).get("/api/descriptions");

            expect(response.statusCode).toBe(200);
            expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    title: expect.any(String),
                    description: expect.any(String),
                    path: expect.any(String)
                })
            ]));
        });
    });

    describe("when asked for a content page", () => {
        for (const lang of file_tree.language) {
            describe("in language " + lang.path, () => {
                for (const cat of lang.category) {
                    describe("in category " + cat.path, () => {
                        for (const page of cat.page) {
                            test("page " + page.path + " should return the page", async () => {
                                const response = await request(app).get("/api/content/" + lang.path + "/" + cat.path + "/" + page.path);

                                expect(response.statusCode).toBe(200);
                            });
                        }
                    });
                }
            });
        }
    });
});