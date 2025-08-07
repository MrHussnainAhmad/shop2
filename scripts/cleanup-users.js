const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const UserProfileSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true, sparse: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true, sparse: true },
  phone: { type: String },
  addresses: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    streetAddress: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  }],
  createdAt: { type: Date, default: Date.now },
});

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);

async function cleanupUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log('Connected to database successfully');

    // Find all users
    const users = await UserProfile.find({});
    console.log(`Found ${users.length} users`);

    // Check for duplicates and issues
    const duplicateEmails = {};
    const duplicateClerkIds = {};
    const usersToFix = [];

    for (const user of users) {
      // Check for email duplicates
      if (user.email) {
        if (duplicateEmails[user.email]) {
          duplicateEmails[user.email].push(user);
        } else {
          duplicateEmails[user.email] = [user];
        }
      }

      // Check for clerkId duplicates
      if (user.clerkId) {
        if (duplicateClerkIds[user.clerkId]) {
          duplicateClerkIds[user.clerkId].push(user);
        } else {
          duplicateClerkIds[user.clerkId] = [user];
        }
      }

      // Check for users without clerkId
      if (!user.clerkId) {
        usersToFix.push(user);
      }
    }

    // Report duplicates
    for (const email in duplicateEmails) {
      if (duplicateEmails[email].length > 1) {
        console.log(`Duplicate email found: ${email} (${duplicateEmails[email].length} users)`);
        duplicateEmails[email].forEach((user, index) => {
          console.log(`  User ${index + 1}: ID=${user._id}, clerkId=${user.clerkId}, created=${user.createdAt}`);
        });
      }
    }

    for (const clerkId in duplicateClerkIds) {
      if (duplicateClerkIds[clerkId].length > 1) {
        console.log(`Duplicate clerkId found: ${clerkId} (${duplicateClerkIds[clerkId].length} users)`);
        duplicateClerkIds[clerkId].forEach((user, index) => {
          console.log(`  User ${index + 1}: ID=${user._id}, email=${user.email}, created=${user.createdAt}`);
        });
      }
    }

    if (usersToFix.length > 0) {
      console.log(`Found ${usersToFix.length} users without clerkId:`);
      usersToFix.forEach(user => {
        console.log(`  User: ID=${user._id}, email=${user.email}, created=${user.createdAt}`);
      });
    }

    // Provide suggestions for cleanup
    console.log('\n=== CLEANUP SUGGESTIONS ===');
    console.log('1. Remove duplicate users manually (keep the newest/most complete one)');
    console.log('2. For users without clerkId, either delete them or update with correct clerkId');
    console.log('3. Check if users can sign in and create addresses after cleanup');

    console.log('\nCleanup analysis complete');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the cleanup
cleanupUsers();
