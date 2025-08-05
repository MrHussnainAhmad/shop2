import { defineField, defineType } from 'sanity'

export const userProfileType = defineType({
  name: 'userProfile',
  title: 'User Profile',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'Clerk user ID',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'preferences',
      title: 'Preferences',
      type: 'object',
      fields: [
        defineField({
          name: 'newsletter',
          title: 'Subscribe to Newsletter',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'notifications',
          title: 'Email Notifications',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      userId: 'userId',
    },
    prepare(selection) {
      const { firstName, lastName, userId } = selection
      const name = [firstName, lastName].filter(Boolean).join(' ')
      return {
        title: name || 'Unnamed User',
        subtitle: `User ID: ${userId}`,
      }
    },
  },
})
