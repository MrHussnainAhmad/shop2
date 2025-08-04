import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
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
      rows: 4,
    }),
    defineField({
      name: "originalPrice",
      title: "Original Price",
      type: "number",
      description: "Base price before any discounts",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "discount",
      title: "Discount Percentage",
      type: "number",
      description:
        "Discount percentage (0-100). Final price will be calculated automatically.",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 0,
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
        {
          type: "object",
          name: "imageUrl",
          title: "Image URL",
          fields: [
            {
              name: "url",
              title: "Image URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  allowRelative: false,
                  scheme: ["http", "https"],
                }),
            },
            {
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Alternative text for accessibility",
            },
          ],
          preview: {
            select: {
              imageUrl: "url",
              title: "alt",
            },
            prepare(selection) {
              const { imageUrl, title } = selection;
              return {
                title: title || "Image URL",
                subtitle: imageUrl,
                media: () =>
                  imageUrl
                    ? `<img src="${imageUrl}" alt="${title || "Preview"}" style="width: 100%; height: 100%; object-fit: cover;" />`
                    : undefined,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
    }),
    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: "status",
      title: "Product Status",
      type: "string",
      options: {
        list: [
          { title: "Hot", value: "Hot" },
          { title: "New", value: "New" },
          { title: "Sale", value: "Sale" },
          { title: "Ending", value: "Ending" },
          { title: "Last Piece", value: "Last Piece" },
          { title: "Out of Stock", value: "Out of Stock" },
        ],
      },
    }),
    defineField({
      name: "variant",
      title: "Product Variant",
      type: "string",
      description: "Enter product variant (e.g., size, color, style)",
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "customAttributes",
      title: "Custom Attributes",
      type: "array",
      description: "Add any custom product details with your own field names and values",
      of: [
        {
          type: "object",
          name: "customAttribute",
          title: "Custom Attribute",
          fields: [
            {
              name: "name",
              title: "Attribute Name",
              type: "string",
              description: "e.g., GPS, Dual Sim, Bluetooth Version, etc.",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "value",
              title: "Attribute Value",
              type: "string",
              description: "e.g., Yes, No, 5.0, 128GB, etc.",
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              name: "name",
              value: "value",
            },
            prepare(selection) {
              const { name, value } = selection;
              return {
                title: `${name}: ${value}`,
              };
            },
          },
        },
      ],
      options: {
        sortable: true,
      },
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "object",
      description: "Optional coupon code for additional discount on this product",
      fields: [
        {
          name: "code",
          title: "Coupon Code",
          type: "string",
          description: "e.g., SPRING45, WELCOME20, etc.",
          validation: (Rule) => Rule.custom((code) => {
            if (!code) return true; // Allow empty
            return /^[A-Z0-9]{3,20}$/.test(code) || "Coupon code must be 3-20 characters, uppercase letters and numbers only";
          }),
        },
        {
          name: "discount",
          title: "Discount Percentage",
          type: "number",
          description: "Additional discount percentage for this coupon (0-100)",
          validation: (Rule) => Rule.min(0).max(100),
        },
      ],
      preview: {
        select: {
          code: "code",
          discount: "discount",
        },
        prepare(selection) {
          const { code, discount } = selection;
          if (!code) return { title: "No coupon code" };
          return {
            title: `${code} - ${discount}% OFF`,
          };
        },
      },
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      originalPrice: "originalPrice",
      discount: "discount",
      image: "images.0",
      imageUrl: "images.0.url",
      featured: "featured",
    },
    prepare(selection) {
      const { title, originalPrice, discount, image, imageUrl, featured } = selection;
      const finalPrice =
        originalPrice && discount
          ? originalPrice - (originalPrice * discount) / 100
          : originalPrice;

      let priceText = "No price set";
      if (originalPrice) {
        if (discount && discount > 0) {
          priceText = `$${finalPrice.toFixed(2)} (${discount}% off $${originalPrice})`;
        } else {
          priceText = `$${originalPrice}`;
        }
      }

      const featuredText = featured ? "Featured" : "Not Featured";
      const subtitle = `${featuredText} - ${priceText}`;

      // Use the first available image (prioritize uploaded image over URL)
      let media = image;

      // If no uploaded image but we have an imageUrl, use that
      if (!media && imageUrl) {
        return {
          title,
          subtitle,
          media: () =>
            `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: 100%; object-fit: cover;" />`,
        };
      }

      return {
        title,
        subtitle,
        media,
      };
    },
  },
});
