import { FolderIcon , TagIcon} from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Category Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "imageUrl",
      title: "Category Image URL",
      type: "url",
      description: "Alternative: Paste image URL instead of uploading",
      validation: (Rule) => Rule.uri({
        allowRelative: false,
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: "parent",
      title: "Parent Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Select a parent category for subcategories",
    }),
    defineField({
      name: "featured",
      title: "Featured Category",
      type: "boolean",
      initialValue: false,
      description: "Show this category on the homepage",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "parent.name",
      image: "image",
      imageUrl: "imageUrl",
    },
    prepare(selection) {
      const { title, subtitle, image, imageUrl } = selection;
      
      // Use the first available image (prioritize uploaded image over URL)
      let media = image;
      
      // If no uploaded image but we have an imageUrl, use that
      if (!media && imageUrl) {
        return {
          title,
          subtitle: subtitle ? `Parent: ${subtitle}` : "Top Level Category",
          media: () => `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;" />`,
        };
      }
      
      return {
        title,
        subtitle: subtitle ? `Parent: ${subtitle}` : "Top Level Category",
        media,
      };
    },
  },
});
