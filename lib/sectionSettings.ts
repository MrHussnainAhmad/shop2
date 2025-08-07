import dbConnect from './db';
import WebData from '../models/WebData';

export async function getSectionSettings() {
  await dbConnect();
  
  try {
    let webData = await WebData.findOne({});
    
    if (!webData) {
      // Create default settings if none exist
      webData = await WebData.create({
        sectionSettings: {
          shopByBrandsVisible: true,
        },
      });
    }
    
    // Return default settings if sectionSettings doesn't exist
    return webData.sectionSettings || { shopByBrandsVisible: true };
  } catch (error) {
    console.error('Error fetching section settings:', error);
    // Return default settings on error
    return { shopByBrandsVisible: true };
  }
}
