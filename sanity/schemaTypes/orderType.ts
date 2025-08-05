import { BillIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const orderType = defineType({
  name: "order",
  title: "Order",
  type: "document",
  icon: BillIcon,
  fields: [
    defineField({
      name: "paymentIntentId",
      title: "Payment Intent ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "items",
      title: "Order Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "productId",
              title: "Product ID",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "name",
              title: "Product Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price at Purchase",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1).integer(),
            }),
          ],
          preview: {
            select: {
              title: "name",
              quantity: "quantity",
              price: "price",
            },
            prepare(selection) {
              const { title, quantity, price } = selection;
              return {
                title: title || "Product",
                subtitle: `${quantity} x $${price} = $${quantity * price}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "shippingCost",
      title: "Shipping Cost",
      type: "number",
      validation: (Rule) => Rule.min(0),
      initialValue: 0,
    }),
    defineField({
      name: "totalAmount",
      title: "Total Amount",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      validation: (Rule) => Rule.required(),
      initialValue: "USD",
    }),
    defineField({
      name: "status",
      title: "Order Status",
      type: "string",
      options: {
        list: [
          { title: "Paid", value: "paid" },
          { title: "Failed", value: "failed" },
          { title: "Canceled", value: "canceled" },
        ],
        layout: "radio",
      },
      initialValue: "paid",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      options: {
        list: [
          { title: "Succeeded", value: "succeeded" },
          { title: "Failed", value: "failed" },
          { title: "Canceled", value: "canceled" },
        ],
        layout: "radio",
      },
      initialValue: "succeeded",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "billingAddress",
      title: "Billing Address",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Name" },
        { name: "line1", type: "string", title: "Address Line 1" },
        { name: "line2", type: "string", title: "Address Line 2" },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "postal_code", type: "string", title: "Postal Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Name" },
        { name: "line1", type: "string", title: "Address Line 1" },
        { name: "line2", type: "string", title: "Address Line 2" },
        { name: "city", type: "string", title: "City" },
        { name: "state", type: "string", title: "State" },
        { name: "postal_code", type: "string", title: "Postal Code" },
        { name: "country", type: "string", title: "Country" },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: (new Date()).toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: (new Date()).toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "paymentIntentId",
      subtitle: "customerEmail",
      status: "status",
      date: "createdAt",
    },
    prepare(selection) {
      const { title, subtitle, status, date } = selection;
      const formattedDate = new Date(date).toLocaleDateString();
      return {
        title: `Order #${title}`,
        subtitle: `${subtitle} - ${status} - ${formattedDate}`,
      };
    },
  },
});
