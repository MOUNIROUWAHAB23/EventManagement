import Registration from '../models/registrationModel.js';
import Event from '../models/eventModel.js';
import Notification from '../models/notificationModel.js';

export const getUserRegistrations = async (req, res) => {
  const { type, id } = req.query;
  const date = new Date();
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // On récupère toutes les inscriptions de l'utilisateur avec l'event peuplé
  let registrations = await Registration.find({ userId: id })
  .populate({
    path: 'eventId',
    populate: { path: 'createdBy', select: 'name email' }
  });

  // On filtre selon la date de l'événement
  if (type === 'upcoming') {
    registrations = registrations.filter(r => r.eventId && new Date(r.eventId.date) >= date);
  } else if (type === 'past') {
    registrations = registrations.filter(r => r.eventId && new Date(r.eventId.date) < date);
  } else if (type === 'now') {
    registrations = registrations.filter(r => {
      if (!r.eventId || !r.eventId.date) return false;
      const eventDate = new Date(r.eventId.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  } else {
    return res.status(400).json({ message: 'Invalid type parameter' });
  }

  res.json(registrations);
};

export const registerToEvent = async (req, res) => {
  const { eventId, id } = req.body;
  if (!eventId || !id) {
    return res.status(400).json({ message: 'Event ID and User ID are required' });
  }
  const existing = await Registration.findOne({ userId: id, eventId });
  if (existing) return res.status(409).json({ message: 'Already registered' });

  const registration = await Registration.create({ userId: id, eventId });

  // Notification
  const event = await Event.findById(eventId);
  await Notification.create({
    userId: id,
    title: "Inscription confirmée",
    message: `Vous êtes inscrit à l'événement "${event?.title || ''}".`
  });

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
