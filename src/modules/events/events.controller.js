import * as service from './events.service.js';

export async function create(req, res, next) {
  try {
    const event = await service.createEvent(req.body);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const event = await service.updateEvent(req.params.id, req.body);
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await service.deleteEvent(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const events = await service.listEvents();
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
}

export async function detail(req, res, next) {
  try {
    const event = await service.getEvent(req.params.id);
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}
