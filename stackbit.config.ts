import { defineStackbitConfig } from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["src/content"],
      models: [
        {
          type: "page",
          name: "AcademicPage",
          label: "Academic Page",
          urlPath: "/academics/{slug}",
          filePath: "src/content/academics/{slug}.mdx",
          fields: [
            {
              type: "string",
              name: "title",
              label: "Title",
              required: true
            },
            {
              type: "string",
              name: "subtitle",
              label: "Subtitle"
            },
            {
              type: "string",
              name: "description",
              label: "Description",
              multiline: true
            },
            {
              type: "object",
              name: "image",
              label: "Featured Image",
              fields: [
                {
                  type: "image",
                  name: "src",
                  label: "Image",
                  required: true
                },
                {
                  type: "string",
                  name: "alt",
                  label: "Alt Text",
                  required: true
                }
              ]
            },
            {
              type: "number",
              name: "order",
              label: "Display Order"
            },
            {
              type: "boolean",
              name: "featured",
              label: "Featured",
              default: true
            },
            {
              type: "markdown",
              name: "body",
              label: "Content",
              required: true
            }
          ]
        }
      ],
      assetsConfig: {
        referenceType: "relative",
        assetsDir: "src/content",
        uploadDir: "academics/images"
      }
    })
  ],
  // Add Stackbit-specific metadata
  ssgName: "astro",
  nodeVersion: "18",
  // Customize the sidebar
  sidebar: {
    collections: [
      {
        label: "Academic Pages",
        path: "src/content/academics",
        urlPath: "/academics",
        match: ["src/content/academics/**/*.mdx"]
      }
    ]
  }
}); 