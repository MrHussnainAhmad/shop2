import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const bannerType = defineType({
  name: "banner",
  title: "Banner",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Banner Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Banner Description",
      type: "text",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
      description: "The URL where the banner should link to (e.g., https://example.com or /products/special-offer)",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "badge",
      title: "Discount Badge",
      type: "string",
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      description: "Amount of discount in percentage",
    }),
    defineField({
      name: "image",
      title: "Banner Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "imageUrl",
      title: "Banner Image URL",
      type: "url",
      description: "Alternative: Paste image URL instead of uploading",
      validation: (Rule) => Rule.uri({
        allowRelative: false,
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: "isMiniBanner",
      title: "Is Mini Banner?",
      type: "boolean",
      description: "Check this to display as mini banner instead of main banner",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      image: "image",
      imageUrl: "imageUrl",
      description: "description",
    },
    prepare(selection) {
      const { title, image, imageUrl, description } = selection;
      
      // Use the first available image (prioritize uploaded image over URL)
      let media = image;
      
      // If no uploaded image but we have an imageUrl, use that
      if (!media && imageUrl) {
        return {
          title: title || "Untitled Banner",
          subtitle: description || "Banner",
          media: () => `<img src="${imageUrl}" alt="${title || 'Banner'}" style="width: 100%; height: 100%; object-fit: cover;" />`,
        };
      }
      
      return {
        title: title || "Untitled Banner",
        subtitle: description || "Banner",
        media,
      };
    },
  },
});
