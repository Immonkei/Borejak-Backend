import * as service from './newsletter.service.js';

// Public subscribe
export async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const data = await service.subscribeEmail(email.toLowerCase());
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Public unsubscribe
export async function unsubscribe(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const data = await service.unsubscribeEmail(email.toLowerCase());
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// Admin list
export async function list(req, res, next) {
  try {
    const data = await service.listSubscribers();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
