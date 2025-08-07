import dbConnect from '@/lib/db';
import WebData from '@/models/WebData';

export default async function handler(req, res) {
  await dbConnect();
  console.log(`API WebData: Request Method - ${req.method}`);

  switch (req.method) {
    case 'GET':
      try {
        let webData = await WebData.findOne();
        console.log('API WebData: Found webData (GET) -', webData);
        if (!webData) {
          console.log('API WebData: No webData found, creating default...');
          const newWebData = await WebData.create({});
          console.log('API WebData: Created new webData -', newWebData);
          return res.status(200).json({ success: true, data: newWebData });
        }
        res.status(200).json({ success: true, data: webData });
      } catch (error) {
        console.error('API WebData: Error in GET -', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'POST': // Used for initial creation if no data exists
      try {
        console.log('API WebData: POST request body -', req.body);
        const webData = await WebData.create(req.body);
        console.log('API WebData: Created webData (POST) -', webData);
        res.status(201).json({ success: true, data: webData });
      } catch (error) {
        console.error('API WebData: Error in POST -', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        console.log('API WebData: PUT request body -', req.body);
        const webData = await WebData.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        console.log('API WebData: Updated/Upserted webData (PUT) -', webData);
        res.status(200).json({ success: true, data: webData });
      } catch (error) {
        console.error('API WebData: Error in PUT -', error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.status(400).json({ success: false, error: "Method not allowed" });
      break;
  }
}
