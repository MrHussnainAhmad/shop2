import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const brandType = defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Brand Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Brand Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "logoUrl",
      title: "Brand Logo URL",
      type: "url",
      description: "Alternative: Paste logo URL instead of uploading",
      validation: (Rule) => Rule.uri({
        allowRelative: false,
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured Brand",
      type: "boolean",
      initialValue: false,
      description: "Show this brand on the homepage",
    }),
  ],
  preview: {
    select: {
      title: "name",
      logo: "logo",
      logoUrl: "logoUrl",
      featured: "featured",
    },
    prepare(selection) {
      const { title, logo, logoUrl, featured } = selection;
      
      // Use the first available logo (prioritize uploaded logo over URL)
      let media = logo;
      
      // If no uploaded logo but we have a logoUrl, use that
      if (!media && logoUrl) {
        return {
          title,
          subtitle: featured ? "Featured Brand" : "Brand",
          media: () => `<img src="${logoUrl}" alt="${title} logo" style="width: 100%; height: 100%; object-fit: cover;" />`,
        };
      }
      
      return {
        title,
        subtitle: featured ? "Featured Brand" : "Brand",
        media,
      };
    },
  },
});
