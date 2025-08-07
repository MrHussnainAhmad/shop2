
import { Webhook } from 'svix'
import { buffer } from 'micro'
import dbConnect from '../../../lib/db'
import UserProfile from '../../../models/UserProfile'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const svix_id = req.headers['svix-id']
  const svix_timestamp = req.headers['svix-timestamp']
  const svix_signature = req.headers['svix-signature']

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Error occured -- no svix headers' })
  }

  // Get the body
  const payload = (await buffer(req)).toString()
  const body = JSON.parse(payload)
  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return res.status(400).json({ 'Error': err })
  }

  const { id } = evt.data
  const eventType = evt.type

  console.log('Clerk Webhook Event:', eventType, evt.data);

  if (eventType === 'user.created') {
    await dbConnect()
    const { id, email_addresses, first_name, last_name } = evt.data
    console.log('Creating UserProfile for:', { clerkId: id, email: email_addresses[0].email_address, firstName: first_name, lastName: last_name });
    try {
      await UserProfile.create({
        clerkId: id,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
      })
      console.log('UserProfile created successfully for Clerk ID:', id);
    } catch (error) {
      console.error('Error creating UserProfile for Clerk ID:', id, error);
    }
  } else if (eventType === 'user.deleted') {
    await dbConnect();
    const { id } = evt.data;
    console.log('Deleting UserProfile for Clerk ID:', id);
    try {
      await UserProfile.deleteOne({ clerkId: id });
      console.log('UserProfile deleted successfully for Clerk ID:', id);
    } catch (error) {
      console.error('Error deleting UserProfile for Clerk ID:', id, error);
    }
  }

  return res.status(200).json({ response: 'Success' })
}
