import Registration from '../models/registrationModel.js';

export const getUserRegistrations = async (req, res) => {
  const {type,id} = req.query;
  const date = new Date();
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  let filter = {userId: id};
  if (type === 'upcoming') {
    filter = {...filter, eventDate: { $gte: date } };
  } else if (type === 'past') {
    filter = { ...filter, eventDate: { $lt: date } };
  }else if (type === 'now') {
    filter = { ...filter, eventDate: { $eq: date } };
  }else { 
    return res.status(400).json({ message: 'Invalid type parameter' });
  }

  const registrations = await Registration.find(filter).populate('eventId');
  res.json(registrations);
};

export const registerToEvent = async (req, res) => {
  const { eventId,id } = req.body;
  if (!eventId || !id) {
    return res.status(400).json({ message: 'Event ID and User ID are required' });
  }
  const existing = await Registration.findOne({ userId: id, eventId });
  if (existing) return res.status(409).json({ message: 'Already registered' });

  const registration = await Registration.create({ userId: id, eventId });
  res.status(201).json(registration);
};

export const unregisterFromEvent = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ message: 'Registration ID is required' });
  }
  const registration = await Registration.findById(req.params.id);
  if (!registration) {
    return res.status(404).json({ message: 'Registration not found' });
  }
  await Registration.findByIdAndDelete(req.params.id);
  res.json({ message: 'Successfully unregistered' });
};
