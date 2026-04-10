import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    heroCaption: z.string().optional(),
    tags: z.array(z.string()).default([]),
    readTime: z.string().optional(),
    draft: z.boolean().default(false),
    resources: z
      .array(
        z.object({
          title: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    role: z.string(),
    duration: z.string().optional(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
  projects: projectsCollection,
};
