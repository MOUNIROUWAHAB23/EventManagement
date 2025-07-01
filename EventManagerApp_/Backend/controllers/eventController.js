import Event from '../models/eventModel.js';

export const getAllEvents = async (req, res) => {
  const { page, limit, dateLimit, location } = req.query;
  const now = new Date();
  let filter = { date: { $gte: now } };

  if (dateLimit) {
    filter.date = { $gte: dateLimit };
  }
  if (location) {
    filter.location = location;
  }

  // Pagination
  if (page && limit) {
    const skip = (page - 1) * limit;
    const total = await Event.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const events = await Event.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email')
      .select('_id title imageUrl date location description createdBy');
    return res.json({
      events,
      total,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit)
    });
  }

  // Filtrage sans pagination
  if (dateLimit || location) {
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .select('_id title imageUrl date location description createdBy');
    return res.json(events);
  }

  // Tous les événements à venir (par défaut)
  const events = await Event.find({ date: { $gte: now } })
    .populate('createdBy', 'name email role')
    .select('_id title imageUrl date location description createdBy');
  res.json(events);
};

export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate('createdBy', 'name email')
    .select('_id title imageUrl date location description createdBy');
  if (!event) return res.status(404).json({ message: 'Event not found' });
  res.json(event);
};

export const createEvent = async (req, res) => {
  const { title, description, date, location, imageUrl } = req.body;
  const event = await Event.create({
    title,
    description,
    date,
    location,
    imageUrl: imageUrl || '', // fallback si non fourni
    createdBy: req.user.id
  });
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const updated = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, select: '_id title imageUrl date location description createdBy' }
  );
  res.json(updated);
};

export const deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Event deleted' });
};