import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Address",
  type: "document",
  icon: PinIcon,
  fields: [
        defineField({
      name: "email",
      title: "User Email",
      type: "string",
    }),
    defineField({
      name: "name",
      title: "Address Name",
      type: "string",
      description: "E.g., Home, Office, etc.",
      validation: (Rule) => Rule.required().max(50),
    }),
    defineField({
      name: "streetAddress",
      title: "Street Address",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "apartment",
      title: "Apartment/Suite/Unit",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State/Province",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "postalCode",
      title: "Postal/ZIP Code",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "United States",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isDefault",
      title: "Default Address",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      streetAddress: "streetAddress",
      city: "city",
      state: "state",
    },
    prepare(selection) {
      const { title, streetAddress, city, state } = selection;
      return {
        title,
        subtitle: `${streetAddress}, ${city}, ${state}`,
      };
    },
  },
});
